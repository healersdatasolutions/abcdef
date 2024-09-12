'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, User, Clock, Search, CalendarIcon, Menu } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { MouseParallax } from "react-just-parallax"
import { Skeleton } from "./ui/skeleton"

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

const statuses = ['Pending', 'Done']

export default function Appointment() {
  const [appointments, setAppointments] = useState([
    { id: 'APT001', patientName: 'John Doe', doctorName: 'Dr. Jane Smith', time: '2023-07-01 10:00', status: 'Pending' },
    { id: 'APT002', patientName: 'Alice Johnson', doctorName: 'Dr. Bob Brown', time: '2023-07-01 11:30', status: 'Done' },
    { id: 'APT003', patientName: 'John Doe', doctorName: 'Dr. Jane Smith', time: '2023-07-01 10:00', status: 'Pending' },
    { id: 'APT004', patientName: 'Alice Johnson', doctorName: 'Dr. Bob Brown', time: '2023-07-01 11:30', status: 'Done' },
    { id: 'APT005', patientName: 'John Doe', doctorName: 'Dr. Jane Smith', time: '2023-07-01 10:00', status: 'Done' },
    { id: 'APT006', patientName: 'Alice Johnson', doctorName: 'Dr. Bob Brown', time: '2023-07-01 11:30', status: 'Done' },
    { id: 'APT007', patientName: 'John Doe', doctorName: 'Dr. Jane Smith', time: '2023-07-01 10:00', status: 'Done' },
    { id: 'APT008', patientName: 'Alice Johnson', doctorName: 'Dr. Bob Brown', time: '2023-07-01 11:30', status: 'Done' },
    { id: 'APT009', patientName: 'John Doe', doctorName: 'Dr. Jane Smith', time: '2023-07-01 10:00', status: 'Pending' },
    { id: 'APT010', patientName: 'Alice Johnson', doctorName: 'Dr. Bob Brown', time: '2023-07-01 11:30', status: 'Pending' },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({ status: '', time: '', search: '' })
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const generateUniqueId = () => {
    return 'APT' + Math.floor(1000 + Math.random() * 9000).toString()
  }

  const handleAddAppointment = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newAppointment = {
      id: generateUniqueId(),
      patientName: formData.get('patientName') as string,
      doctorName: formData.get('doctorName') as string,
      time: formData.get('time') as string,
      status: 'Pending',
    }
    setAppointments(prevAppointments => [...prevAppointments, newAppointment])
    setIsOpen(false)
  }, [])

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
    simulateLoading()
  }, [])

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const statusMatch = filters.status === '' || appointment.status === filters.status
      const timeMatch = filters.time === '' || appointment.time.includes(filters.time)
      const searchMatch = filters.search === '' || 
        appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(filters.search.toLowerCase()) ||
        appointment.id.includes(filters.search)
      return statusMatch && timeMatch && searchMatch
    })
  }, [appointments, filters])

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

  const parallaxRef = useRef(null)

  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const SidebarContent = () => (
    <>
      {/* <h2 className="text-xl md:text-2xl font-bold text-[#7047eb] mb-8">Healers Healthcare</h2> */}
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
        <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold mb-4 text-white">Appointments</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">Manage and view all scheduled appointments for patients and doctors.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={(value) => handleFilter('status', value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-n-8 text-white border hover:border-[#7047eb] rounded-lg">
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
              onChange={(e) => handleFilter('time', e.target.value)}
              className="bg-transparent border hover:border-[#7047eb] text-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#7047eb]" />
            <Input
              placeholder="Search by patient, doctor or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#7047eb] text-white"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#7047eb] border hover:bg-transparent hover:border-[#7047eb] text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#7047eb] mb-4">Add New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAppointment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="text-[#7047eb]" />
                      <Input name="patientName" placeholder="Patient Name" className="flex-grow bg-black border hover:bg-transparent hover:border-[#7047eb] transiton duration-200" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCog className="text-[#7047eb]" />
                      <Input name="doctorName" placeholder="Doctor Name" className="flex-grow bg-black border hover:bg-transparent hover:border-[#7047eb] transiton duration-200" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-[#7047eb]" />
                      <Input name="time" type="datetime-local" className="flex-grow bg-black border hover:bg-transparent hover:border-[#7047eb] transiton duration-200" />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full border bg-[#7047eb] hover:bg-[#000] hover:border-[#7047eb] text-white">
                  Add Appointment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
                  <TableHead className="text-[#7047eb] border-r">Appointment ID</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Patient</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Doctor</TableHead>
                  <TableHead className="text-[#7047eb] border-r">Time</TableHead>
                  <TableHead className="text-[#7047eb]">Status</TableHead>
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
                  paginatedAppointments.map((appointment) => (
                    <TableRow 
                      key={appointment.id} 
                      className="border-b border-transparent hover:bg-[#7047eb20] transition-colors duration-200 rounded-lg"
                    >
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell className='border-transparent'>
                        <span className={`px-2 py-1 rounded-lg ${appointment.status === 'Done' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          {appointment.status}
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