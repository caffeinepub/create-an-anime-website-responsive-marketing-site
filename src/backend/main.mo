import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Persistent Storage
  let contactRequests = Map.empty<Text, ContactRequest>();
  var nextRequestId = 1;

  // Initialize Access Control State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profiles Storage
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Type Definitions
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

  // Admin Management Function
  public shared ({ caller }) func grantAdminRole(userPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant admin permissions");
    };
    AccessControl.assignRole(accessControlState, caller, userPrincipal, #admin);
  };

  // Contact Request Functions
  public shared ({ caller }) func submitRequest(input : NewRequest) : async Text {
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

  // Export All Requests (Admin Only)
  public query ({ caller }) func getAllRequests() : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only site admin can export contact requests");
    };
    let valuesIter = contactRequests.values();
    valuesIter.toArray();
  };

  // Get by Topic (Admin Only)
  public query ({ caller }) func getRequestsByTopic(requestedTopic : Topics) : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only site admin can read topic requests");
    };

    let filteredList = List.empty<ContactRequest>();
    for (request in contactRequests.values()) {
      if (request.topic == requestedTopic) {
        filteredList.add(request);
      };
    };
    filteredList.toArray();
  };

  // Get by Status (Admin Only)
  public query ({ caller }) func getRequestsByStatus(processed : Bool) : async [ContactRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only site admin can export contact requests");
    };

    let filteredList = List.empty<ContactRequest>();
    for (request in contactRequests.values()) {
      if (request.processed == processed) {
        filteredList.add(request);
      };
    };
    filteredList.toArray();
  };

  // Change Request Status (Admin Only)
  public shared ({ caller }) func updateRequestStatus(requestId : Text, processed : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only site admin can update requests");
    };

    switch (contactRequests.get(requestId)) {
      case (null) { Runtime.trap("Unable to update request. Request [" # requestId # "] not found") };
      case (?existingRequest) {
        let updatedRequest = {
          existingRequest with
          processed
        };
        contactRequests.add(requestId, updatedRequest);
      };
    };
  };
};
