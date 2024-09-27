import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";

import Int "mo:base/Int";




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

  type Doctor = {
    name : Text;
    experience : Text;
    speciality : Text;
    mobile : Nat64;
    days : [Text];
    dutyStart : Text;
    dutyEnd : Text;
    qualification : Text;
    op : Nat64;

  };
/*
  type MutableInventory = {
    masks : Nat64;
    gloves : Nat64;
    gowns : Nat64;
    paracetamol : Nat64;
    painkiller : Nat64;
    cough : Nat64;
    oxygen : Nat64;
    ehr : Nat64;
    defi : Nat64;
    test : Nat64;
    microscope : Nat64;
    petri : Nat64;
    scalpels : Nat64;
    forceps : Nat64;
    surgicalScissors : Nat64;
  };
  */
  type InventoryItem ={
    itemName: Text;
    itemCount : Int;
  };

type Inventory = {
  sectionName : Text;
  items : [InventoryItem]

};
 
/*var inventory : MutableInventory = {
    masks = 150;
    gloves = 150;
    gowns = 150;
    paracetamol = 150;
    painkiller = 150;
    cough = 150;
    oxygen = 150;
    ehr = 150;
    defi = 150;
    test = 150 ;
    microscope = 150 ;
    petri = 150 ;
    scalpels = 150 ;
    forceps = 150;
    surgicalScissors = 150;
};
*/
  var  patients: [Patient] = [];
  var nextPatientId: Nat = 0;

var appointments: [Appointment] = [];
var doctors : [Doctor] = [];
var inventories : [Inventory] = [];


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
    var updatedPatients: [Patient] = [];
    var updatedPatient: ?Patient = null;

 
    for (patient in patients.vals()) {
        if (patient.id == id) {
            // Create a new updated patient record
            let newPatient: Patient = {
                id = patient.id;
                name = switch (name) {
                    case (?value) value;
                    case null patient.name;
                };
                age = switch (age) {
                    case (?value) value;
                    case null patient.age;
                };
                gender = switch (gender) {
                    case (?value) value;
                    case null patient.gender;
                };
                location = switch (location) {
                    case (?value) value;
                    case null patient.location;
                };
                blood = switch (blood) {
                    case (?value) value;
                    case null patient.blood;
                };
                height = switch (height) {
                    case (?value) value;
                    case null patient.height;
                };
                weight = switch (weight) {
                    case (?value) value;
                    case null patient.weight;
                };
                medicalHistories = switch (medicalHistories) {
                    case (?value) value;
                    case null patient.medicalHistories;
                };
                testReports = switch (testReports) {
                    case (?value) value;
                    case null patient.testReports;
                };
                pdate = Time.now();  // Update the last modified time
            };

            updatedPatient := ?newPatient;
            updatedPatients := Array.append(updatedPatients, [newPatient]);  // Add the updated patient
        } else {
            updatedPatients := Array.append(updatedPatients, [patient]);  // Keep the unchanged patients
        };
    };

  
    patients := updatedPatients;

    return updatedPatient;  // Return the updated patient or null if not found
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
