import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Text "mo:base/Text";
//import Cycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";

actor ParentCanister {
  type HospitalRecord = {
    email: Text;
    password: Text;
    canisterId: Principal;
  };

 stable var hospitals: [HospitalRecord] = [];

  // IC management canister interface
  type IC = actor {
    create_canister : ({ settings: ?{ 
      freezing_threshold: ?Nat;
      controllers: ?[Principal];
      memory_allocation: ?Nat;
      compute_allocation: ?Nat;
    } }) -> async { canister_id: Principal };
    install_code : ({ 
      mode: { #install; #reinstall; #upgrade };
      canister_id: Principal;
      wasm_module: Blob;
      arg: Blob;
    }) -> async ();
  };

  public shared func createHospital(email: Text, password: Text) : async Result.Result<Principal, Text> {
    Debug.print("Attempting to create new canister for hospital: " # email);

    try {
      let settings = {
        freezing_threshold = null;
        controllers = ?[Principal.fromActor(ParentCanister)];
        memory_allocation = null;
        compute_allocation = null;
      };

      let ic : IC = actor("aaaaa-aa");
      //Cycles.add(1_000_000_000_000); // Add 1T cycles
      let result = await ic.create_canister({ settings = ?settings });
      
      let newCanister = result.canister_id;
      Debug.print("Created new canister with ID: " # Principal.toText(newCanister));

      // Install the hospital canister code
      let installResult = await installHospitalCode(ic, newCanister);
      switch (installResult) {
        case (#ok(_)) {
          hospitals := Array.append(hospitals, [{
            email = email;
            password = password;
            canisterId = newCanister;
          }]);
          #ok(newCanister)
        };
        case (#err(e)) {
          Debug.print("Error installing hospital code: " # e);
          #err("Failed to install hospital code: " # e)
        };
      };
    } catch (err) {
      Debug.print("Error creating canister: " # Error.message(err));
      #err("Failed to create canister: " # Error.message(err))
    }
  };

  public shared query func login(email: Text, password: Text) : async ?Principal {
    Debug.print("Attempting login for email: " # email);
    for (hospital in hospitals.vals()) {
      if (hospital.email == email and hospital.password == password) {
        Debug.print("Login successful for: " # email);
        return ?hospital.canisterId;
      };
    };

    Debug.print("Login failed for: " # email);
    null
  };

  public query func listHospitals() : async [{ email: Text; canisterId: Principal }] {
    Array.map(hospitals, func(hospital: HospitalRecord) : { email: Text; canisterId: Principal } {
      { email = hospital.email; canisterId = hospital.canisterId }
    })
  };

  // Helper function to install hospital canister code
  private func installHospitalCode(ic: IC, canisterId: Principal) : async Result.Result<(), Text> {
    try {
      // In a production environment, you would need to have your Wasm module
      // pre-compiled and available. For this example, we'll use a placeholder.
      let wasmModule : [Nat8] = [
        0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00
      ];

      let arg = []; // Replace with initialization arguments if needed

      await ic.install_code({
        mode = #install;
        canister_id = canisterId;
        wasm_module = Blob.fromArray(wasmModule);
        arg = Blob.fromArray(arg);
      });
      #ok(())
    } catch (err) {
      #err("Failed to install hospital code: " # Error.message(err))
    }
  };
};