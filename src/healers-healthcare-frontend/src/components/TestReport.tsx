'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Stethoscope, FileSymlink, FileText, Calendar, Package, UserCog, Menu, X, Search, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { idlFactory } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { Actor, HttpAgent } from '@dfinity/agent'
import { toast } from "sonner" 
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'

type TestReport = {
  doctor: string;
  referredTo: string;
  testType: string;
  comments: string;
  file: number[] | Uint8Array;
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
  pdate: bigint;
  testReports: TestReport[];
}

export default function TestReport() {
  const { id } = useParams<{ id: string }>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [filters, setFilters] = useState({ search: '', testType: 'all' })
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set())

  const initializeActor = useCallback(async () => {
    try {
      const canisterId = localStorage.getItem('hospitalCanisterId')
      if (!canisterId) {
        throw new Error('Hospital canister ID not found')
      }
      console.log('Initializing actor with canister ID:', canisterId)
      const agent = new HttpAgent({ host: 'https://icp-api.io/' })
      const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory, {
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
    const fetchTestReports = async () => {
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
              pdate: BigInt(patient.pdate),
              testReports: patient.testReports,
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
      fetchTestReports()
    }
  }, [id, hospitalActor])

  const byteArrayToBase64 = (byteArray: number[] | Uint8Array): string => {
    const uint8Array = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(byteArray);
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

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

  const filteredReports = patientData?.testReports.filter(report => 
    report.doctor.toLowerCase().includes(filters.search.toLowerCase()) ||
    report.testType.toLowerCase().includes(filters.search.toLowerCase())
  ).filter(report => 
    filters.testType === 'all' || report.testType === filters.testType
  ) || []

  const toggleExpand = (index: number) => {
    setExpandedReports(prev => {
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
          <span className="text-[#259b95]">Test Reports</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Test Reports</h1>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 flex-grow">
            <Search className="text-[#259b95]" />
            <Input
              placeholder="Search by doctor or test type"
              className="w-full bg-transparent border hover:border-[#259b95] text-white border-gray-700"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select 
            value={filters.testType} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, testType: value }))}
          >
            <SelectTrigger className="w-[200px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Filter by test type" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              {Array.from(new Set(patientData?.testReports.map(report => report.testType))).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => {
                const imageData = byteArrayToBase64(report.file);
                const isExpanded = expandedReports.has(index);
                return (
                  <Card key={index} className={`bg-[#131313a2] border-[#259b95] transition-all duration-300 ${isExpanded ? 'col-span-3' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-[#259b95] flex justify-between items-center">
                        <span>Test Report {index + 1}</span>
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
                            <Stethoscope className="text-[#259b95]" />
                            <span>Doctor: {report.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileSymlink className="text-[#259b95]" />
                            <span>Referred To: {report.referredTo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="text-[#259b95]" />
                            <span>Type: {report.testType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-[#259b95]" />
                            <span>Date: {new Date(Number(patientData.pdate) / 1000000).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <img 
                                  src={`data:image/png;base64,${imageData}`} 
                                  alt={`Test Report ${index + 1}`} 
                                  className="w-full h-auto object-cover rounded-lg mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedImage(`data:image/png;base64,${imageData}`)}
                                />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0 bg-transparent border-none">
                                <div className="relative">
                                  <img 
                                    src={selectedImage || ''} 
                                    alt="Full size test report" 
                                    className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                                  />
                                  <Button 
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
                                    onClick={() => setSelectedImage(null)}
                                  >
                                    <X className="h-6 w-6" />
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <p className="text-gray-300">Comments: {report.comments}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500">No test reports found matching the current filters.</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}