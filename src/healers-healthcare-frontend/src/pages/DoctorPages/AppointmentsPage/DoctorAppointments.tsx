'use client'



import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FileText, UserCog, Calendar, Package, ChevronLeft, ChevronRight, Search, CalendarIcon, Menu, Eye } from 'lucide-react'
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Calendar1 } from "../../../components/ui/calendar"
import { Skeleton } from "../../../components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet"
import { format } from "date-fns"
import { cn } from "../../../lib/utils"

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([
    { id: 'APT001', patientName: 'John Doe', patientId: 'PT001', appointmentId: 'APT001', time: '2023-07-01 10:00', date: '2023-07-01' },
    { id: 'APT002', patientName: 'Alice Johnson', patientId: 'PT002', appointmentId: 'APT002', time: '2023-07-01 11:30', date: '2023-07-01' },
    { id: 'APT003', patientName: 'Bob Smith', patientId: 'PT003', appointmentId: 'APT003', time: '2023-07-02 09:00', date: '2023-07-02' },
    { id: 'APT004', patientName: 'Emma Wilson', patientId: 'PT004', appointmentId: 'APT004', time: '2023-07-02 14:00', date: '2023-07-02' },
    { id: 'APT005', patientName: 'Michael Brown', patientId: 'PT005', appointmentId: 'APT005', time: '2023-07-03 11:00', date: '2023-07-03' },
    { id: 'APT006', patientName: 'Sarah Davis', patientId: 'PT006', appointmentId: 'APT006', time: '2023-07-03 16:30', date: '2023-07-03' },
    { id: 'APT007', patientName: 'David Lee', patientId: 'PT007', appointmentId: 'APT007', time: '2023-07-04 10:30', date: '2023-07-04' },
    { id: 'APT008', patientName: 'Linda Taylor', patientId: 'PT008', appointmentId: 'APT008', time: '2023-07-04 13:00', date: '2023-07-04' },
    { id: 'APT009', patientName: 'James Wilson', patientId: 'PT009', appointmentId: 'APT009', time: '2023-07-05 09:30', date: '2023-07-05' },
    { id: 'APT010', patientName: 'Patricia Moore', patientId: 'PT010', appointmentId: 'APT010', time: '2023-07-05 15:00', date: '2023-07-05' },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ date: undefined, search: '' })
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
    simulateLoading()
  }, [])

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const dateMatch = !filters.date || appointment.date === format(filters.date, 'yyyy-MM-dd')
      const searchMatch = filters.search === '' || 
        appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        appointment.patientId.includes(filters.search) ||
        appointment.appointmentId.includes(filters.search)
      return dateMatch && searchMatch
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

  const simulateLoading = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const SidebarContent = () => (
    <>
      <h2 className="text-xl md:text-2xl font-bold text-[#7047eb] mb-8">Healers Healthcare</h2>
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
        <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold mb-4 text-white">Today's Appointments</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">View and manage your patients' appointments for today and upcoming days.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-[280px] justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar1
                mode="single"
                selected={filters.date}
                onSelect={(date) => handleFilter('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#7047eb]" />
            <Input
              placeholder="Search by patient name or ID"
              className="w-full md:w-auto bg-transparent border hover:border-[#7047eb] text-white"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>
        </section>

        <div className="bg-n-8/[0.5] rounded-lg p-4 overflow-x-auto shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-r border-transparent rounded-lg">
                <TableHead className="text-[#7047eb] border-r">Patient ID</TableHead>
                <TableHead className="text-[#7047eb] border-r">Patient Name</TableHead>
                <TableHead className="text-[#7047eb] border-r">Appointment ID</TableHead>
                <TableHead className="text-[#7047eb] border-r">Date</TableHead>
                <TableHead className="text-[#7047eb] border-r">Time</TableHead>
                <TableHead className="text-[#7047eb]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(itemsPerPage).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedAppointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id} 
                    className="border-b border-transparent hover:bg-[#7047eb20] transition-colors duration-200 rounded-lg"
                  >
                    <TableCell>{appointment.patientId}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.appointmentId}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time.split(' ')[1]}</TableCell>
                    <TableCell className='border-transparent'>
                      <Link to={`/patient/${appointment.patientId}`} className="text-[#7047eb] hover:underline flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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