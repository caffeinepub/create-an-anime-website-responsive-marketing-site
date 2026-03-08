import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Worldbuilding = {
    clans : [Clan];
    clanEyeRules : [ClanEyeRule];
    powerSystem : [PowerSystemElement];
    rankSystem : [Rank];
    shiranagiFamily : ShiranagiFamily;
  };

  type Rank = {
    title : Text;
    description : Text;
    privileges : [Text];
    responsibilities : [Text];
    rankingRequirements : [Text];
    order : Nat;
    symbol : Text;
  };

  type Clan = {
    name : Text;
    description : Text;
    uniqueAbilities : [Text];
    notableMembers : [Text];
    symbol : Text;
  };

  type ClanEyeRule = {
    description : Text;
    symbol : Text;
  };

  type PowerSystemElement = {
    name : Text;
    description : Text;
    categories : [Text];
    masteryLevels : [Text];
    symbol : Text;
  };

  type ShiranagiFamily = {
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

  type Episode = {
    id : Text;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    episodeNumber : Nat;
    seasonNumber : Nat;
  };

  type NewEpisode = {
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    episodeNumber : Nat;
    seasonNumber : Nat;
  };

  type Character = {
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

  type NewCharacter = {
    name : Text;
    bio : Text;
    imageUrl : Text;
    weapon : Text;
    power : Text;
    role : Text;
    traits : [Text];
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  type Content = {
    id : Text;
    contentType : Text;
    title : Text;
    body : Text;
    imageUrl : ?Text;
  };

  type NewContent = {
    contentType : Text;
    title : Text;
    body : Text;
    imageUrl : ?Text;
  };

  // Old actor state without referrals
  type OldActor = {
    contactRequests : Map.Map<Text, ContactRequest>;
    nextRequestId : Nat;
    episodes : Map.Map<Text, Episode>;
    nextEpisodeId : Nat;
    characters : Map.Map<Text, Character>;
    nextCharacterId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    worldbuilding : Map.Map<Text, Worldbuilding>;
    contents : Map.Map<Text, Content>;
    nextContentId : Nat;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
