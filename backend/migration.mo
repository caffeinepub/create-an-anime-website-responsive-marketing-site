import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  type OldCharacter = {
    id : Text;
    name : Text;
    bio : Text;
    imageUrl : Text;
    weapon : Text;
    power : Text;
    role : Text;
    traits : [Text];
  };

  type OldActor = {
    characters : Map.Map<Text, OldCharacter>;
  };

  type NewCharacter = {
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

  type NewActor = {
    characters : Map.Map<Text, NewCharacter>;
  };

  public func run(old : OldActor) : NewActor {
    // Convert all old characters to new ones with default displayOrder
    let newCharacters = old.characters.map<Text, OldCharacter, NewCharacter>(
      func(_id, oldCharacter) {
        { oldCharacter with displayOrder = 0 }; // Default value for migration
      }
    );
    { characters = newCharacters };
  };
};
