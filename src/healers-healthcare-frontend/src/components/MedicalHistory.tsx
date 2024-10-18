'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Pill, Stethoscope, Calendar, FileSymlink, FileText, Package, UserCog, Menu, Search, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { idlFactory } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { toast } from "sonner" 
import { Actor, HttpAgent } from '@dfinity/agent'
import { Toaster } from "./ui/sonner"
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'

type MedicalHistory = {
  pharmacy: string;
  physician: string;
  event: string;
  prescription: string;
  remedies: string;
}

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
}

export default function MedicalHistory() {
  const { id } = useParams<{ id: string }>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [filters, setFilters] = useState({ search: '', event: 'all' })
  const [expandedHistories, setExpandedHistories] = useState<Set<number>>(new Set())

  const initializeActor = useCallback(async () => {
    try {
      const canisterId = localStorage.getItem('hospitalCanisterId')
      if (!canisterId) {
        throw new Error('Hospital canister ID not found')
      }
      console.log('Initializing actor with canister ID:', canisterId)
      const agent = new HttpAgent({ host: 'https://icp-api.io/' })
      const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory,  {
        agent,
        canisterId,
      })
      console.log('Actor initialized successfully')
      setHospitalActor(actor)
    } catch (err) {
      console.error('Failed to initialize hospital actor:', err)
      setError('Failed to connect to the hospital service')
      toast.error('Failed to connect to the hospital service. Please try logging in again.')
    }
  }, [])

  useEffect(() => {
    initializeActor()
  }, [initializeActor])

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!id || !hospitalActor) {
        setError('Patient ID is undefined or hospital actor not initialized')
        setIsLoading(false)
        return
      }
      try {
        const response = await hospitalActor.getPatientById(id)

        if (response && Array.isArray(response) && response.length > 0) {
          const patient = response[0]
          if (patient) {
            const formattedPatient: Patient = {
              id: patient.id,
              name: patient.name,
              age: BigInt(patient.age),
              gender: patient.gender,
              location: patient.location,
              blood: patient.blood,
              height: BigInt(patient.height),
              weight: BigInt(patient.weight),
              medicalHistories: patient.medicalHistories,
            }
            setPatientData(formattedPatient)
          } else {
            setError("Patient data is undefined")
          }
        } else {
          setError("Patient not found")
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setError("Failed to fetch patient data")
        toast.error('Failed to fetch patient data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (hospitalActor) {
      fetchMedicalHistory()
    }
  }, [id, hospitalActor])

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

  const filteredHistories = patientData?.medicalHistories.filter(history => 
    history.physician.toLowerCase().includes(filters.search.toLowerCase()) ||
    history.event.toLowerCase().includes(filters.search.toLowerCase()) ||
    history.pharmacy.toLowerCase().includes(filters.search.toLowerCase())
  ).filter(history => 
    filters.event === 'all' || history.event === filters.event
  ) || []

  const toggleExpand = (index: number) => {
    setExpandedHistories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }
  if (error) {
    return <div className="text-white">Error: {error}</div>
  }
  if (!patientData) {
    return <div className="text-white">No patient data found</div>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
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

      <div className="hidden md:block w-64 bg-[#030b0b] p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/health-records" className="hover:text-[#259b95]">Health Records</Link>
          <span className="mx-2">/</span>
          <Link to={`/patient/${id}`} className="hover:text-[#259b95]">Patient Details</Link>
          <span className="mx-2">/</span>
          <span className="text-[#259b95]">Medical History</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Medical History</h1>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 flex-grow">
            <Search className="text-[#259b95]" />
            <Input
              placeholder="Search by physician, event, or pharmacy"
              className="w-full bg-transparent border hover:border-[#259b95] text-white border-gray-700"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select 
            value={filters.event} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, event: value }))}
          >
            <SelectTrigger className="w-[200px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-gray-700">
              <SelectItem value="all">All Events</SelectItem>
              {Array.from(new Set(patientData?.medicalHistories.map(history => history.event))).map(event => (
                <SelectItem key={event} value={event}>{event}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistories.length > 0 ? (
              filteredHistories.map((history, index) => {
                const isExpanded = expandedHistories.has(index);
                return (
                  <Card key={index} className={`text-white bg-[#131313a2] border hover:border-[#259b95] transition-all duration-300 ${isExpanded ? 'col-span-3' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-[#fff] flex justify-between items-center">
                        <span>Medical Report {index + 1}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleExpand(index)}
                          className="text-[#259b95] hover:text-[#1a6b67]"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`grid gap-4 ${isExpanded ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Pill className="text-[#259b95]" />
                            <span>Pharmacy: {history.pharmacy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="text-[#259b95]" />
                            <span>Physician: {history.physician}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-[#259b95]" />
                            <span>Event: {history.event}</span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileSymlink className="text-[#259b95]" />
                              <span>Prescription: {history.prescription}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Pill className="text-[#259b95]" />
                              <span>Remedies: {history.remedies}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500">No medical history found matching the current filters.</div>
            )}
          </div>
        </ScrollArea>
      </div>
      <Toaster />
    </div>
  )
}