'use client'

import React, { useState, useEffect } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, Search, Menu, Users, Activity, DollarSign, TrendingUp, Bell, Settings, LogOut, PieChart, Zap, Thermometer, Stethoscope, Pill, Clipboard, Heart, Brain, Eye, Bone, ShieldCheck, Clock, Droplet, Scale, Baby } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { StopwatchIcon } from '@radix-ui/react-icons'

// Dummy data for charts
const patientData = [
  { name: 'Jan', count: 100 },
  { name: 'Feb', count: 120 },
  { name: 'Mar', count: 150 },
  { name: 'Apr', count: 180 },
  { name: 'May', count: 200 },
  { name: 'Jun', count: 220 },
]

const appointmentData = [
  { name: 'Mon', count: 20 },
  { name: 'Tue', count: 25 },
  { name: 'Wed', count: 30 },
  { name: 'Thu', count: 22 },
  { name: 'Fri', count: 28 },
  { name: 'Sat', count: 15 },
  { name: 'Sun', count: 10 },
]

const departmentData = [
  { name: 'Cardiology', value: 30 },
  { name: 'Neurology', value: 25 },
  { name: 'Pediatrics', value: 20 },
  { name: 'Orthopedics', value: 15 },
  { name: 'Oncology', value: 10 },
]

const revenueData = [
  { name: 'Jan', revenue: 50000 },
  { name: 'Feb', revenue: 55000 },
  { name: 'Mar', revenue: 60000 },
  { name: 'Apr', revenue: 58000 },
  { name: 'May', revenue: 65000 },
  { name: 'Jun', revenue: 70000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [patientCount, setPatientCount] = useState(0)
  const [doctorCount, setDoctorCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [revenueTotal, setRevenueTotal] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  interface Patient {
    name: string;
    gender: string;
    age: number;
  }

  const [recentPatients, setRecentPatients] = useState<Patient[]>([])

  useEffect(() => {
    const initializeActor = async () => {
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
      }
    }

    initializeActor()
  }, [])

  useEffect(() => {
    if (hospitalActor) {
      fetchDashboardData()
    }
  }, [hospitalActor])

  const fetchDashboardData = async () => {
    try {
      if (hospitalActor) {
        const patients = await hospitalActor.listPatients()
        setPatientCount(patients.length)
        setRecentPatients(patients.slice(-5).reverse().map(patient => ({
          ...patient,
          age: Number(patient.age)
        })))

        const doctors = await hospitalActor.listDoctors()
        setDoctorCount(doctors.length)

        const appointments = await hospitalActor.listAppointments()
        setAppointmentCount(appointments.length)

        // Dummy revenue calculation (replace with actual logic when available)
        setRevenueTotal(appointments.length * 100) // Assuming $100 per appointment
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[url('/grainyBg.png')] text-white">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-black p-4 md:p-6">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block w-64 mx-2 my-5 rounded-lg bg-transparent backdrop-blur border border-white/20 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className=" flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center  md:text-left">Dashboard</h1>
         
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patientCount}</div>
                  <p className="text-xs text-blue-200">+20% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                  <UserCog className="h-4 w-4 text-green-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorCount}</div>
                  <p className="text-xs text-green-200">+5% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentCount}</div>
                  <p className="text-xs text-purple-200">+15% from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenueTotal}</div>
                  <p className="text-xs text-yellow-200">+10% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Patient Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={patientData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Bar dataKey="count" fill="#259b95" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Weekly Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Line type="monotone" dataKey="count" stroke="#259b95" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Recent Patient Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${patient.name}`} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{patient.name}</p>
                          <p className="text-xs text-gray-400">{patient.gender}, {patient.age.toString()} years old</p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#259b95" fill="#259b95" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: 'Cardiology', icon: Heart, patients: 150, doctors: 8 },
                    { name: 'Neurology', icon: Brain, patients: 120, doctors: 6 },
                    { name: 'Pediatrics', icon: Baby, patients: 200, doctors: 10 },
                    { name: 'Orthopedics', icon: Bone, patients: 100, doctors: 5 },
                    { name: 'Oncology', icon: Zap, patients: 80, doctors: 4 },
                  ].map((dept, index) => (
                    <Card key={index} className="bg-[#1f2937] text-white">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <dept.icon className="h-6 w-6" />
                          <Badge variant="secondary">{dept.doctors} Doctors</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <CardDescription className="text-gray-400">{dept.patients} Patients</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="patients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Patient Distribution by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Patient Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { age: '0-18', count: 50 },
                      { age: '19-35', count: 120 },
                      { age: '36-50', count: 80 },
                      { age: '51-65', count: 60 },
                      { age: '65+', count: 40 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Bar dataKey="count" fill="#259b95" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
              <CardHeader>
                <CardTitle>Patient Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Blood Pressure', icon: Activity, value: '120/80', unit: 'mmHg' },
                    { name: 'Heart Rate', icon: Heart, value: '72', unit: 'bpm' },
                    { name: 'Body Temperature', icon: Thermometer, value: '98.6', unit: '°F' },
                    { name: 'Respiratory Rate', icon: StopwatchIcon, value: '16', unit: 'breaths/min' },
                    { name: 'Oxygen Saturation', icon: Droplet, value: '98', unit: '%' },
                    { name: 'BMI', icon: Scale, value: '24.5', unit: 'kg/m²' },
                  ].map((metric, index) => (
                    <Card key={index} className="bg-[#1f2937] text-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metric.value}<span className="text-sm ml-1">{metric.unit}</span></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4">
            <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {/* Replace with actual appointment data */}
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-gray-700">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=Patient${index}`} />
                          <AvatarFallback>P{index}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Patient {index + 1}</p>
                          <p className="text-sm text-gray-400">Dr. Smith • Cardiology</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">2:00 PM</p>
                        <p className="text-sm text-gray-400">Today</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Appointment Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Check-up', value: 400 },
                          { name: 'Follow-up', value: 300 },
                          { name: 'Consultation', value: 200 },
                          { name: 'Procedure', value: 100 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Appointment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Scheduled', count: 45, color: 'bg-blue-500' },
                      { status: 'Completed', count: 30, color: 'bg-green-500' },
                      { status: 'Cancelled', count: 10, color: 'bg-red-500' },
                      { status: 'No-show', count: 5, color: 'bg-yellow-500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span>{item.status}</span>
                            <span>{item.count}</span>
                          </div>
                          <Progress value={(item.count / 90) * 100} className={`h-2 ${item.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
              <CardHeader>
                <CardTitle>Hospital Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-blue-500 rounded-lg">
                    <Zap className="h-6 w-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium">Bed Occupancy Rate</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-500 rounded-lg">
                    <Activity className="h-6 w-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium">Average Length of Stay</p>
                      <p className="text-2xl font-bold">4.2 days</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-yellow-500 rounded-lg">
                    <Users className="h-6 w-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium">Patient Satisfaction</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-500 rounded-lg">
                    <PieChart className="h-6 w-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium">Operating Margin</p>
                      <p className="text-2xl font-bold">12.5%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Staff Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { department: 'Nursing', efficiency: 85 },
                      { department: 'Physicians', efficiency: 90 },
                      { department: 'Admin', efficiency: 75 },
                      { department: 'Lab', efficiency: 88 },
                      { department: 'Radiology', efficiency: 82 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Bar dataKey="efficiency" fill="#259b95" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
                <CardHeader>
                  <CardTitle>Patient Readmission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[
                      { month: 'Jan', rate: 8.2 },
                      { month: 'Feb', rate: 7.8 },
                      { month: 'Mar', rate: 7.5 },
                      { month: 'Apr', rate: 7.2 },
                      { month: 'May', rate: 6.9 },
                      { month: 'Jun', rate: 6.7 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Line type="monotone" dataKey="rate" stroke="#259b95" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Emergency Response Time', value: '8 mins', icon: Zap },
                    { name: 'Surgery Success Rate', value: '98.5%', icon: TrendingUp },
                    { name: 'Patient Wait Time', value: '22 mins', icon: Clock },
                    { name: 'Infection Control Rate', value: '99.2%', icon: ShieldCheck },
                  ].map((kpi, index) => (
                    <Card key={index} className="bg-[#1f2937] text-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}