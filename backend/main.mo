import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let contactRequests = Map.empty<Text, ContactRequest>();
  var nextRequestId = 1;

  let episodes = Map.empty<Text, Episode>();
  var nextEpisodeId = 1;

  let characters = Map.empty<Text, Character>();
  var nextCharacterId = 1;

  let contents = Map.empty<Text, Content>();
  var nextContentId = 1;

  // Initialize Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // CRUD Operations for Episodes
  public shared ({ caller }) func createEpisode(newEpisode : NewEpisode) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create episodes");
    };
    let episodeId = nextEpisodeId.toText();
    let episode : Episode = {
      id = episodeId;
      title = newEpisode.title;
      description = newEpisode.description;
      videoUrl = newEpisode.videoUrl;
      thumbnailUrl = newEpisode.thumbnailUrl;
      episodeNumber = newEpisode.episodeNumber;
      seasonNumber = newEpisode.seasonNumber;
    };
    episodes.add(episodeId, episode);
    nextEpisodeId += 1;
    episodeId;
  };

  public shared ({ caller }) func updateEpisode(episodeId : Text, updatedEpisode : NewEpisode) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update episodes");
    };
    switch (episodes.get(episodeId)) {
      case (null) {
        Runtime.trap("Unable to update episode. Episode [" # episodeId # "] not found");
      };
      case (_) {
        let episode : Episode = {
          id = episodeId;
          title = updatedEpisode.title;
          description = updatedEpisode.description;
          videoUrl = updatedEpisode.videoUrl;
          thumbnailUrl = updatedEpisode.thumbnailUrl;
          episodeNumber = updatedEpisode.episodeNumber;
          seasonNumber = updatedEpisode.seasonNumber;
        };
        episodes.add(episodeId, episode);
      };
    };
  };

  public shared ({ caller }) func deleteEpisode(episodeId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete episodes");
    };
    if (not episodes.containsKey(episodeId)) {
      Runtime.trap("Unable to delete episode. Episode [" # episodeId # "] not found");
    };
    episodes.remove(episodeId);
  };

  public query ({ caller }) func getEpisode(episodeId : Text) : async ?Episode {
    episodes.get(episodeId);
  };

  public query ({ caller }) func getAllEpisodes() : async [Episode] {
    episodes.values().toArray();
  };

  // CRUD Operations for Characters
  public shared ({ caller }) func createCharacter(newCharacter : NewCharacter) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create characters");
    };

    let characterId = nextCharacterId.toText();
    let character : Character = {
      id = characterId;
      name = newCharacter.name;
      bio = newCharacter.bio;
      imageUrl = newCharacter.imageUrl;
      weapon = newCharacter.weapon;
      power = newCharacter.power;
      role = newCharacter.role;
      traits = newCharacter.traits;
    };

    characters.add(characterId, character);
    nextCharacterId += 1;

    characterId;
  };

  public shared ({ caller }) func updateCharacter(characterId : Text, updatedCharacter : NewCharacter) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update characters");
    };

    switch (characters.get(characterId)) {
      case (null) { Runtime.trap("Unable to update character. Character [" # characterId # "] not found") };
      case (_) {
        let character : Character = {
          id = characterId;
          name = updatedCharacter.name;
          bio = updatedCharacter.bio;
          imageUrl = updatedCharacter.imageUrl;
          weapon = updatedCharacter.weapon;
          power = updatedCharacter.power;
          role = updatedCharacter.role;
          traits = updatedCharacter.traits;
        };
        characters.add(characterId, character);
      };
    };
  };

  public shared ({ caller }) func deleteCharacter(characterId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete characters");
    };

    if (not characters.containsKey(characterId)) {
      Runtime.trap("Unable to delete character. Character [" # characterId # "] not found");
    };

    characters.remove(characterId);
  };

  public query ({ caller }) func getCharacter(characterId : Text) : async ?Character {
    characters.get(characterId);
  };

  public query ({ caller }) func getAllCharacters() : async [Character] {
    characters.values().toArray();
  };

  // CRUD Operations for Content
  public shared ({ caller }) func createContent(newContent : NewContent) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create content");
    };

    let contentId = nextContentId.toText();
    let content : Content = {
      id = contentId;
      contentType = newContent.contentType;
      title = newContent.title;
      body = newContent.body;
      imageUrl = newContent.imageUrl;
    };

    contents.add(contentId, content);
    nextContentId += 1;

    contentId;
  };

  public shared ({ caller }) func updateContent(contentId : Text, updatedContent : NewContent) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };

    switch (contents.get(contentId)) {
      case (null) { Runtime.trap("Unable to update content. Content [" # contentId # "] not found") };
      case (_) {
        let content : Content = {
          id = contentId;
          contentType = updatedContent.contentType;
          title = updatedContent.title;
          body = updatedContent.body;
          imageUrl = updatedContent.imageUrl;
        };
        contents.add(contentId, content);
      };
    };
  };

  public shared ({ caller }) func deleteContent(contentId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete content");
    };

    if (not contents.containsKey(contentId)) {
      Runtime.trap("Unable to delete content. Content [" # contentId # "] not found");
    };

    contents.remove(contentId);
  };

  public query ({ caller }) func getContent(contentId : Text) : async ?Content {
    contents.get(contentId);
  };

  public query ({ caller }) func getAllContents() : async [Content] {
    contents.values().toArray();
  };

  // CRUD Operations for Contact Requests (Admin Only)
  public shared ({ caller }) func updateRequestStatus(requestId : Text, processed : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update requests");
    };
    switch (contactRequests.get(requestId)) {
      case (null) {
        Runtime.trap("Unable to update request. Request [" # requestId # "] not found");
      };
      case (?existingRequest) {
        let updatedRequest = { existingRequest with processed };
        contactRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func deleteContactRequest(requestId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete contact requests");
    };
    if (not contactRequests.containsKey(requestId)) {
      Runtime.trap("Unable to delete contact request. Request [" # requestId # "] not found");
    };
    contactRequests.remove(requestId);
  };

  public query ({ caller }) func getAllRequests() : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can export contact requests");
    };
    contactRequests.values().toArray();
  };

  public query ({ caller }) func getRequestsByTopic(requestedTopic : Topics) : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can read topic requests");
    };

    let filteredList = List.empty<ContactRequest>();
    for (request in contactRequests.values()) {
      if (request.topic == requestedTopic) {
        filteredList.add(request);
      };
    };
    filteredList.toArray();
  };

  public query ({ caller }) func getRequestsByStatus(processed : Bool) : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can export contact requests");
    };
    let filteredList = List.empty<ContactRequest>();
    for (request in contactRequests.values()) {
      if (request.processed == processed) {
        filteredList.add(request);
      };
    };
    filteredList.toArray();
  };

  public shared ({ caller }) func submitRequest(input : NewRequest) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #guest)) {
      Runtime.trap("Unauthorized: Permission denied");
    };

    if (input.email.isEmpty()) {
      Runtime.trap("Please enter your email address");
    };
    if (input.message.size() < 10 or input.message.size() > 1000) {
      Runtime.trap("Message length must be between 10 and 1000 characters");
    };

    let requestId = nextRequestId.toText();
    let newRequest : ContactRequest = {
      id = requestId;
      email = input.email;
      topic = input.topic;
      message = input.message;
      timestamp = Time.now();
      processed = false;
    };

    contactRequests.add(requestId, newRequest);
    nextRequestId += 1;
    requestId;
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Grant Admin Role
  public shared ({ caller }) func grantAdminRole(userPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant admin permissions");
    };
    AccessControl.assignRole(accessControlState, caller, userPrincipal, #admin);
  };
};
