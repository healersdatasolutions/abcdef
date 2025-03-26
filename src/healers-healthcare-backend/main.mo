import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Hospital "./hospital"; 
import IC "mo:ic";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

actor Parent {
    type User = {
        name: Text;
        username: Text;
        password: Text;
        canisterId: ?Principal;
    };
    type Admin = {
        name: Text;
        username: Text;
        password: Text;
        hospitalName: Text;
    };

    type GeneralUser = {
        name: Text;
        username: Text;
        password: Text;
    };

    var users: [(Text, User)] = [];
    var admins: [(Text, Admin)] = [];
    var generalUsers: [(Text, GeneralUser)] = [];
    var canisters: [(Text, Principal)] = [];

    let ic: IC.Service = actor "aaaaa-aa";

    public shared({caller}) func registerGeneralUser(name: Text, username: Text, password: Text) : async Result.Result<Text, Text> {
    try {
        let generalUser: GeneralUser = {
            name = name;
            username = username;
            password = password;
        };

        generalUsers := Array.append(generalUsers, [(username, generalUser)]);
        #ok("General user registered successfully.")
    } catch (e) {
        #err("Error registering user: " # Error.message(e))
    }
};

    public shared({caller}) func loginGeneralUser(username: Text, password: Text) : async Bool {
        for ((storedUsername, generalUser) in generalUsers.vals()) {
            if (storedUsername == username and generalUser.password == password) {
                return true;
            };
        };
        return false;
    };

    public query func listGeneralUsers() : async [(Text, Text)] {
    return Array.map<(Text, GeneralUser), (Text, Text)>(
        generalUsers, 
        func(pair: (Text, GeneralUser)) : (Text, Text) {
            let (username, generalUser) = pair;
            return (generalUser.name, username);
        }
    );
};



// function to register the hospital
    public shared({caller}) func registerHospital(name: Text, username: Text, password: Text) : async Text {
        // Create a new canister (hospital)
        Cycles.add(1_000_000_000_000);
        let newCanister = await Hospital.Hospital(name);

        let newCanisterId = Principal.fromActor(newCanister);

        let user: User = {
            name = name;
            username = username;
            password = password;
            canisterId = ?newCanisterId;
        };

        users := Array.append(users, [(username, user)]);
        canisters := Array.append(canisters, [(name, newCanisterId)]);

        // Set the admin for the new hospital canister
        ignore await newCanister.setAdmin(username, password);

        return "Hospital registered and canister created with ID: " # Principal.toText(newCanisterId);
    };

    public shared({caller}) func loginUser(username: Text, password: Text) : async ?Principal {
        for ((storedUsername, user) in users.vals()) {
            if (storedUsername == username and user.password == password) {
                return user.canisterId;
            }
        };
        return null;
    };

    public query func listUsers() : async [(Text, ?Principal)] {
        var userList: [(Text, ?Principal)] = [];
        for ((username, user) in users.vals()) {
            userList := Array.append(userList, [(username, user.canisterId)]);
        };
        return userList;
    };

    // New function to list hospital names
    public query func listHospitals() : async [(Text, Principal)] {
        return canisters;
    };

    // New function for admin registration
    public shared({caller}) func registerAdmin(name: Text, username: Text, password: Text, hospitalName: Text) : async Text {
        if (Array.size(canisters) == 0) {
            return "No hospitals available for registration";
        };

        let hospitalExists = Array.find<(Text, Principal)>(canisters, func((name, _)) { name == hospitalName });
        
        switch (hospitalExists) {
            case (null) { return "Hospital not found"; };
            case (?(_, canisterId)) {
                let admin: Admin = {
                    name = name;
                    username = username;
                    password = password;
                    hospitalName = hospitalName;
                };
                admins := Array.append(admins, [(username, admin)]);

                // Set the admin for the existing hospital canister
                let hospital : Hospital.Hospital = actor(Principal.toText(canisterId));
                ignore await hospital.setAdmin(username, password);

                return "Admin registered successfully";
            };
        };
    };

    // Static CORS headers function
    func corsHeaders() : [Text] {
        return [
            "Access-Control-Allow-Origin: https://gyoj3-uaaaa-aaaap-qkfra-cai.icp0.io",
            "Access-Control-Allow-Methods: GET, PUT, POST, DELETE",
            "Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept",
            "Access-Control-Allow-Credentials: true"
        ];
    };

    // New function for admin login
    public shared({caller}) func loginAdmin(username: Text, password: Text) : async ?Principal {
        for ((storedUsername, admin) in admins.vals()) {
            if (storedUsername == username and admin.password == password) {
                for ((hospitalName, canisterId) in canisters.vals()) {
                    if (hospitalName == admin.hospitalName) {
                        return ?canisterId;
                    };
                };
            };
        };
        return null;
    };
}
