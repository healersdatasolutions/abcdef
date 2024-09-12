'use client'

import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Stethoscope, FileSymlink, FileText, Calendar, Package, UserCog, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

// Dummy test report data
const testReportData = [
  { id: 1, doctor: 'Dr. Brown', referredTo: 'Lab A', type: 'Blood Test', date: '2024-01-15', testImage: '/sampleMedicalReport1.jpg', comments: 'Normal blood count' },
  { id: 2, doctor: 'Dr. Davis', referredTo: 'Lab B', type: 'X-Ray', date: '2024-02-20', testImage: '/sampleMedicalReport2.jpg', comments: 'No abnormalities detected' },
  { id: 3, doctor: 'Dr. Wilson', referredTo: 'Lab C', type: 'MRI', date: '2024-03-05', testImage: '/sampleMedicalReport3.jpg', comments: 'Further investigation required' },
  { id: 4, doctor: 'Dr. Taylor', referredTo: 'Lab A', type: 'ECG', date: '2024-04-10', testImage: '/sampleMedicalReport4.jpg', comments: 'Normal heart rhythm' },
  { id: 5, doctor: 'Dr. Anderson', referredTo: 'Lab D', type: 'Ultrasound', date: '2024-05-25', testImage: '/sampleMedicalReport5.jpg', comments: 'No significant findings' },
]

export default function TestReport() {
  const { id } = useParams<{ id: string }>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
          {testReportData.map((report, index) => (
            <Card key={report.id} className="mb-6 bg-[#131313a2] border-[#7047eb]">
              <CardHeader>
                <CardTitle className="text-[#7047eb]">Test Report {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="text-[#7047eb]" />
                    <span>Doctor: {report.doctor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileSymlink className="text-[#7047eb]" />
                    <span>Referred To: {report.referredTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#7047eb]" />
                    <span>Type: {report.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#7047eb]" />
                    <span>Date: {report.date}</span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <img 
                      src={report.testImage} 
                      alt={`Test Report ${index + 1}`} 
                      className="w-[60vh] h-[70vh] object-cover rounded-lg mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(report.testImage)}
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
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}