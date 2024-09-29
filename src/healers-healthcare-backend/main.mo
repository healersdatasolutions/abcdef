import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";


actor ParentCanister {

  type HospitalRecord = {
    email: Text;
    password: Text;
    canisterId: Principal;
  };

  var hospitals: [HospitalRecord] = [];

  public func createHospital(email: Text, password: Text) : async () {
    try {
        // Code for creating the canister
        let newCanisterId = await System.createCanister();

       
        hospitals := Array.append(hospitals, [{
            email = email;
            password = password;
            canisterId = newCanisterId;
        }]);

        Debug.print("New hospital created with Canister ID: " # Principal.toText(newCanisterId));

    } catch (err) {
       
        Debug.print("Error creating canister: " # Debug.show(err));
    }
};


  // Function for interacting with management canister to create canisters
  private func createNewHospitalCanister() : async ?Principal {
    let managementCanister = actor "aaaaa-aa" : actor {
      create_canister : () -> async (canister_id : Principal);
      install_code : (canister_id : Principal, wasm_module : Blob) -> async ();
    };

    try {

      Debug.print("Attempting to create new canister.");

      let canisterId = await managementCanister.create_canister();

      Debug.print("Canister created: " # Principal.toText(canisterId));

      return ?canisterId;
    } catch (err) {
      // Debugging: Log the error message
      //Debug.print("Error creating canister: " # err);

      return null;  
    };
  };

  public shared query func login(email: Text, password: Text) : async ?Principal {
    for (hospital in hospitals.vals()) {
      if (hospital.email == email and hospital.password == password) {
        Debug.print("Login successful for: " # email);
        return ?hospital.canisterId;
      };
    };

    Debug.print("Login failed for: " # email);
    return null;
  };

  public query func listHospitals() : async [HospitalRecord] {
    // Explicitly specify the map function with types
    let hospitalCanisterIds = Array.map<HospitalRecord, Text>(hospitals, func(hospital: HospitalRecord) : Text {
        return Principal.toText(hospital.canisterId);
    });

    let canisterIdListText = Array.foldLeft<Text, Text>(hospitalCanisterIds, "", func(acc: Text, idText: Text) : Text {
        return acc # idText # ", ";
    });

    Debug.print("Listing hospitals: " # canisterIdListText);

    return hospitals;
};

};
