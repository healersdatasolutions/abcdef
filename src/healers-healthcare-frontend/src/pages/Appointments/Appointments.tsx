'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, User, Clock, Search, CalendarIcon, Menu, Phone, Mail } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Skeleton } from "../../components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Textarea } from "../../components/ui/textarea"
import { Checkbox } from "../../components/ui/checkbox"
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { Toaster } from "../../components/ui/sonner"
import { toast } from "sonner"

const statuses = ['Pending', 'Done']
const doctors = [
  'Dr. Jane Smith',
  'Dr. John Doe',
  'Dr. Emily Johnson',
  'Dr. Michael Brown',
  'Dr. Sarah Lee'
]

type Appointment = {
  patientName: string;
  patientAge: string;
  gender: string;
  contact: bigint;
  email: string;
  doctor: string;
  date: string;
  appTime: string;
  consultation: string;
  existingConditions: [string];
  currentMedications: string;
  allergies: string;
  nOfVisits: bigint;
  insuranceProvider: string;
  emergencyContactName: string;
  emergencyContactPhone: bigint; 
}

type Filters = {
  status: string;
  search: string;
  date: string;
};

export default function Appointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({status: '', date: '', search: ''})
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateUniqueId = () => {
    return 'APT' + Math.floor(1000 + Math.random() * 9000).toString()
  }

  const initializeActor = useCallback(async () => {
    try {
      const canisterId = localStorage.getItem('hospitalCanisterId')
      if (!canisterId) {
        throw new Error('Hospital canister ID not found')
      }
      console.log('Initializing actor with canister ID:', canisterId)
      const agent = new HttpAgent({ host: 'https://ic0.app' }) 
      const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory, {
        agent,
        canisterId,
      })
      console.log('Actor initialized successfully')
      setHospitalActor(actor)
    } catch (err) {
      console.error('Failed to initialize hospital actor:', err)
      setError('Failed to connect to the hospital service. Please try logging in again.')
    }
  }, [])
  
  const fetchAppointments = useCallback(async () => {
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized')
      setError('Unable to fetch appointments. Please try logging in again.')
      return
    }
    try {
      setIsLoading(true)
      const result = await hospitalActor.listAppointments()
      console.log('Fetched appointments:', result)
      
      const convertedAppointments: Appointment[] = result.map(apt => ({
        ...apt,
        contact: BigInt(apt.contact.toString()),
        nOfVisits: BigInt(apt.nOfVisits.toString()),
        emergencyContactPhone: BigInt(apt.emergencyContactPhone.toString()),
        existingConditions: Array.isArray(apt.existingConditions) && apt.existingConditions.length > 0
          ? [apt.existingConditions[0]]
          : ['']
      }))
      
      setAppointments(convertedAppointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Failed to fetch appointments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [hospitalActor])

  useEffect(() => {
    initializeActor()
  }, [initializeActor])

  useEffect(() => {
    if (hospitalActor) {
      fetchAppointments()
    }
  }, [hospitalActor, fetchAppointments])

  const handleAddAppointment = async (formData: FormData) => {
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized')
      return
    }
    try {
      const existingConditionsString = formData.get('existingConditions') as string
      const existingConditionsArray = existingConditionsString.split(', ')

      const newAppointment: Appointment = {
        patientName: formData.get('patientName') as string,
        patientAge: formData.get('patientAge') as string,
        gender: formData.get('patientGender') as string,
        contact: BigInt(formData.get('contactNumber') as string),
        email: formData.get('emailAddress') as string,
        doctor: formData.get('doctorName') as string,
        date: formData.get('appointmentDate') as string,
        appTime: formData.get('appointmentTime') as string,
        consultation: formData.get('consultationType') as string,
        existingConditions: [existingConditionsArray[0] || ''],
        currentMedications: formData.get('currentMedications') as string,
        allergies: formData.get('allergies') as string,
        nOfVisits: BigInt(formData.get('previousVisits') as string),
        insuranceProvider: formData.get('insuranceProvider') as string,
        emergencyContactName: formData.get('emergencyContact') as string,
        emergencyContactPhone: BigInt(formData.get('emergencyPhone') as string),
      }

      await hospitalActor.addAppointment(
        newAppointment.patientName,
        newAppointment.patientAge,
        newAppointment.gender,
        newAppointment.contact,
        newAppointment.email,
        newAppointment.doctor,
        newAppointment.date,
        newAppointment.appTime,
        newAppointment.consultation,
        newAppointment.existingConditions,
        newAppointment.currentMedications,
        newAppointment.allergies,
        newAppointment.nOfVisits,
        newAppointment.insuranceProvider,
        newAppointment.emergencyContactName,
        newAppointment.emergencyContactPhone
      )

      console.log("Appointment added successfully")
      toast.success("Appointment added successfully")
      setIsOpen(false)
      fetchAppointments()
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast.error('Failed to add appointment. Please try again.')
    }
  }

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
    simulateLoading()
  }, [])

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const statusMatch = filters.status === '' || appointment.consultation === filters.status;
      const searchMatch = filters.search === '' ||
        appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(filters.search.toLowerCase());
      const dateMatch = filters.date === '' || appointment.date === filters.date;

      return statusMatch && searchMatch && dateMatch;
    });
  }, [appointments, filters]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(value === 'all' ? filteredAppointments.length : parseInt(value))
    setCurrentPage(1)
    simulateLoading()
  }, [filteredAppointments.length])

  const paginatedAppointments = useMemo(() => {
    return filteredAppointments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredAppointments, currentPage, itemsPerPage])

  useEffect(() => {
    if (paginatedAppointments.length === 0 && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginatedAppointments, currentPage])

  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const SidebarContent = () => (
    <>
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
              className="flex items-center p-3 rounded-lg hover:bg-[#259b95] transition-colors duration-200"
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

  const EnhancedAppointmentForm: React.FC<{ onSubmit: (formData: FormData) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  
    const handleConditionChange = (condition: string) => {
      setSelectedConditions(prev =>
        prev.includes(condition)
          ? prev.filter(c => c !== condition)
          : [...prev, condition]
      );
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append('existingConditions', selectedConditions.join(', '));
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#259b95]">Basic Information</h3>
            <div className="flex items-center space-x-2">
              <User className="text-[#259b95]" />
              <Input name="patientName" placeholder="Patient Name" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
            <div className="flex items-center space-x-2">
              <Input name="patientAge" type="number" placeholder="Patient Age" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
            <Select name="patientGender">
              <SelectTrigger className="w-full bg-black border hover:border-[#259b95] transition duration-200">
                <SelectValue placeholder="Patient Gender" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Phone className="text-[#259b95]" />
              <Input name="contactNumber" type="tel" placeholder="Contact Number" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-[#259b95]" />
              <Input name="emailAddress" type="email" placeholder="Email Address" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
          </div>
  
          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#259b95]">Appointment Details</h3>
            <Select name="doctorName">
              <SelectTrigger className="w-full bg-black border hover:border-[#259b95] transition duration-200">
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center  space-x-2">
              <Calendar className="text-[#259b95]" />
              <Input name="appointmentDate" type="date" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
            <Select name="appointmentTime">
              <SelectTrigger className="w-full bg-black border hover:border-[#259b95] transition duration-200">
                <SelectValue placeholder="Appointment Time" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
            <Select name="consultationType">
              <SelectTrigger className="w-full bg-black border hover:border-[#259b95] transition duration-200">
                <SelectValue placeholder="Type of Consultation" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="teleconsultation">Teleconsultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          {/* Medical Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-[#259b95]">Medical Information</h3>
            <div className="space-y-2">
              <Label>Existing Conditions</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis'].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={condition} 
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionChange(condition)}
                    />
                    <label htmlFor={condition} className="text-sm">{condition}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea 
                id="currentMedications" 
                name="currentMedications" 
                placeholder="List your current medications" 
                className="bg-black border hover:border-[#259b95] transition duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea 
                id="allergies" 
                name="allergies" 
                placeholder="List any allergies" 
                className="bg-black border hover:border-[#259b95] transition duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="text-[#259b95]" />
              <Input name="previousVisits" type="number" placeholder="Number of Previous Doctor Visits" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
          </div>
  
          {/*Insurance and Emergency */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-[#259b95]">Insurance and Emergency</h3>
            <Select name="insuranceProvider">
              <SelectTrigger className="w-full bg-black border hover:border-[#259b95] transition duration-200">
                <SelectValue placeholder="Insurance Provider" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                <SelectItem value="provider1">Provider 1</SelectItem>
                <SelectItem value="provider2">Provider 2</SelectItem>
                <SelectItem value="provider3">Provider 3</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <User className="text-[#259b95]" />
              <Input name="emergencyContact" placeholder="Emergency Contact Name" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-[#259b95]" />
              <Input name="emergencyPhone" type="tel" placeholder="Emergency Contact Phone" className="flex-grow bg-black border hover:border-[#259b95] transition duration-200" />
            </div>
          </div>
        </div>
  
        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={onCancel} variant="outline" className="border-[#259b95] text-[#259b95] hover:bg-[#259b95] hover:text-white">
            Cancel
          </Button>
          <Button type="submit" className="bg-[#259b95] hover:bg-[#1a6b67] text-white">
            Add Appointment
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-[#030b0b] p-4 md:p-6">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block w-64 bg-[#030b0b] p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Toaster />
        <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold mb-4 text-white">Appointments</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">Manage and view all scheduled appointments for patients and doctors.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={(value) => handleFilter('status', value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-n-8 text-white border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Label>Date:</Label>
            <Input
              type="date"
              onChange={(e) => handleFilter('date', e.target.value)}
              className="bg-transparent border hover:border-[#259b95] text-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#259b95]" />
            <Input
              placeholder="Search by patient, doctor or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#259b95] text-white"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#259b95] border hover:bg-transparent hover:border-[#259b95] text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white border-gray-700 max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#259b95] mb-4">Add New Appointment</DialogTitle>
              </DialogHeader>
              <EnhancedAppointmentForm 
                onSubmit={handleAddAppointment}
                onCancel={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </section>

        <div className='relative'>
          <div className="bg-n-8/[0.5] rounded-lg p-4 overflow-x-auto shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-r border-transparent rounded-lg">
                  <TableHead className="text-[#259b95] border-r">Appointment ID</TableHead>
                  <TableHead className="text-[#259b95] border-r">Patient</TableHead>
                  <TableHead className="text-[#259b95] border-r">Doctor</TableHead>
                  <TableHead className="text-[#259b95] border-r">Time</TableHead>
                  <TableHead className="text-[#259b95]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  paginatedAppointments.map((appointment, index) => (
                    <TableRow 
                      key={index} 
                      className="border-b border-transparent hover:bg-[#081414] transition-colors duration-200 rounded-lg"
                    >
                      <TableCell>{generateUniqueId()}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell className='border-transparent'>
                      <span className={`px-2 py-1 rounded-lg ${appointment.consultation === 'in-person' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          {appointment.consultation}
                        </span>
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
              <SelectTrigger className="w-[100px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
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
              className="bg-black border hover:bg-transparent hover:border-[#259b95] hover:scale-95 transition duration-300 text-white rounded-lg"
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
}