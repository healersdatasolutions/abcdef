'use client'

import React, { useState, useEffect } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, Search, Menu, Users, Activity, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from 'react-router-dom'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'

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

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [patientCount, setPatientCount] = useState(0)
  const [doctorCount, setDoctorCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)
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
            to={item.name === 'Dashboard' ? '/' : `/${item.name.toLowerCase().replace(' ', '-')}`}
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

      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
            <CardHeader>
              <CardTitle>Patient Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
              <ResponsiveContainer width="100%" height={300}>
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

        <Card className="backdrop-blur-lg bg-[#2d2d2d35] border-white/45 text-white">
          <CardHeader>
            <CardTitle>Recent Patient Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
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
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}