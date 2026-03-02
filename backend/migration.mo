import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type Episode = {
    id : Text;
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

  type OldActor = {
    episodes : Map.Map<Text, Episode>;
    nextEpisodeId : Nat;
    characters : Map.Map<Text, Character>;
    nextCharacterId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    contents : Map.Map<Text, Content>;
    nextContentId : Nat;
  };

  type NewActor = {
    episodes : Map.Map<Text, Episode>;
    nextEpisodeId : Nat;
    characters : Map.Map<Text, Character>;
    nextCharacterId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    contents : Map.Map<Text, Content>;
    nextContentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      episodes = old.episodes;
      nextEpisodeId = old.nextEpisodeId;
      characters = old.characters;
      nextCharacterId = old.nextCharacterId;
      userProfiles = old.userProfiles;
      contents = old.contents;
      nextContentId = old.nextContentId;
    };
  };
};
