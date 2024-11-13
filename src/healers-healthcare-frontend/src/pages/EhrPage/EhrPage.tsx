'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, FileText as FileTextIcon, Trash2, Search, CalendarIcon, Menu, TrendingUp } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { 
  FaUser, 
  FaBirthdayCake, 
  FaVenusMars, 
  FaMapMarkerAlt, 
  FaTint, 
  FaRulerVertical, 
  FaWeight, 
  FaHospital, 
  FaUserMd, 
  FaCalendarCheck, 
  FaPrescription, 
  FaFirstAid, 
  FaFileAlt, 
  FaStethoscope, 
  FaFlask, 
  FaComments, 
  FaUpload, 
  FaTrashAlt, 
  FaPlus 
} from 'react-icons/fa'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Calendar1 } from "../../components/ui/calendar"
import { format, isWithinInterval } from "date-fns"
import { cn } from "../../lib/utils"
import { Link } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { Skeleton } from "../../components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Transition, Dialog as HeadlessDialog, Dialog, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { Toaster } from "../../components/ui/sonner"
import GridPattern from "../../components/magicui/grid-pattern";
import { healers_healthcare_backend } from "../../../../declarations/healers-healthcare-backend";
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { Actor, HttpAgent } from '@dfinity/agent';
import { useLocation } from 'react-router-dom';
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did';
import { id } from 'ethers'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
//import { Result } from '@dfinity/candid/lib/cjs/idl';
import { Principal } from '@dfinity/principal';
import { toast } from "sonner" 
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area"

/*interface HospitalService {
  listPatients(): unknown
  addPatient: (
    name: string,
    age: bigint,
    gender: string,
    location: string,
    blood: string,
    height: bigint,
    weight: bigint,
    medicalHistories: MedicalHistory[],
    testReports: TestReport[]
  ) => Promise<Result<bigint, string>>;
  
  // ... other methods
}
*/
//type Result = { 'Ok': bigint } | { 'Err': string };

  type MedicalHistory = {
    pharmacy: string;
    physician: string;
    event: string;
    prescription: string;
    remedies: string;
  };

  type TestReport = {
    doctor: string;
    referredTo: string;
    testType: string;
    comments: string;
    file: number[] | Uint8Array
  };

  type Patient = {
    id: string;
    name: string;
    age: bigint;
    gender: string;
    location: string;
    blood: string;
    height: bigint;
    weight: bigint;
    medicalHistories: MedicalHistory[];
    testReports: TestReport[];
    pdate: bigint;
  };

type Filters = {
  gender: string;
  search: string;
  date: DateRange | undefined;
};

export default function PatientHealthRecord() {
  const location = useLocation();
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
    const [patients, setPatients] = useState<Patient[]>([]);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const initializeActor = async () => {
        try {
          const canisterId = localStorage.getItem('hospitalCanisterId');
          if (!canisterId) {
            throw new Error('Hospital canister ID not found');
          }
          console.log('Initializing actor with canister ID:', canisterId);
          const agent = new HttpAgent({ host: 'https://ic0.app' });
          //// await agent.fetchRootKey();
          const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory, {
            agent,
            canisterId,
          });
          console.log('Actor initialized successfully');
          setHospitalActor(actor);
        } catch (err) {
          console.error('Failed to initialize hospital actor:', err);
          setError('Failed to connect to the hospital service. Please try logging in again.');
        }
      };
    
      initializeActor();
    }, []);

    const fetchPatients = useCallback(async () => {
      if (!hospitalActor) {
        console.error('Hospital actor is not initialized');
        setError('Unable to fetch patients. Please try logging in again.');
        return;
      }
    
      try {
        setIsLoading(true);
        const result = await hospitalActor.listPatients();
        console.log('Fetched patients:', result);
        const mappedPatients: Patient[] = result.map((patient) => ({
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          location: patient.location,
          blood: patient.blood,
          height: patient.height,
          weight: patient.weight,
          medicalHistories: patient.medicalHistories,
          testReports: patient.testReports,
          pdate: patient.pdate
        }));
        setPatients(mappedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, [hospitalActor]);

    useEffect(() => {
      if (hospitalActor) {
        fetchPatients();
      }
    }, [hospitalActor, fetchPatients]);

  const formatDate = (dateInNanoseconds: bigint): string => {
    const milliseconds = Number(dateInNanoseconds) / 1000000
    const date = new Date(milliseconds)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const [filters, setFilters] = useState<Filters>({
    gender: '',
    search: '',
    date: undefined
  });

  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'pdate'>> ({
    name: '',
    age: BigInt(0),
    gender: '',
    location: '',
    blood: '',
    height: BigInt(0),
    weight: BigInt(0),
    medicalHistories: [],
    testReports: []
  });
    

  

  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if ('files' in e.target && e.target.type === 'file') {
      // Handle file input
      const file = e.target.files ? e.target.files[0] : null;

      setNewPatient(prev => ({
          ...prev,
          [name]: file  // Store the file directly or process it as needed
      }));
    } else {
    setNewPatient(prev => ({
      ...prev,
      [name]: ['age', 'height', 'weight'].includes(name) ? BigInt(value || 0) : value
    }));
  }
  }; 

  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized');
      setError('Unable to add patient. Please try logging in again.');
      return;
    }
    setIsOpen(false);
    toast.success('Patient details added successfully');
    setIsLoading(true);
    setError(null);
  
    try {
      console.log('Attempting to add patient with data:', JSON.stringify(newPatient, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  
      const result = await hospitalActor.addPatient(
        newPatient.name,
        newPatient.age,
        newPatient.gender,
        newPatient.location,
        newPatient.blood,
        newPatient.height,
        newPatient.weight,
        newPatient.medicalHistories,
        newPatient.testReports
      );
      
      console.log('Patient added successfully, result:', result);
      
      
      
      fetchPatients();
      // Reset form and show success message
    } catch (error) {
      console.error('Error adding patient:', error);
      
      if (error instanceof Error) {
        setError(`Failed to add patient: ${error.message}`);
      } else {
        setError('An unexpected error occurred while adding the patient');
      }
    } finally {
      setIsLoading(false);
    }
  };
{/*
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const fetchedPatients = await healers_healthcare_backend.listPatients();
      const mappedPatients: Patient[] = fetchedPatients.map(patient => ({
        id: patient.id,
        name: patient.name,
        age: BigInt(patient.age),
        gender: patient.gender,
        location: patient.location,
        blood: patient.blood,
        height: BigInt(patient.height),
        weight: BigInt(patient.weight),
        medicalHistories: patient.medicalHistories,
        testReports: patient.testReports,
        pdate: BigInt(patient.pdate)
      }));
      setPatients(mappedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);   */}
 /* const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const fetchedPatients = await healers_healthcare_backend.listPatients();
      const mappedPatients = fetchedPatients.map((patient) => ({
      
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        location: patient.location,
        blood: patient.blood,
        height: patient.height,
        weight: patient.weight,
        // Format the date here
        /*date: new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(new Date(Number(patient.date))),
        medicalHistories: patient.medicalHistories,
        testReports: patient.testReports.map((report) => ({
          doctor: report.doctor,
          file: Array.from(report.file), // Handle file correctly
          referedto: report.referedto,
          testtype: report.testtype,
          comments: report.comments,
        })),
      }));
      setPatients(mappedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };
  */


  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'date' ? (value as DateRange | undefined) : (value === 'all' ? '' : value)
    }))
    setCurrentPage(1)
  }, [])

 /* const filteredPatients = React.useMemo(() => {
    return patients.filter(patient => {
      const genderMatch = filters.gender === '' || patient.gender === filters.gender;
      const searchMatch = filters.search === '' ||
        patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        patient.id.includes(filters.search);
  
      let dateMatch = true;
      if (filters.date) {
        const patientDate = new Date(Number(patient.date));
        if (filters.date.from && filters.date.to) {
          dateMatch = isWithinInterval(patientDate, { start: filters.date.from, end: filters.date.to });
        } else if (filters.date.from) {
          dateMatch = patientDate >= filters.date.from;
        } else if (filters.date.to) {
          dateMatch = patientDate <= filters.date.to;
        }
      }
  
      return genderMatch && dateMatch && searchMatch;
    });
  }, [patients, filters]);

  */

  

  const filteredPatients = React.useMemo(() => {
    return patients.filter(patient => {
      const genderMatch = filters.gender === '' || patient.gender === filters.gender;
      const searchMatch = filters.search === '' ||
        patient.name.toLowerCase().includes(filters.search.toLowerCase())||
        patient.id.includes(filters.search);

        let dateMatch = true
        if (filters.date) {
          const patientDate = new Date(Number(patient.pdate) / 1000000)
          if (filters.date.from && filters.date.to) {
            dateMatch = patientDate >= filters.date.from && patientDate <= filters.date.to
          } else if (filters.date.from) {
            dateMatch = patientDate >= filters.date.from
          } else if (filters.date.to) {
            dateMatch = patientDate <= filters.date.to
          }
        }
  
        return genderMatch && dateMatch && searchMatch
      })
    }, [patients, filters])

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)

  const addMedicalHistory = useCallback(() => {
    setNewPatient(prev => ({
      ...prev,
      medicalHistories: [...prev.medicalHistories, {
        pharmacy: '',
        physician: '',
        event: '',
        prescription: '',
        remedies: ''
      }]
    }));
  }, []);

  const addTestReport = useCallback(() => {
    setNewPatient(prev => ({
      ...prev,
      testReports: [...prev.testReports, {
        doctor: '',
        referredTo: '',
        testType: '',
        comments: '',
        file: []
      }]
    }));
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(value === 'all' ? filteredPatients.length : parseInt(value))
    setCurrentPage(1)
  }, [filteredPatients.length])

  const paginatedPatients = React.useMemo(() => {
    return filteredPatients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredPatients, currentPage, itemsPerPage])
 
  const handleMedicalHistoryChange = (index: number, field: keyof MedicalHistory, value: string) => {
    setNewPatient(prev => ({
      ...prev,
      medicalHistories: prev.medicalHistories.map((history, i) => 
        i === index ? { ...history, [field]: value } : history
      )
    }));
  };

  const removeMedicalHistory = useCallback((index: number) => {
    setNewPatient(prev => ({
      ...prev,
      medicalHistories: prev.medicalHistories.filter((_, i) => i !== index)
    }));
  }, []);

  const handleTestReportChange = (index: number, field: keyof TestReport, value: any) => {
    setNewPatient(prev => ({
      ...prev,
      testReports: prev.testReports.map((report, i) => 
        i === index ? { ...report, [field]: value } : report
      )
    }));
  };
  const removeTestReport = useCallback((index: number) => {
    setNewPatient(prev => ({
      ...prev,
      testReports: prev.testReports.filter((_, i) => i !== index)
    }));
  }, []);
  
  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setInterval(() => setIsLoading(false), 1500)
  }, [])
  const handleClose = () => {
    setIsOpen(false);
  };
  const SidebarContent = () => (
    <>
      <img src="/HealersHealthcareOfficialLogo.png" alt="Healers Healthcare" className="w-40 mx-auto mb-8" />
      <nav className="space-y-2">
        {[
          { name: 'Dashboard', icon: TrendingUp },
          { name: 'Health Records', icon: FileText },
          { name: 'Doctor Dashboard', icon: UserCog },
          { name: 'Appointments', icon: Calendar },
          { name: 'Inventory', icon: Package },
        ].map((item, index) => (
          <Link 
            key={item.name}
            to={`/${item.name.toLowerCase().replace(' ', '-')}`}
            className="flex items-center p-3 rounded-lg hover:bg-[#259b95] transition-colors duration-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  )


  const deletePatient = useCallback(async (id: string) => {
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized');
      toast.error('Unable to delete patient. Please try logging in again.');
      return;
    }

    try {
      setIsLoading(true);
      await hospitalActor.deletePatient(id);
      toast.success('Patient deleted successfully');
      // Refresh the patient list
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hospitalActor, fetchPatients]);

  /* function deletePatient(id: string) {
    throw new Error('Function not implemented.')
  } */

  return (
    <div className="flex flex-col md:flex-row  relative z-10 min-h-screen bg-[url('/grainyBg.png')] bgbg-opacity-80 object-cover max-w-[1536px] mx-auto  bg-opacity-100 backdrop:blur-sm text-white">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-n-8 p-4 md:p-6">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 mx-2 my-5 rounded-lg bg-transparent backdrop-blur border border-white/20 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden  ">
      <Toaster />
        <h1 className="text-4xl text-center lg:text-left lg:px-10 md:text-5xl font-bold mb-4 text-white">Patient Health Records</h1>
        <p className="text-gray-400 lg:text-left lg:px-10 text-center mb-8 lg:mb-14">Manage and view detailed patient information, medical histories, and test reports.</p>
        
        <section className="flex max-w-6xl mx-auto flex-wrap justify-between items-center mb-6 gap-4 ">
          <Select onValueChange={(value) => handleFilter('gender', value)}>
            <SelectTrigger className="w-full md:w-[150px] bg-transparent text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className="bg-n-8 text-white border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#259b95]" />
            <Input
              placeholder="Search by name or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#259b95] text-white border-gray-700 "
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[300px] bg-transparent border hover:border-[#259b95] hover:bg-transparent justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date?.from ? (
                  filters.date.to ? (
                    <>
                      {format(filters.date.from, "LLL dd, y")} -{" "}
                      {format(filters.date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar1
  initialFocus
  mode="range"
  defaultMonth={filters.date?.from}
  selected={filters.date}
  onSelect={(newDate) => handleFilter('date', newDate)}
  numberOfMonths={2}
/>
            </PopoverContent>
          </Popover>

          {/* Updated Form Popup */}
        
          <Dialog open={isOpen} as="div"
              className="relative z-50" onClose={() => {}}>
            
              

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  
                    <DialogPanel className="w-full max-w-full transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                      <div className='w-full flex justify-end'>

                    <Button type="button" onClick={handleClose} className="bg-black border text-white hover:bg-transparent hover:border-red-500">
                            X
                          </Button>
                      </div>
                      {/* <DialogTitle 
                        as="h3" 
                        className="text-4xl font-bold text-[#fff] mb-4 text-center"
                      >
                        Add New Patient
                      </DialogTitle> */}
                      <form onSubmit={handleAddPatient} className="w-full max-w-7xl mx-auto space-y-6 text-white">
      <Card className="bg-gradient-to-b from-[#111] to-black border-zinc-900">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-teal-500">Patient Registration</CardTitle>
          <CardDescription className="text-center text-gray-400">Enter patient details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-3/4 mx-auto grid-cols-3 bg-black">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
              <TabsTrigger value="test">Test Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="name" name="name" placeholder="Enter patient's full name" value={newPatient.name} onChange={handleInputChange} className="pl-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <div className="relative">
                        <FaBirthdayCake className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="age" name="age" type="number" placeholder="e.g., 35" value={newPatient.age.toString()} onChange={handleInputChange} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" value={newPatient.gender} onValueChange={(value) => handleInputChange({ target: { name: 'gender', value } })}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="location" name="location" placeholder="e.g., New York, NY" value={newPatient.location} onChange={handleInputChange} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blood">Blood Group</Label>
                      <Select name="blood" value={newPatient.blood} onValueChange={(value) => handleInputChange({ target: { name: 'blood', value } })}>
                        <SelectTrigger id="blood">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <div className="relative">
                        <FaRulerVertical className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="height" name="height" type="number" placeholder="e.g., 175" value={newPatient.height.toString()} onChange={handleInputChange} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <div className="relative">
                        <FaWeight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="weight" name="weight" type="number" placeholder="e.g., 70" value={newPatient.weight.toString()} onChange={handleInputChange} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="medical">
              <ScrollArea className="h-[60vh] pr-4">
                {newPatient.medicalHistories.map((history, index) => (
                  <Card key={index} className="mb-4 bg-gradient-to-br from-black via-black to-[#0a2a28]">
                    <CardHeader>
                      <CardTitle className="text-xl">Medical History {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`pharmacy${index}`}>Pharmacy</Label>
                        <div className="relative">
                          <FaHospital className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id={`pharmacy${index}`} name={`pharmacy${index}`} placeholder="City Pharmacy" value={history.pharmacy} onChange={(e) => handleMedicalHistoryChange(index, 'pharmacy', e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`physician${index}`}>Physician</Label>
                          <div className="relative">
                            <FaUserMd className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`physician${index}`} name={`physician${index}`} placeholder="Dr. Johnson" value={history.physician} onChange={(e) => handleMedicalHistoryChange(index, 'physician', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`event${index}`}>Event</Label>
                          <div className="relative">
                            <FaCalendarCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`event${index}`} name={`event${index}`} placeholder="Annual Check-up" value={history.event} onChange={(e) => handleMedicalHistoryChange(index, 'event', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`prescription${index}`}>Prescription</Label>
                          <div className="relative">
                            <FaPrescription className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`prescription${index}`} name={`prescription${index}`} placeholder="Amoxicillin 500mg" value={history.prescription} onChange={(e) => handleMedicalHistoryChange(index, 'prescription', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`remedies${index}`}>Remedies</Label>
                          <div className="relative">
                            <FaFirstAid className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`remedies${index}`} name={`remedies${index}`} placeholder="Rest and fluids" value={history.remedies} onChange={(e) => handleMedicalHistoryChange(index, 'remedies', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {index > 0 && (
                        <Button variant="destructive" onClick={() => removeMedicalHistory(index)} className="ml-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
                {newPatient.medicalHistories.length < 5 && (
                  <Button type='button' onClick={addMedicalHistory} className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medical History
                  </Button>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="test">
              <ScrollArea className="h-[60vh] pr-4">
                {newPatient.testReports.map((report, index) => (
                  <Card key={index} className="mb-4 bg-gradient-to-br from-black via-black to-[#0a2a28]">
                    <CardHeader>
                      <CardTitle className="text-xl">Test Report {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`doctor${index}`}>Doctor</Label>
                        <div className="relative">
                          <FaUserMd className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id={`doctor${index}`} name={`doctor${index}`} placeholder="Dr. Smith" value={report.doctor} onChange={(e) => handleTestReportChange(index, 'doctor', e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`referredTo${index}`}>Referred To</Label>
                          <div className="relative">
                            <FaHospital className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`referredTo${index}`} name={`referredTo${index}`} placeholder="Cardiology Dept." value={report.referredTo} onChange={(e) => handleTestReportChange(index, 'referredTo', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`testType${index}`}>Test Type</Label>
                          <div className="relative">
                            <FaFlask className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`testType${index}`} name={`testType${index}`} placeholder="Blood Test" value={report.testType} onChange={(e) => handleTestReportChange(index, 'testType', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`comments${index}`}>Comments</Label>
                          <div className="relative">
                            <FaComments className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id={`comments${index}`} name={`comments${index}`} placeholder="Normal results" value={report.comments} onChange={(e) => handleTestReportChange(index, 'comments', e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`file${index}`}>File Upload</Label>
                          <div className="relative">
                            <FaUpload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id={`file${index}`} 
                              name={`file${index}`} 
                              type="file" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      const arrayBuffer = event.target.result as ArrayBuffer;
                                      const uint8Array = new Uint8Array(arrayBuffer);
                                      handleTestReportChange(index, 'file', Array.from(uint8Array));
                                    }
                                  };
                                  reader.readAsArrayBuffer(file);
                                }
                              }} 
                              className="pl-10" 
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {index > 0 && (
                        <Button variant="destructive" onClick={() => removeTestReport(index)} className="ml-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
                {newPatient.testReports.length < 5 && (
                  <Button type='button' onClick={addTestReport} className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Report
                  </Button>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">
            Add Patient
          </Button>
        </CardFooter>
      </Card>
    </form>
                    </DialogPanel>
                 
                </div>
              </div>
            </Dialog>
          
          <Button className="w-full md:w-auto bg-[#145451] border hover:bg-transparent hover:border-[#259b95] text-white rounded-lg" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </section>

        <div className='relative max-w-6xl mx-auto'>
          {/* <MouseParallax ref={parallaxRef} className="relative z-10">
            <div className="hidden sm:block inset-0 left-90 w-[56.625rem] opacity-10 mix-blend-color-dodge pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
              </div>
            </div>
          </MouseParallax> */}
          <div className="bg-transparent backdrop-blur border border-white/10 rounded-lg p-4 overflow-x-auto shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-r border-transparent rounded-lg">
                  <TableHead className="text-[#259b95] text-center text-lg border-r">ID</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg border-r">Name</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg border-r">Age</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg border-r">Gender</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg border-r">Date</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg border-r">Actions</TableHead>
                  <TableHead className="text-[#259b95] text-center text-lg">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className='mx-auto'><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  paginatedPatients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="border-b border-transparent hover:bg-[#081414] transition-colors duration-200 rounded-lg"
                    >
                      <TableCell className='text-[1.12rem] text-center'>{(parseInt(patient.id) + 1).toString()}</TableCell>
                      <TableCell className='text-[1.12rem] text-center'>{patient.name}</TableCell>
                      <TableCell className='text-[1.12rem] text-center'>{String(patient.age)} yrs</TableCell>
                      <TableCell className='text-[1.12rem] text-center'>{patient.gender}</TableCell>
                      <TableCell className='text-[1.12rem] text-center'>{formatDate(patient.pdate)}</TableCell>
                      <TableCell className='text-[1.12rem] text-center' >
                        <Link to={`/patient/${patient.id}`} className=" text-[1rem] text-center  px-2 py-2 bg-transparent border text-white/50 border-white/20 hover:bg-white hover:text-[#0A0F29] transition duration-500 rounded-lg hover:-translate-y-2">
                          View Details
                        </Link>
                      </TableCell>
                      <TableCell className='border-transparent text-center'>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => {
                  if (window.confirm('Are you sure you want to delete this patient?')) {
                    deletePatient(patient.id);
                  }
                }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col max-w-6xl mx-auto md:flex-row  justify-between items-center mt-4 gap-4">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <Select onValueChange={handleItemsPerPageChange} defaultValue="10">
              <SelectTrigger className="w-[100px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-gray-700 hover:border-[#259b95] transition-all duration-200">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1))
                simulateLoading()
              }}
              disabled={currentPage === 1 || isLoading}
              className="bg-transparent border  backdrop-blur hover:bg-transparent hover:border-[#259b95] hover:scale-95 transition duration-300 text-white rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2 text-white" />
              Previous
            </Button>
            <span className='text-white'>Page {currentPage} of {totalPages}</span>
            <Button 
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
                simulateLoading()
              }}
              disabled={currentPage === totalPages || isLoading}
              className="bg-black border hover:bg-transparent hover:border-[#259b95] hover:scale-95 transition duration-300 text-white rounded-lg"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};
