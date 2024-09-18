import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Debug "mo:base/Debug";
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

  /*type Inventory = {
    masks : Nat64;
    gloves : Nat64;
    gowns : Nat64;
    paracetamol : Nat64;
    painkiller : Nat64;
    cogh : Nat64;
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
  type MutableInventory = {
    var masks : Nat64;
    var gloves : Nat64;
    var gowns : Nat64;
    var paracetamol : Nat64;
    var painkiller : Nat64;
    var coughSyrup : Nat64;
    var oxygenCylinder : Nat64;
    var ehrMachine : Nat64;
    var defibrillator : Nat64;
    var testTubes : Nat64;
    var microscopeSlides : Nat64;
    var petriDishes : Nat64;
    var scalpels : Nat64;
    var forceps : Nat64;
    var surgicalScissors : Nat64;
  };
  type Inventory = {
  var masks : Nat64;
  var gloves : Nat64;
  var gowns : Nat64;
  var paracetamol : Nat64;
  var painkiller : Nat64;
  var coughSyrup : Nat64;
  var oxygenCylinder : Nat64;
  var ehrMachine : Nat64;
  var defibrillator : Nat64;
  var testTubes : Nat64;
  var microscopeSlides : Nat64;
  var petriDishes : Nat64;
  var scalpels : Nat64;
  var forceps : Nat64;
  var surgicalScissors : Nat64;
};
var inventory : MutableInventory = {
  var masks = 150;
  var gloves = 150;
  var gowns = 150;
  var paracetamol = 150;
  var painkiller = 150;
  var coughSyrup = 150;
  var oxygenCylinder = 150;
  var ehrMachine = 150;
  var defibrillator = 150;
  var testTubes = 500;
  var microscopeSlides = 1000;
  var petriDishes = 200;
  var scalpels = 100;
  var forceps = 75;
  var surgicalScissors = 50;
};

var patients: [Patient] = [];
  var nextPatientId: Nat = 0;

var appointments: [Appointment] = [];
var doctors : [Doctor] = [];


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

 /* public func increment () : async Nat {
    count +=1;
    return count;

  };

  public func decrement() : async Nat {
    count -=1;
    return count;
  };
  public func getCount() : async Nat {
        return count;
    };
*/
  public func updateInventory(item: Text, change: Int) : async Nat64 {
  func updateField(field: Nat64) : Nat64 {
    let currentValue = Nat64.toNat(field);
    let newValue = Nat.max(0, Int.abs(currentValue + change));
    Nat64.fromNat(newValue)
  };

  switch (item) {
    case "masks" { inventory.masks := updateField(inventory.masks); inventory.masks };
    case "gloves" { inventory.gloves := updateField(inventory.gloves); inventory.gloves };
    case "gowns" { inventory.gowns := updateField(inventory.gowns); inventory.gowns };
    case "paracetamol" { inventory.paracetamol := updateField(inventory.paracetamol); inventory.paracetamol };
    case "painkiller" { inventory.painkiller := updateField(inventory.painkiller); inventory.painkiller };
    case "coughsyrup" { inventory.coughSyrup := updateField(inventory.coughSyrup); inventory.coughSyrup };
    case "oxygencylinder" { inventory.oxygenCylinder := updateField(inventory.oxygenCylinder); inventory.oxygenCylinder };
    case "ehrmachine" { inventory.ehrMachine := updateField(inventory.ehrMachine); inventory.ehrMachine };
    case "defibrillator" { inventory.defibrillator := updateField(inventory.defibrillator); inventory.defibrillator };
    case "testtubes" { inventory.testTubes := updateField(inventory.testTubes); inventory.testTubes };
    case "microscopeslides" { inventory.microscopeSlides := updateField(inventory.microscopeSlides); inventory.microscopeSlides };
    case "petridishes" { inventory.petriDishes := updateField(inventory.petriDishes); inventory.petriDishes };
    case "scalpels" { inventory.scalpels := updateField(inventory.scalpels); inventory.scalpels };
    case "forceps" { inventory.forceps := updateField(inventory.forceps); inventory.forceps };
    case "surgicalscissors" { inventory.surgicalScissors := updateField(inventory.surgicalScissors); inventory.surgicalScissors };
    case _ { 0 };
  }
};

/*public query func getInventory() : async Inventory {
    {
      masks = inventory.masks;
      gloves = inventory.gloves;
      gowns = inventory.gowns;
      paracetamol = inventory.paracetamol;
      painkiller = inventory.painkiller;
      coughSyrup = inventory.coughSyrup;
      oxygenCylinder = inventory.oxygenCylinder;
      ehrMachine = inventory.ehrMachine;
      defibrillator = inventory.defibrillator;
      testTubes = inventory.testTubes;
      microscopeSlides = inventory.microscopeSlides;
      petriDishes = inventory.petriDishes;
      scalpels = inventory.scalpels;
      forceps = inventory.forceps;
      surgicalScissors = inventory.surgicalScissors;
    }
  };*/
};
