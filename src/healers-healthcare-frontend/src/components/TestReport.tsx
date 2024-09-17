'use client'

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Stethoscope, FileSymlink, FileText, Calendar, Package, UserCog, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

import { healers_healthcare_backend } from "../../../.././src/declarations/healers-healthcare-backend";

type TestReport = {
  doctor: string;
  referedto: string;
  testtype: string;
  comments: string;
  file: number[];
}

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  blood: string;
  height: number;
  weight: number;
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

  useEffect(() => {
    const fetchTestReports = async () => {
      if (!id) {
        setError('Patient ID is undefined')
        setIsLoading(false)
        return
      }
      try {
        const response = await healers_healthcare_backend.getPatientById(id)

        if (response && Array.isArray(response) && response.length > 0) {
          setPatientData(response[0] as unknown as Patient)
        } else {
          setError("Patient not found")
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setError("Failed to fetch patient data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestReports()
  }, [id])

  const byteArrayToBase64 = (byteArray: number[]) => {
    const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return btoa(binaryString);
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

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/health-records" className="hover:text-[#7047eb]">Health Records</Link>
          <span className="mx-2">/</span>
          <Link to={`/patient/${id}`} className="hover:text-[#7047eb]">Patient Details</Link>
          <span className="mx-2">/</span>
          <span className="text-[#7047eb]">Test Reports</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Test Reports</h1>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {patientData.testReports && patientData.testReports.length > 0 ? (
            patientData.testReports.map((history, index) => {
              const imageData = byteArrayToBase64(history.file);
              return (
                <Card key={index} className="mb-6 bg-[#131313a2] border-[#7047eb]">
                  <CardHeader>
                    <CardTitle className="text-[#7047eb]">Test Report {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="text-[#7047eb]" />
                        <span>Doctor: {history.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileSymlink className="text-[#7047eb]" />
                        <span>Referred To: {history.referedto}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="text-[#7047eb]" />
                        <span>Type: {history.testtype}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-[#7047eb]" />
                        <span>Date: {patientData.pdate.toString()}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img 
                          src={`data:image/png;base64,${imageData}`} 
                          alt={`Test Report ${index + 1}`} 
                          className="w-[60vh] h-[70vh] object-cover rounded-lg mb-4 cursor-pointer hover:opacity-80 transition-opacity"
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
                    <p className="text-gray-300">Comments: {history.comments}</p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-white">No test reports available.</div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
