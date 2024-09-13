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
    date: Int; // Timestamp of the last visit
  };

 type Appointment={
    patientName : Text;
    patientAge : Text;
    gender : Text;
    contact : Nat;
    email : Text;
    doctor : Text;
    date : Int;
    appTime : Text;
    consultation : Text;
    existingConditions: [Text];
    currentMedications : Text;
    allergies : Text;
    nOfVisits : Nat;
    insuranceProvider : Text;
    emergencyContactName : Text;
    emergencyContactPhone : Nat;   
    appDate : Int;

  };
  

   var patients: [Patient] = [];
   var nextPatientId: Nat = 0;

var appointments: [Appointment] = [];

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
      date = Time.now();
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

  public shared ({caller}) func addAppointment (
    patientName : Text,
    patientAge : Text,
    gender : Text,
    contact : Nat,
    email : Text,
    doctor : Text,
    date : Int,
    appTime : Text,
    consultation : Text,
    existingConditions: [Text],
    currentMedications : Text,
    allergies : Text,
    nOfVisits : Nat,
    insuranceProvider : Text,
    emergencyContactName : Text,
    emergencyContactPhone : Nat
  ) : async Nat {
    let newAppointment : Appointment = {
    patientName = patientName;
    patientAge = patientAge;
    gender = gender;
    contact = contact;
    email = email;
    doctor = doctor;
    date = date;
    appTime = appTime;
    consultation = consultation;
    existingConditions = existingConditions;
    currentMedications = currentMedications;
    allergies = allergies;
    nOfVisits = nOfVisits;
    insuranceProvider = insuranceProvider;
    emergencyContactName = emergencyContactName;
    emergencyContactPhone = emergencyContactPhone;
    appDate = Time.now();
    };

    appointments := Array.append<Appointment>(appointments, [newAppointment]);
    return appointments.size();
  };
  
   public query func listAppointments() : async [Appointment] {
    return appointments;
  };
};
