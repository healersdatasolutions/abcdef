//import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";





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
    file: [Nat8];
  };

  type Patient = {
    id : Text;
    name: Text;
    age: Nat64;
    gender: Text;
    location: Text;
    blood: Text;
    height: Nat64;
    weight: Nat64;
    medicalHistories: [MedicalHistory];
    testReports: [TestReport];
    pdate : Time.Time ;
  };

 type Appointment={
  id : Text;
    patientName : Text;
    patientAge : Text;
    gender : Text;
    contact : Nat64;
    email : Text;
    doctor : Text;
    date : Text;
    appTime : Text;
    consultation : Text;
    existingConditions: [Text];
    currentMedications : Text;
    allergies : Text;
    nOfVisits : Nat64;
    insuranceProvider : Text;
    emergencyContactName : Text;
    emergencyContactPhone : Nat64;   
    
    

  };
  
var patients: [Patient] = [];
  var nextPatientId: Nat = 0;

var appointments: [Appointment] = [];

  public shared func addPatient(
    
    name: Text,
    age: Nat64,
    gender: Text,
    location: Text,
    blood: Text,
    height: Nat64,
    weight: Nat64,
    medicalHistories: [MedicalHistory],
    testReports: [TestReport]
  ) : async Nat {
    let id = Nat.toText(nextPatientId);
    nextPatientId += 1;
    let newPatient: Patient = {
      id = id;
      name = name;
      age = age;
      gender = gender;
      location = location;
      blood = blood;
      height = height;
      weight = weight;
      
      medicalHistories = medicalHistories;
      testReports = testReports;
      pdate = Time.now();
    };

    patients := Array.append(patients, [newPatient]);

    return patients.size();
  };

  public query func listPatients() : async [Patient] {
    return patients;
  };

 public query func getPatientById(id: Text) : async ?Patient {
  for (patient in patients.vals()) {
    if (patient.id == id) {
      return ?patient;
    };
  };
  return null;
};



  
  public shared ({caller = _}) func addAppointment (
    patientName : Text,
    patientAge : Text,
    gender : Text,
    contact : Nat64,
    email : Text,
    doctor : Text,
    date : Text,
    appTime : Text,
    consultation : Text,
    existingConditions: [Text],
    currentMedications : Text,
    allergies : Text,
    nOfVisits : Nat64,
    insuranceProvider : Text,
    emergencyContactName : Text,
    emergencyContactPhone : Nat64
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
  
    };

    appointments := Array.tabulate<Appointment>(appointments.size() + 1, func (i) {
  if (i < appointments.size()) { appointments[i] } else { newAppointment }
});
    return appointments.size();
  };
  
   public query func listAppointments() : async [Appointment] {
    return appointments;
  };
};
