import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Hospital "./hospital"; // Refers to the canister you want to create
import IC "mo:ic";



 
actor Parent {
    type User = {
        username: Text;
        password: Text;
        canisterId: ?Principal;
    };

    var users: [(Text, User)] = []; // Store users with username and data
    var canisters: [(Text, Principal)] = []; 

private let ic : IC.Service = actor "aaaaa-aa";



    public shared({caller}) func registerUser(username: Text, password: Text) : async Text {
       
       

        // Create a new canister (hospital)
        Cycles.add(1_000_000_000_000);
        let newCanister = await Hospital.Hospital("user1");

        let newCanisterId = Principal.fromActor(newCanister);

        let user: User = {
            username = username;
            password = password;
            canisterId = ?newCanisterId;
        };

        // Add user to the list
        users := Array.append(users, [(username, user)]);
        canisters := Array.append(canisters, [(username, newCanisterId)]);

        return "User registered and canister created with ID: " # Principal.toText(newCanisterId);
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
}
