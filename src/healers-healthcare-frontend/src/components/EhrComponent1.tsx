'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, User, MapPin, Droplet, Ruler, Weight, Pill, Stethoscope, FileSymlink, FileText as FileTextIcon, Upload, Trash2, Search, CalendarIcon, Menu } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar1 } from "./ui/calendar"
import { Label } from "./ui/label"
// import { gradient } from '../assets'
import { MouseParallax, ScrollParallax } from "react-just-parallax"
import { addDays, format, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "../lib/utils"
import { Skeleton } from "./ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Transition, Dialog as HeadlessDialog } from '@headlessui/react'
import GridPattern from "./magicui/grid-pattern";

export default function PatientHealthRecord() {
  const [patients, setPatients] = useState([
    { id: '45678901', name: 'Alice Brown', age: 31, gender: 'Female', date: '2024-06-04' },
    { id: '56789012', name: 'Charlie Davis', age: 45, gender: 'Male', date: '2024-06-05' },
    { id: '67890123', name: 'Eva Wilson', age: 39, gender: 'Female', date: '2024-07-06' },
    { id: '78901234', name: 'John Doe 2', age: 35, gender: 'Female', date: '2024-06-07' },
    { id: '89012345', name: 'Jane Smith', age: 28, gender: 'Female', date: '2024-07-08' },
    { id: '90123456', name: 'Bob Johnson 2', age: 42, gender: 'Male', date: '2024-06-09' },
    { id: '01234567', name: 'Alice Brown', age: 31, gender: 'Female', date: '2024-07-10' },
    { id: '12345678', name: 'Charlie' , age: 45, gender: 'Male', date: '2024-07-11' },
    { id: '23456789', name: 'Eva Wilson 2', age: 39, gender: 'Female', date: '2024-07-12' },
    { id: '34567890', name: 'Bob Johnson 3', age: 42, gender:'Male', date: '2024-06-13' },
    { id: '01234577', name: 'Alice Brown', age: 31, gender: 'Female', date: '2024-07-10' },
    { id: '12345608', name: 'Charlie' , age: 45, gender: 'Male', date: '2024-07-11' },
    { id: '23455789', name: 'Eva Wilson 2', age: 39, gender: 'Female', date: '2024-07-12' },
    { id: '34560890', name: 'Bob Johnson 3', age: 42, gender:'Male', date: '2024-06-13' },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({ gender: '', date: undefined as DateRange | undefined, search: '' })
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [medicalHistories, setMedicalHistories] = useState([{}])
  const [testReports, setTestReports] = useState([{}])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const generateUniqueId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  const handleAddPatient = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPatient = {
      id: generateUniqueId(),
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string) || 0,
      gender: formData.get('gender') as string,
      date: new Date().toISOString().split('T')[0],
      location: formData.get('location') as string,
      bloodGroup: formData.get('bloodGroup') as string,
      height: formData.get('height') as string,
      weight: formData.get('weight') as string,
      medicalHistories: medicalHistories.map((_, index) => ({
        pharmacy: formData.get(`pharmacy${index}`) as string,
        physician: formData.get(`physician${index}`) as string,
        event: formData.get(`event${index}`) as string,
        prescription: formData.get(`prescription${index}`) as string,
        remedies: formData.get(`remedies${index}`) as string,
      })),
      testReports: testReports.map((_, index) => ({
        doctor: formData.get(`doctor${index}`) as string,
        referredTo: formData.get(`referredTo${index}`) as string,
        type: formData.get(`type${index}`) as string,
        comments: formData.get(`comments${index}`) as string,
      })),
    }
    setPatients(prevPatients => [...prevPatients, newPatient])
    setIsOpen(false)
    setMedicalHistories([{}])
    setTestReports([{}])
  }, [medicalHistories, testReports])

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
    simulateLoading()
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const genderMatch = filters.gender === '' || patient.gender === filters.gender
      const searchMatch = filters.search === '' || 
        patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        patient.id.includes(filters.search)
      let dateMatch = true
      if (filters.date?.from || filters.date?.to) {
        const patientDate = new Date(patient.date)
        if (filters.date.from && filters.date.to) {
          dateMatch = isWithinInterval(patientDate, { start: filters.date.from, end: filters.date.to })
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

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(value === 'all' ? filteredPatients.length : parseInt(value))
    setCurrentPage(1)
    simulateLoading()
  }, [filteredPatients.length])

  const paginatedPatients = useMemo(() => {
    return filteredPatients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredPatients, currentPage, itemsPerPage])

  useEffect(() => {
    if (paginatedPatients.length === 0 && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginatedPatients, currentPage])

  const parallaxRef = useRef(null)

  const addMedicalHistory = useCallback(() => {
    if (medicalHistories.length < 5) {
      setMedicalHistories(prev => [...prev, {}])
    }
  }, [medicalHistories])

  const removeMedicalHistory = useCallback((index: number) => {
    setMedicalHistories(prev => {
      const newHistories = [...prev]
      newHistories.splice(index, 1)
      return newHistories
    })
  }, [])

  const addTestReport = useCallback(() => {
    if (testReports.length < 5) {
      setTestReports(prev => [...prev, {}])
    }
  }, [testReports])

  const removeTestReport = useCallback((index: number) => {
    setTestReports(prev => {
      const newReports = [...prev]
      newReports.splice(index, 1)
      return newReports
    })
  }, [])

  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
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
                                <Input name="name" placeholder="Name" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                              <div className="flex items-center space-x-2">
                                <Calendar className="text-[#fff]" />
                                <Input name="age" type="number" placeholder="Age" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>


                              <div className="flex items-center space-x-2">
                                <UserCog className="text-[#fff]" />
                                <Select name="gender">
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
                                <Input name="location" placeholder="Location" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Droplet className="text-[#fff]" />
                                <Select name="bloodGroup">
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
                                <Input name="height" type="number" placeholder="Height (in cms.)" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Weight className="text-[#fff]" />
                                <Input name="weight" type="number" placeholder="Weight (in kg.)" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
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
                        
                            {medicalHistories.map((_, index) => (
                              <div key={index} className="mb-6">
                                <h3 className="text-2xl font-semibold mb-3 text-[#fff]">Medical History {index + 1}</h3>
                                
                                <div className="space-y-4 m-0 sm:m-10">
                                  <div className="flex items-center space-x-2">
                                    <Pill className="text-[#fff]" />
                                    <Input name={`pharmacy${index}`} placeholder="Pharmacy" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                                  <div className="flex items-center space-x-2">
                                    <Stethoscope className="text-[#fff]" />
                                    <Input name={`physician${index}`} placeholder="Physician" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="text-[#fff]" />
                                    <Input name={`event${index}`} placeholder="Event" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileSymlink className="text-[#fff]" />
                                    <Input name={`prescription${index}`} placeholder="Prescription" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Pill className="text-[#fff]" />
                                    <Input name={`remedies${index}`} placeholder="Remedies" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
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
                            {medicalHistories.length < 5 && (
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
                          {testReports.map((_, index) => (
                              <div key={index} className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-[#fff]">Test Report {index + 1}</h3>
                                <div className="space-y-4 m-0 sm:m-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                  <div className="flex items-center space-x-2">
                                    <UserCog className="text-[#fff]" />
                                    <Input name={`doctor${index}`} placeholder="Doctor" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileSymlink className="text-[#fff]" />
                                    <Input name={`referredTo${index}`} placeholder="Referred to" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileTextIcon className="text-[#fff]" />
                                    <Input name={`type${index}`} placeholder="Type" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <FileText className="text-[#fff]" />
                                    <Input name={`comments${index}`} placeholder="Comments" className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Upload className="text-[#fff]" />
                                    <Input name={`files${index}`} type="file" multiple className="flex-grow bg-black border-gray-700 focus:border-[#7047eb]" />
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
                            {testReports.length < 5 && (
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
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.date}</TableCell>
                      <TableCell className='border-transparent'>
                        <Link to={`/patient/${patient.id}`} className="text-[#7047eb] hover:underline">
                          View Details
                        </Link>
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
}