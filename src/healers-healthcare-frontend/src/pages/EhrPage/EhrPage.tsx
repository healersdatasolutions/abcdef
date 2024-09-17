'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, User, MapPin, Droplet, Ruler, Weight, Pill, Stethoscope, FileSymlink, FileText as FileTextIcon, Upload, Trash2, Search, CalendarIcon, Menu } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
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
import { Transition, Dialog as HeadlessDialog } from '@headlessui/react'
import GridPattern from "../../components/magicui/grid-pattern";
import { healers_healthcare_backend } from "../../../../declarations/healers-healthcare-backend";
import { Actor, HttpAgent } from '@dfinity/agent';


  type MedicalHistory = {
    pharmacy: string;
    physician: string;
    event: string;
    prescription: string;
    remedies: string;
  };

  type TestReport = {
    doctor: string;
    referedto: string;
    testtype: string;
    comments: string;
    file: number[] | Uint8Array
  };

type Patient = {
  id : string;
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
  const [patients, setPatients] = useState<Patient[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
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

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(newPatient);
      const id = await healers_healthcare_backend.addPatient(
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
  
      console.log("Patient added successfully",id);
      setIsAddingPatient(false);
      fetchPatients();
      setNewPatient({
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
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };
  

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
  }, []);
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
        referedto: '',
        testtype: '',
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

  const SidebarContent = () => (
    <>
      {/* <h2 className="text-xl md:text-2xl font-bold text-[#fff] mb-8">Healers Healthcare</h2> */}
      <img src={'/HealersHealthcareOfficialLogo.png'} alt="Healers Healthcare" className="w-40 mx-auto" />
      <nav className="space-y-2">
        {[
          { name: 'Health Records', icon: FileText },
          { name: 'Doctor Dashboard', icon: UserCog },
          { name: 'Appointments', icon: Calendar },
          { name: 'Inventory', icon: Package },
        ].map((item, index) => (
          <React.Fragment key={item.name}>
            <Link 
              to={`/${item.name.toLowerCase().replace(' ', '-')}`} 
              className="flex items-center p-3 rounded-lg hover:bg-[#7047eb] transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 md:mr-3" />
              <span className='md:block'>{item.name}</span>
            </Link>
            {index < 3 && <div className="h-px bg-gray-700 my-2 mx-4" />}
          </React.Fragment>
        ))}
      </nav>
    </>
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
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
      <div className="hidden md:block w-64 bg-n-8 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <h1 className="text-4xl text-center lg:text-left md:text-5xl font-bold mb-4 text-white">Patient Health Records</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">Manage and view detailed patient information, medical histories, and test reports.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={(value) => handleFilter('gender', value)}>
            <SelectTrigger className="w-full md:w-[150px] bg-n-8 text-white border hover:border-[#7047eb] rounded-lg">
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
            <Search className="hidden sm:block text-[#7047eb]" />
            <Input
              placeholder="Search by name or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#7047eb] text-white border-gray-700"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[300px] justify-start text-left font-normal",
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
          <Transition appear show={isOpen} as={React.Fragment}>
            <HeadlessDialog
              as="div"
              className="relative z-50"
              onClose={() => setIsOpen(false)}
            >
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <HeadlessDialog.Panel className="w-full max-w-full transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                      <div className='w-full flex justify-end'>

                    <Button type="button" onClick={() => setIsOpen(false)} className="bg-black border hover:bg-transparent hover:border-red-500">
                            X
                          </Button>
                      </div>
                      <HeadlessDialog.Title 
                        as="h3" 
                        className="text-4xl font-bold text-[#fff] mb-4 text-center"
                      >
                        Add New Patient
                      </HeadlessDialog.Title>
                      <form onSubmit={handleAddPatient} className="space-y-6 mx-5 sm:mx-10 lg:mx-20 text-white">
                        <div className=" grid grid-cols-1 md:grid-cols-1 gap-6">

                        <div className='relative border bg-[#171717a2] border-slate-600  rounded-lg p-5'>
                        <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />

                            <h3 className="text-2xl font-semibold mb-3 text-[#fff]">General Details</h3>
                            <div className="space-y-4 m-0 sm:m-10">
                              <div className="flex items-center space-x-2">
                                <User className="text-[#fff]" />
                                <Input name="name" placeholder="Name" value={newPatient.name} onChange={handleInputChange} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                              <div className="flex items-center space-x-2">
                                <Calendar className="text-[#fff]" />
                                <Input name="age" type="number" placeholder="Age" value={newPatient.age.toString()} onChange={handleInputChange} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>


                              <div className="flex items-center space-x-2">
                                <UserCog className="text-[#fff]" />
                                <Select name="gender" value={newPatient.gender} onValueChange={(value) => handleInputChange({ target: { name: 'gender', value } } as any)}>
                                  <SelectTrigger className="w-full bg-black border-gray-700 focus:border-[#7047eb]">
                                    <SelectValue placeholder="Select Gender" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black border-gray-700">
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>


                              <div className="flex items-center space-x-2">
                                <MapPin className="text-[#fff]" />
                                <Input name="location" placeholder="Location" value={newPatient.location} onChange={handleInputChange} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Droplet className="text-[#fff]" />
                                <Select name="bloodGroup" value={newPatient.blood} onValueChange={(value) => handleInputChange({ target: { name: 'blood', value } } as any)}>
                                  <SelectTrigger className="w-full bg-black border-gray-700 focus:border-[#7047eb]">
                                    <SelectValue placeholder="Blood Group" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black border-gray-700">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                      <SelectItem key={group} value={group}>{group}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>


                              </div>
                              <div className="flex items-center space-x-2">
                                <Ruler className="text-[#fff]" />
                                <Input name="height" type="number" placeholder="Height (in cms.)" value={newPatient.height.toString()} onChange={handleInputChange} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Weight className="text-[#fff]" />
                                <Input name="weight" type="number" placeholder="Weight (in kg.)" value={newPatient.weight.toString()} onChange={handleInputChange} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                            </div>
                          </div>
                          
                          <div className=' relative border border-slate-600 bg-[#160219a2] rounded-lg p-5'>
                          <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
                            <h1 className="text-4xl font-bold text-[#fff] mb-4 text-center">
                              Medical History Section
                        </h1>
                        
                        {newPatient.medicalHistories.map((history, index) => (
                              <div key={index} className="mb-6">
                                <h3 className="text-2xl font-semibold mb-3 text-[#fff]">Medical History {index + 1}</h3>
                                
                                <div className="space-y-4 m-0 sm:m-10">
                                  <div className="flex items-center space-x-2">
                                    <Pill className="text-[#fff]" />
                                    <Input name={`pharmacy${index}`} placeholder="Pharmacy" value={history.pharmacy} onChange={(e) => handleMedicalHistoryChange(index, 'pharmacy', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                                  <div className="flex items-center space-x-2">
                                    <Stethoscope className="text-[#fff]" />
                                    <Input name={`physician${index}`} placeholder="Physician" value={history.physician} onChange={(e) => handleMedicalHistoryChange(index, 'physician', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="text-[#fff]" />
                                    <Input name={`event${index}`} placeholder="Event"  value={history.event} onChange={(e) => handleMedicalHistoryChange(index, 'event', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileSymlink className="text-[#fff]" />
                                    <Input name={`prescription${index}`} placeholder="Prescription" value={history.prescription} onChange={(e) => handleMedicalHistoryChange(index, 'prescription', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Pill className="text-[#fff]" />
                                    <Input name={`remedies${index}`} placeholder="Remedies" value={history.remedies} onChange={(e) => handleMedicalHistoryChange(index, 'remedies', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  </div>
                                </div>
                                {index > 0 && (
                                  <Button type="button" onClick={() => removeMedicalHistory(index)} className="mt-4 bg-black text-white border  hover:border-red-500 hover:bg-transparent">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Medical History
                                  </Button>
                                )}
                              </div>
                            ))}
                            {newPatient.medicalHistories.length < 5 && (
                              <Button type="button" onClick={addMedicalHistory} className="mt-4 bg-black text-white border  hover:border-green-500 hover:bg-transparent">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Medical History
                              </Button>
                            )}
                            
                           
                          </div>
                          <div className='relative border border-slate-600 bg-[#0a0218a2] rounded-lg p-5'>
                          <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
                          <h1 className="text-4xl font-bold text-[#fff] mb-4 text-center">
                              Test Report Section
                        </h1>
                        {newPatient.testReports.map((report, index) => (
                              <div key={index} className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-[#fff]">Test Report {index + 1}</h3>
                                <div className="space-y-4 m-0 sm:m-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                  <div className="flex items-center space-x-2">
                                    <UserCog className="text-[#fff]" />
                                    <Input name={`doctor${index}`} placeholder="Doctor" value={report.doctor} onChange={(e) => handleTestReportChange(index, 'doctor', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileSymlink className="text-[#fff]" />
                                    <Input name={`referredTo${index}`} placeholder="Referred to" value={report.referedto} onChange={(e) => handleTestReportChange(index, 'referedto', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileTextIcon className="text-[#fff]" />
                                    <Input name={`type${index}`} placeholder="Type" value={report.testtype} onChange={(e) => handleTestReportChange(index, 'testtype', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileText className="text-[#fff]" />
                                    <Input name={`comments${index}`} placeholder="Comments" value={report.comments} onChange={(e) => handleTestReportChange(index, 'comments', e.target.value)} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Upload className="text-[#fff]" />
                                    <Input name={`files${index}`} type="file"  onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const arrayBuffer = event.target.result as ArrayBuffer;
                              const uint8Array = new Uint8Array(arrayBuffer); handleTestReportChange(index, 'file', Array.from(uint8Array)); }
                            };
                            reader.readAsArrayBuffer(file);
                          }
                        }} className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                </div>
                                </div>
                                {index > 0 && (
                                  <Button type="button" onClick={() => removeTestReport(index)} className="mt-4 bg-black text-white border  hover:border-red-500 hover:bg-transparent">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Test Report
                                  </Button>
                                )}
                              </div>
                            ))}
                            {newPatient.testReports.length < 5 && (
                              <Button type="button" onClick={addTestReport} className="mt-4 bg-black text-white border  hover:border-green-500 hover:bg-transparent">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Test Report
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-4">
                          <Button type="button" onClick={() => setIsOpen(false)} className="bg-gray-600 hover:bg-gray-700">
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-black text-white border border-[#7047eb]  hover: hover:bg-[#7047eb]">
                            Add Patient
                          </Button>
                        </div>
                      </form>
                    </HeadlessDialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </HeadlessDialog>
          </Transition>

          <Button className="w-full md:w-auto bg-[#7047eb] border hover:bg-transparent hover:border-[#7047eb] text-white rounded-lg" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </section>

        <div className='relative'>
          {/* <MouseParallax ref={parallaxRef} className="relative z-10">
            <div className="hidden sm:block inset-0 left-90 w-[56.625rem] opacity-10 mix-blend-color-dodge pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
              </div>
            </div>
          </MouseParallax> */}
          <div className="bg-n-8/[0.5] rounded-lg p-4 overflow-x-auto shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-r border-transparent rounded-lg">
                  <TableHead className="text-[#7047eb] border-r">ID</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Name</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Age</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Gender</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Date</TableHead>
                  <TableHead className="text-[#7047eb]">Actions</TableHead>
                  <TableHead className="text-[#7047eb]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  paginatedPatients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="border-b border-transparent hover:bg-[#7047eb20] transition-colors duration-200 rounded-lg"
                    >
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{String(patient.age)}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{formatDate(patient.pdate)}</TableCell>
                      <TableCell>
                        <Link to={`/patient/${patient.id}`} className="text-[#7047eb] hover:underline">
                          View Details
                        </Link>
                      </TableCell>
                      <TableCell className='border-transparent'>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
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

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <Select onValueChange={handleItemsPerPageChange} defaultValue="10">
              <SelectTrigger className="w-[100px] bg-n-8 text-white border hover:border-[#7047eb] rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-n-8 text-white border-gray-700">
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
              className="bg-black border hover:bg-transparent hover:border-[#7047eb] hover:scale-95 transition duration-300 text-white rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className='text-slate-400'>Page {currentPage} of {totalPages}</span>
            <Button 
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
                simulateLoading()
              }}
              disabled={currentPage === totalPages || isLoading}
              className="bg-black border hover:bg-transparent hover:border-[#7047eb] hover:scale-95 transition duration-300 text-white rounded-lg"
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
