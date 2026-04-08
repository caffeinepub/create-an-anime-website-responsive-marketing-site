import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";



actor {
  // ─── AUTHORIZATION TYPES ──────────────────────────────────────────────────

  type UserRole = { #admin; #user; #guest };

  // ─── AUTHORIZATION STATE ──────────────────────────────────────────────────

  let roles = Map.empty<Principal, UserRole>();
  var firstAdmin : ?Principal = null;

  // ─── AUTHORIZATION HELPERS ────────────────────────────────────────────────

  func getUserRole(caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #guest };
    switch (roles.get(caller)) {
      case (?role) { role };
      case null {
        // First authenticated user becomes admin
        switch (firstAdmin) {
          case null {
            firstAdmin := ?caller;
            roles.add(caller, #admin);
            #admin;
          };
          case (?_) { #user };
        };
      };
    };
  };

  func isAdmin(caller : Principal) : Bool {
    getUserRole(caller) == #admin;
  };

  func hasPermission(caller : Principal, required : UserRole) : Bool {
    let role = getUserRole(caller);
    switch (required) {
      case (#guest) { true };
      case (#user) { role == #user or role == #admin };
      case (#admin) { role == #admin };
    };
  };

  // ─── AUTHORIZATION PUBLIC METHODS ─────────────────────────────────────────

  public query ({ caller }) func getMyRole() : async Text {
    switch (getUserRole(caller)) {
      case (#admin) { "admin" };
      case (#user) { "user" };
      case (#guest) { "guest" };
    };
  };

  public shared ({ caller }) func assignRole(user : Principal, role : UserRole) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    roles.add(user, role);
  };

  public shared ({ caller }) func initialize() : async () {
    // Trigger role init for caller (first caller becomes admin)
    ignore getUserRole(caller);
  };

  // ─── DOMAIN TYPES ─────────────────────────────────────────────────────────

  public type Worldbuilding = {
    clans : [Clan];
    clanEyeRules : [ClanEyeRule];
    powerSystem : [PowerSystemElement];
    rankSystem : [Rank];
    shiranagiFamily : ShiranagiFamily;
  };

  public type Clan = {
    name : Text;
    description : Text;
    uniqueAbilities : [Text];
    notableMembers : [Text];
    symbol : Text;
  };

  public type ClanEyeRule = {
    description : Text;
    symbol : Text;
  };

  public type PowerSystemElement = {
    name : Text;
    description : Text;
    categories : [Text];
    masteryLevels : [Text];
    symbol : Text;
  };

  public type Rank = {
    title : Text;
    description : Text;
    privileges : [Text];
    responsibilities : [Text];
    rankingRequirements : [Text];
    order : Nat;
    symbol : Text;
  };

  public type ShiranagiFamily = {
    history : Text;
    bloodlinePowers : [Text];
    notableMembers : [Text];
    affiliations : [Text];
    coreEthos : Text;
    symbols : [Text];
    familyValues : [Text];
    evolutionOverTime : Text;
  };

  type Topics = {
    #businessPartnerships;
    #advertisingInquiries;
    #interviewRequests;
    #eventOrWorkshopProposals;
    #publishingSubmissions;
    #challengesAndBounties;
    #generalInquiries;
  };

  type ContactRequest = {
    id : Text;
    email : Text;
    message : Text;
    topic : Topics;
    timestamp : Time.Time;
    processed : Bool;
  };

  type NewRequest = {
    email : Text;
    topic : Topics;
    message : Text;
  };

  public type Episode = {
    id : Text;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    episodeNumber : Nat;
    seasonNumber : Nat;
  };

  public type NewEpisode = {
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    episodeNumber : Nat;
    seasonNumber : Nat;
  };

  public type Character = {
    id : Text;
    name : Text;
    bio : Text;
    imageUrl : Text;
    weapon : Text;
    power : Text;
    role : Text;
    traits : [Text];
    displayOrder : Nat;
  };

  public type NewCharacter = {
    name : Text;
    bio : Text;
    imageUrl : Text;
    weapon : Text;
    power : Text;
    role : Text;
    traits : [Text];
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type Content = {
    id : Text;
    contentType : Text;
    title : Text;
    body : Text;
    imageUrl : ?Text;
  };

  public type NewContent = {
    contentType : Text;
    title : Text;
    body : Text;
    imageUrl : ?Text;
  };

  public type ReferralSource = {
    id : Text;
    source : Text;
    otherText : ?Text;
    timestamp : Time.Time;
  };

  public type NewReferral = {
    source : Text;
    otherText : ?Text;
  };

  // ─── DOMAIN STATE ─────────────────────────────────────────────────────────

  let contactRequests = Map.empty<Text, ContactRequest>();
  var nextRequestId = 1;

  let episodes = Map.empty<Text, Episode>();
  var nextEpisodeId = 1;

  let characters = Map.empty<Text, Character>();
  var nextCharacterId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  let worldbuilding = Map.empty<Text, Worldbuilding>();

  let contents = Map.empty<Text, Content>();
  var nextContentId = 1;

  let referrals = Map.empty<Text, ReferralSource>();
  var nextReferralId = 1;

  // ─── USER PROFILE METHODS ─────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not hasPermission(caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not hasPermission(caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ─── WORLDBUILDING METHODS ────────────────────────────────────────────────

  public query ({}) func getWorldbuilding() : async ?Worldbuilding {
    worldbuilding.get("worldbuilding");
  };

  public shared ({ caller }) func setWorldbuilding(worldbuildingData : Worldbuilding) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can modify worldbuilding");
    };
    worldbuilding.add("worldbuilding", worldbuildingData);
  };

  // ─── CHARACTER METHODS ────────────────────────────────────────────────────

  // Returns characters with imageUrl omitted (empty string) to stay within the 3MB ICP payload limit.
  public query ({}) func getCharacters() : async [Character] {
    characters.values().map<Character, Character>(func(c) { { c with imageUrl = "" } }).toArray();
  };

  // Alias for getCharacters — lightweight list without imageUrl for admin dashboard.
  public query ({}) func getCharactersMetadata() : async [Character] {
    characters.values().map<Character, Character>(func(c) { { c with imageUrl = "" } }).toArray();
  };

  // Returns the full Character record including imageUrl for individual character detail fetching.
  public query ({}) func getCharacterById(id : Text) : async ?Character {
    characters.get(id);
  };

  // Returns just the imageUrl for a single character — use for lazy-loading images one at a time.
  public query ({}) func getCharacterImage(id : Text) : async ?Text {
    switch (characters.get(id)) {
      case null { null };
      case (?c) { ?c.imageUrl };
    };
  };

  public shared ({ caller }) func addCharacter(newChar : NewCharacter) : async Character {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add characters");
    };
    let id = nextCharacterId.toText();
    nextCharacterId += 1;
    let character : Character = {
      id = id;
      name = newChar.name;
      bio = newChar.bio;
      imageUrl = newChar.imageUrl;
      weapon = newChar.weapon;
      power = newChar.power;
      role = newChar.role;
      traits = newChar.traits;
      displayOrder = nextCharacterId - 1;
    };
    characters.add(id, character);
    character;
  };

  public shared ({ caller }) func updateCharacter(id : Text, updatedChar : NewCharacter) : async ?Character {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update characters");
    };
    switch (characters.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Character = {
          id = existing.id;
          name = updatedChar.name;
          bio = updatedChar.bio;
          imageUrl = updatedChar.imageUrl;
          weapon = updatedChar.weapon;
          power = updatedChar.power;
          role = updatedChar.role;
          traits = updatedChar.traits;
          displayOrder = existing.displayOrder;
        };
        characters.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteCharacter(id : Text) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete characters");
    };
    characters.remove(id);
  };

  public shared ({ caller }) func saveCharacterOrder(orderedIds : [Text]) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can reorder characters");
    };
    var order = 0;
    for (id in orderedIds.values()) {
      switch (characters.get(id)) {
        case null {};
        case (?existing) {
          let updated : Character = {
            id = existing.id;
            name = existing.name;
            bio = existing.bio;
            imageUrl = existing.imageUrl;
            weapon = existing.weapon;
            power = existing.power;
            role = existing.role;
            traits = existing.traits;
            displayOrder = order;
          };
          characters.add(id, updated);
          order += 1;
        };
      };
    };
  };

  // ─── EPISODE METHODS ──────────────────────────────────────────────────────

  public query ({}) func getEpisodes() : async [Episode] {
    episodes.values().toArray();
  };

  public shared ({ caller }) func addEpisode(newEp : NewEpisode) : async Episode {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add episodes");
    };
    let id = nextEpisodeId.toText();
    nextEpisodeId += 1;
    let episode : Episode = {
      id = id;
      title = newEp.title;
      description = newEp.description;
      videoUrl = newEp.videoUrl;
      thumbnailUrl = newEp.thumbnailUrl;
      episodeNumber = newEp.episodeNumber;
      seasonNumber = newEp.seasonNumber;
    };
    episodes.add(id, episode);
    episode;
  };

  public shared ({ caller }) func updateEpisode(id : Text, updatedEp : NewEpisode) : async ?Episode {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update episodes");
    };
    switch (episodes.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Episode = {
          id = existing.id;
          title = updatedEp.title;
          description = updatedEp.description;
          videoUrl = updatedEp.videoUrl;
          thumbnailUrl = updatedEp.thumbnailUrl;
          episodeNumber = updatedEp.episodeNumber;
          seasonNumber = updatedEp.seasonNumber;
        };
        episodes.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteEpisode(id : Text) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete episodes");
    };
    episodes.remove(id);
  };

  // ─── CONTENT METHODS ──────────────────────────────────────────────────────

  public query ({}) func getContentById(id : Text) : async ?Content {
    contents.get(id);
  };

  public shared ({ caller }) func addContent(newContent : NewContent) : async Content {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add content");
    };
    let id = nextContentId.toText();
    nextContentId += 1;
    let content : Content = {
      id = id;
      contentType = newContent.contentType;
      title = newContent.title;
      body = newContent.body;
      imageUrl = newContent.imageUrl;
    };
    contents.add(id, content);
    content;
  };

  public shared ({ caller }) func updateContent(id : Text, updatedContent : NewContent) : async ?Content {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    switch (contents.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Content = {
          id = existing.id;
          contentType = updatedContent.contentType;
          title = updatedContent.title;
          body = updatedContent.body;
          imageUrl = updatedContent.imageUrl;
        };
        contents.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteContent(id : Text) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete content");
    };
    contents.remove(id);
  };

  // ─── CONTACT REQUEST METHODS ──────────────────────────────────────────────

  public shared ({}) func submitContactRequest(request : NewRequest) : async ContactRequest {
    let id = nextRequestId.toText();
    nextRequestId += 1;
    let contactRequest : ContactRequest = {
      id = id;
      email = request.email;
      message = request.message;
      topic = request.topic;
      timestamp = Time.now();
      processed = false;
    };
    contactRequests.add(id, contactRequest);
    contactRequest;
  };

  public query ({ caller }) func getContactRequests() : async [ContactRequest] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view contact requests");
    };
    contactRequests.values().toArray();
  };

  public shared ({ caller }) func markContactRequestProcessed(id : Text) : async Bool {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can process contact requests");
    };
    switch (contactRequests.get(id)) {
      case null { false };
      case (?existing) {
        let updated : ContactRequest = {
          id = existing.id;
          email = existing.email;
          message = existing.message;
          topic = existing.topic;
          timestamp = existing.timestamp;
          processed = true;
        };
        contactRequests.add(id, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteContactRequest(id : Text) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete contact requests");
    };
    contactRequests.remove(id);
  };

  // ─── REFERRAL METHODS ─────────────────────────────────────────────────────

  public shared func submitReferral(newReferral : NewReferral) : async ReferralSource {
    let id = nextReferralId.toText();
    nextReferralId += 1;
    let referral : ReferralSource = {
      id = id;
      source = newReferral.source;
      otherText = newReferral.otherText;
      timestamp = Time.now();
    };
    referrals.add(id, referral);
    referral;
  };

  public query ({ caller }) func getReferrals() : async [ReferralSource] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view referrals");
    };
    referrals.values().toArray();
  };

  public shared ({ caller }) func deleteReferral(id : Text) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete referrals");
    };
    referrals.remove(id);
  };
};
