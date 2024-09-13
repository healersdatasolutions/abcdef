import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";


actor Hospital {

  type MedicalHistory = {
    pharmacy: Text;
    physician: Text;
    event: Text;
    prescription: Text;
    remedies: Text;
  };
  type TestReport = {
    doctor: Text;
    referedto: Text;
    testtype: Text;
    comments: Text;
    file: Blob;

  };
  type Patient = {
    name: Text;
    age: Nat;
    gender: Text;
    location: Text;
    blood: Text;
    height: Nat;
    weight: Nat;
    medicalHistories: [MedicalHistory];
    testReports: [TestReport];
    //visitDate: Int; // Timestamp of the last visit
  };

  

   var patients: [Patient] = [];
   var nextPatientId: Nat = 0;


  public shared({caller}) func addPatient(
    name: Text,
    age: Nat,
    gender: Text,
    location: Text,
    blood: Text,
    height: Nat,
    weight: Nat,
    medicalHistories: [MedicalHistory],
    testReports : [TestReport]
  ) : async Nat {
    let newPatient: Patient = {
      name = name;
      age = age;
      gender = gender;
      location = location;
      blood = blood;
      height = height;
      weight = weight;
      medicalHistories = medicalHistories;
      testReports = testReports;
      //visitDate = Time.now();
    };

 
    patients := Array.append<Patient>(patients, [newPatient]);

    nextPatientId += 1;

    return nextPatientId; 
  };

  public query func getPatientById(id: Nat) : async ?Patient {
    if (id < patients.size()) {
      return ?patients[id];
    };
    return null;
  };


  public query func listPatients() : async [Patient] {
    return patients;
  };

  
};
