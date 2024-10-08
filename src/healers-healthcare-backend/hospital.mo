import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

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
    referredTo: Text;
    testType: Text;
    comments: Text;
    file: [Nat8];
  };

  type Patient = {
    id: Text;
    name: Text;
    age: Nat64;
    gender: Text;
    location: Text;
    blood: Text;
    height: Nat64;
    weight: Nat64;
    medicalHistories: [MedicalHistory];
    testReports: [TestReport];
    pdate: Time.Time;
  };

  type Appointment = {
    patientName: Text;
    patientAge: Text;
    gender: Text;
    contact: Nat64;
    email: Text;
    doctor: Text;
    date: Text;
    appTime: Text;
    consultation: Text;
    existingConditions: [Text];
    currentMedications: Text;
    allergies: Text;
    nOfVisits: Nat64;
    insuranceProvider: Text;
    emergencyContactName: Text;
    emergencyContactPhone: Nat64;
  };

  type Doctor = {
    name: Text;
    experience: Text;
    speciality: Text;
    mobile: Nat64;
    days: [Text];
    dutyStart: Text;
    dutyEnd: Text;
    qualification: Text;
    op: Nat64;
  };

  type InventoryItem = {
    itemName: Text;
    itemCount: Int;
  };

  type Inventory = {
    sectionName: Text;
    items: [InventoryItem];
  };

  var patients: [Patient] = [];
  var appointments: [Appointment] = [];
  var doctors: [Doctor] = [];
  var inventories: [Inventory] = [];

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
) : async Result.Result<Nat, Text> {
  Debug.print("Attempting to add patient: " # name);
  try {
    // Validate input
    if (name == "" or gender == "" or location == "" or blood == "") {
      return #err("Invalid input: All fields must be non-empty");
    };

    let id = Nat.toText(patients.size());
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
    Debug.print("Patient added successfully. Total patients: " # Nat.toText(patients.size()));
    #ok(patients.size())
  } catch (e) {
    Debug.print("Error adding patient: " # Error.message(e));
    #err("Error adding patient: " # Error.message(e))
  }
};

  public query func listPatients() : async [Patient] {
    patients
  };
  
public query func getPatientById(id: Text) : async ?Patient {
  for (patient in patients.vals()) {
    if (patient.id == id) {
      return ?patient;
    };
  };
  return null;
};

public func deletePatient(id: Text) : async Bool {
  let initialSize = patients.size();
  patients := Array.filter(patients, func(p: Patient) : Bool { p.id != id });
  return patients.size() < initialSize;
};

  public shared func updatePatient(
    id: Text,
    name: ?Text,
    age: ?Nat64,
    gender: ?Text,
    location: ?Text,
    blood: ?Text,
    height: ?Nat64,
    weight: ?Nat64,
    medicalHistories: ?[MedicalHistory],
    testReports: ?[TestReport]
  ) : async ?Patient {
    var updatedPatient: ?Patient = null;
    var updatedPatients: [Patient] = [];
    for (patient in patients.vals()) {
      if (patient.id == id) {
        let updated: Patient = {
          id = patient.id;
          name = switch (name) { case (?n) n; case null patient.name; };
          age = switch (age) { case (?a) a; case null patient.age; };
          gender = switch (gender) { case (?g) g; case null patient.gender; };
          location = switch (location) { case (?l) l; case null patient.location; };
          blood = switch (blood) { case (?b) b; case null patient.blood; };
          height = switch (height) { case (?h) h; case null patient.height; };
          weight = switch (weight) { case (?w) w; case null patient.weight; };
          medicalHistories = switch (medicalHistories) { case (?mh) mh; case null patient.medicalHistories; };
          testReports = switch (testReports) { case (?tr) tr; case null patient.testReports; };
          pdate = Time.now();
        };
        updatedPatient := ?updated;
        updatedPatients := Array.append(updatedPatients, [updated]);
      } else {
        updatedPatients := Array.append(updatedPatients, [patient]);
      }
    };
    patients := updatedPatients;
    return updatedPatient;
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

  public shared func AddDoctor (
    name : Text,
    experience : Text,
    speciality : Text,
    mobile : Nat64,
    days : [Text],
    dutyStart : Text,
    dutyEnd : Text,
    qualification : Text,
    op : Nat64
  ) : async Nat {
    let newDoctor : Doctor = {
      name = name;
      experience = experience;
      speciality = speciality;
      mobile = mobile;
      days = days;
      dutyStart =dutyStart;
      dutyEnd = dutyEnd;
      qualification = qualification;
      op = op;
    };

    doctors := Array.append(doctors, [newDoctor]);
    return doctors.size();
  };

  public query func listDoctors() : async [Doctor] {
    return doctors;
  };

 /*
  public func updateInventory(item: Text, change: Int) : async Nat64 {
  func updateField(field: Nat64, change: Int) : Nat64 {
    let currentValue = Nat64.toNat(field);
    let newValue = Nat.max(0, Int.abs(currentValue + change));
    Nat64.fromNat(newValue)
  };

  let updatedValue = switch (item) {
    case "masks" { updateField(inventory.masks, change) };
    case "gloves" { updateField(inventory.gloves, change) };
    case "gowns" { updateField(inventory.gowns, change) };
    case "paracetamol" { updateField(inventory.paracetamol, change) };
    case "painkiller" { updateField(inventory.painkiller, change) };
    case "cough" { updateField(inventory.cough, change) };
    case "oxygen" { updateField(inventory.oxygen, change) };
    case "ehr" { updateField(inventory.ehr, change) };
    case "defi" { updateField(inventory.defi, change) };
    case "test" { updateField(inventory.test, change) };
    case "microscope" { updateField(inventory.microscope, change) };
    case "petri" { updateField(inventory.petri, change) };
    case "scalpels" { updateField(inventory.scalpels, change) };
    case "forceps" { updateField(inventory.forceps, change) };
    case "surgicalscissors" { updateField(inventory.surgicalScissors, change) };
    case _ { Nat64.fromNat(0) };
  };
  updatedValue;
};

  public query func getInventory  () : async MutableInventory {
  inventory
};
*/

public shared func AddInventory ( sectionName : Text,
  items : [InventoryItem]
) : async () {
  let newInventory : Inventory ={
    sectionName = sectionName;
    items = items;
  };
   inventories := Array.append(inventories, [newInventory]);

};

public func updateInventoryItemCount(sectionName: Text, itemName: Text, change: Int) : async () {
    var updatedInventories : [Inventory] = [];
    for (section in inventories.vals()) {
      if (section.sectionName == sectionName) {
        var updatedItems : [InventoryItem] = [];
        for (item in section.items.vals()) {
          if (item.itemName == itemName) {
            let currentCount = item.itemCount;
            let newCount = if (change >= 0) {
              currentCount + Int.abs(change)  // Convert change to Nat using Nat.abs
            } else {
              if (currentCount > Int.abs(change)) {
                currentCount - Int.abs(change)  // Handle negative change by subtracting
              } else {
                0
              }
            };
            updatedItems := Array.append(updatedItems, [{itemName = item.itemName; itemCount = newCount}]);
          } else {
            updatedItems := Array.append(updatedItems, [item]);
          }
        };
        updatedInventories := Array.append(updatedInventories, [{sectionName = section.sectionName; items = updatedItems}]);
      } else {
        updatedInventories := Array.append(updatedInventories, [section]);
      }
    };
    inventories := updatedInventories;
  };


  public query func listInventories() : async [Inventory] {
    inventories
  };


};
