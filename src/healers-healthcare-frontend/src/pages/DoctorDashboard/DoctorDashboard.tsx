'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, User, MapPin, Phone, Clock, Briefcase, Search, CalendarIcon, Menu, CalendarCheck, TrendingUp } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { Skeleton } from "../../components/ui/skeleton"
import { Actor, HttpAgent } from '@dfinity/agent'
import { toast } from "sonner"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { Toaster } from "../../components/ui/sonner"

const specialties = [
  'NEUROSURGEON', 'UROLOGIST', 'ENT', 'GYNECOLOGIST', 'ORTHOPEDIC',
  'PEDIATRICIAN', 'GEN.PHYSICIAN', 'COSMETIC & PLASTIC SURGEON'
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Doctor = {
  name: string;
  experience: string;
  speciality: string;
  mobile: bigint;
  days: string[];
  dutyStart: string;
  dutyEnd: string;
  qualification: string;
  op: bigint;
};

export default function DoctorDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<{ specialty: string; days: string[]; search: string }>({ specialty: '', days: [], search: '' })
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const generateUniqueId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  useEffect(() => {
    const initializeActor = async () => {
      try {
        const canisterId = localStorage.getItem('hospitalCanisterId');
        if (!canisterId) {
          throw new Error('Hospital canister ID not found');
        }
        console.log('Initializing actor with canister ID:', canisterId);
        const agent = new HttpAgent({ host: 'https://ic0.app' });
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

  const fetchDoctors = useCallback(async () => {
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized');
      setError('Unable to fetch doctors. Please try logging in again.');
      return;
    }
  
    try {
      setIsLoading(true);
      const result = await hospitalActor.listDoctors();
      console.log('Fetched doctors:', result);
      setDoctors(result);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hospitalActor]);

  useEffect(() => {
    if (hospitalActor) {
      fetchDoctors();
    }
  }, [hospitalActor, fetchDoctors]);

  const handleAddDoctor = async (formData: FormData) => {
    if (!hospitalActor) {
      console.error('Hospital actor is not initialized');
      setError('Unable to add doctor. Please try logging in again.');
      return;
    }

    try {
      const newDoctor = {
        name: formData.get('name') as string,
        experience: formData.get('experience') as string,
        speciality: formData.get('specialty') as string,
        mobile: BigInt(formData.get('mobile') as string),
        days: days.filter(day => formData.get(day) === 'on'),
        dutyStart: formData.get('dutyStart') as string,
        dutyEnd: formData.get('dutyEnd') as string,
        qualification: formData.get('qualification') as string,
        op: BigInt(formData.get('opdFees') as string),
      }

      const result = await hospitalActor.AddDoctor(
        newDoctor.name,
        newDoctor.experience,
        newDoctor.speciality,
        newDoctor.mobile,
        newDoctor.days,
        newDoctor.dutyStart,
        newDoctor.dutyEnd,
        newDoctor.qualification,
        newDoctor.op
      );
      
      console.log("Doctor added successfully, result:", result);
      toast.success("Doctor added successfully");
      setIsOpen(false);
      fetchDoctors();
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error("Failed to add doctor. Please try again.");
    }
  };

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => {
      if (key === 'days') {
        const updatedDays = prev.days.includes(value)
          ? prev.days.filter(day => day !== value)
          : [...prev.days, value]
        return { ...prev, [key]: updatedDays }
      }
      return { ...prev, [key]: value === 'all' ? '' : value }
    })
    setCurrentPage(1)
  }, [])

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const specialtyMatch = filters.specialty === '' || doctor.speciality === filters.specialty
      const daysMatch = filters.days.length === 0 || filters.days.some(day => doctor.days.includes(day))
      const searchMatch = filters.search === '' || 
        doctor.name.toLowerCase().includes(filters.search.toLowerCase())
      return specialtyMatch && daysMatch && searchMatch
    })
  }, [doctors, filters])

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(value === 'all' ? filteredDoctors.length : parseInt(value))
    setCurrentPage(1)
    simulateLoading()
  }, [filteredDoctors.length])

  const paginatedDoctors = useMemo(() => {
    return filteredDoctors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredDoctors, currentPage, itemsPerPage])

  useEffect(() => {
    if (paginatedDoctors.length === 0 && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginatedDoctors, currentPage])

  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

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

  return (
    // start content
    <div className="flex flex-col md:flex-row  relative z-10 min-h-screen bg-[url('/grainyBg.png')] max-w-[1536px] mx-auto  bg-opacity-100 backdrop:blur-sm text-white">
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

      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Toaster />
        <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold mb-4 text-white">Doctor Dashboard</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">Manage and view detailed information about doctors, their specialties, and schedules.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={(value) => handleFilter('specialty', value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent className="bg-n-8 text-white border-gray-700">
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap items-center gap-2">
            <Label>Days:</Label>
            {days.map(day => (
              <div key={day} className="flex items-center">
                <Checkbox
                  id={day}
                  checked={filters.days.includes(day)}
                  onCheckedChange={() => handleFilter('days', day)}
                />
                <Label htmlFor={day} className="ml-1">{day}</Label>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#259b95]" />
            <Input
              placeholder="Search by name or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#259b95] text-white border-gray-700"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#259b95] border hover:bg-transparent hover:border-[#259b95] text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white border-gray-700 max-w-[90%] h-[70%] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#259b95] mb-4">Add New Doctor</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddDoctor(new FormData(e.currentTarget));
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="text-[#259b95]" />
                        <Label htmlFor="name">Name</Label>
                      </div>
                      <Input id="name" name="name" placeholder="Dr. John Doe" className="bg-black border-gray-700 focus:border-[#259b95]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="text-[#259b95]" />
                        <Label htmlFor="experience">Experience (years)</Label>
                      </div>
                      <Input id="experience" name="experience" type="number" placeholder="5" className="bg-black border-gray-700 focus:border-[#259b95]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <UserCog className="text-[#259b95]" />
                        <Label  htmlFor="specialty">Specialty</Label>
                      </div>
                      <Select name="specialty">
                        <SelectTrigger className="bg-black border-gray-700 focus:border-[#259b95]">
                          <SelectValue placeholder="Select Specialty" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-700">
                          {specialties.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="text-[#259b95]" />
                        <Label htmlFor="mobile">Mobile No.</Label>
                      </div>
                      <Input id="mobile" name="mobile" placeholder="+1 234 567 8900" className="bg-black border-gray-700 focus:border-[#259b95]" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CalendarCheck className="text-[#259b95]" />
                        <Label>Days Available</Label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {days.map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox id={`day-${day}`} name={day} />
                            <Label htmlFor={`day-${day}`}>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-[#259b95]" />
                          <Label htmlFor="dutyStart">Duty Start Time</Label>
                        </div>
                        <Input id="dutyStart" name="dutyStart" type="time" className="bg-black border-gray-700 focus:border-[#259b95]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-[#259b95]" />
                          <Label htmlFor="dutyEnd">Duty End Time</Label>
                        </div>
                        <Input id="dutyEnd" name="dutyEnd" type="time" className="bg-black border-gray-700 focus:border-[#259b95]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="text-[#259b95]" />
                        <Label htmlFor="qualification">Qualification</Label>
                      </div>
                      <Input id="qualification" name="qualification" placeholder="MBBS, MD" className="bg-black border-gray-700 focus:border-[#259b95]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="text-[#259b95]" />
                        <Label htmlFor="opdFees">OPD Fees</Label>
                      </div>
                      <Input id="opdFees" name="opdFees" type="number" placeholder="100" className="bg-black border-gray-700 focus:border-[#259b95]" />
                    </div>
                  </div>
                </div>
                <div className='w-full flex justify-center'>

                <Button type="submit" className="px-8 bg-[#259b95] hover:bg-[#1a6b67] text-white">
                  Add Doctor
                </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        <div className='relative'>
          <div className="bg-transparent backdrop-blur-lg rounded-lg p-4 overflow-x-auto shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-r border-transparent rounded-lg">
                  <TableHead className="text-[#259b95] border-r">ID</TableHead>
                  <TableHead className="text-[#259b95] border-r">Name</TableHead>
                  <TableHead className="text-[#259b95] border-r">Specialty</TableHead>
                  <TableHead className="text-[#259b95] border-r">Days Available</TableHead>
                  <TableHead className="text-[#259b95]">Duty Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  paginatedDoctors.map((doctor, index) => (
                    <TableRow 
                      key={index} 
                      className="border-b border-transparent hover:bg-[#081414] transition-colors duration-200 rounded-lg"
                    >
                      <TableCell>{generateUniqueId()}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.speciality}</TableCell>
                      <TableCell>{doctor.days.join(', ')}</TableCell>
                      <TableCell className='border-transparent'>{`${doctor.dutyStart} - ${doctor.dutyEnd}`}</TableCell>
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