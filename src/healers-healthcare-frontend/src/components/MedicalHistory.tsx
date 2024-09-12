'use client'

import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Pill, Stethoscope, Calendar, FileSymlink, FileText, Package, UserCog, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

// Dummy medical history data
const medicalHistoryData = [
  { id: 1, pharmacy: 'City Pharmacy', physician: 'Dr. Smith', event: 'Annual Checkup', prescription: 'Vitamins', remedies: 'Exercise', date: '2023-05-15' },
  { id: 2, pharmacy: 'Central Drugs', physician: 'Dr. Johnson', event: 'Flu Treatment', prescription: 'Antibiotics', remedies: 'Rest', date: '2023-07-22' },
  { id: 3, pharmacy: 'Health Plus', physician: 'Dr. Williams', event: 'Allergy Consultation', prescription: 'Antihistamines', remedies: 'Avoid Allergens', date: '2023-09-10' },
  { id: 4, pharmacy: 'MediCare', physician: 'Dr. Brown', event: 'Blood Pressure Check', prescription: 'BP Medication', remedies: 'Low-sodium Diet', date: '2023-11-05' },
  { id: 5, pharmacy: 'QuickCare', physician: 'Dr. Davis', event: 'Sprain Treatment', prescription: 'Pain Relievers', remedies: 'Ice and Rest', date: '2024-01-18' },
]

export default function MedicalHistory() {
  const { id } = useParams<{ id: string }>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
          <span className="text-[#7047eb]">Medical History</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Medical History</h1>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {medicalHistoryData.map((history, index) => (
            <Card key={history.id} className="mb-6 text-white bg-[#131313a2] border hover:border-[#7047eb] transition duration-100">
              <CardHeader>
                <CardTitle className="text-[#fff]">Medical Report {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Pill className="text-[#7047eb]" />
                    <span>Pharmacy: {history.pharmacy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="text-[#7047eb]" />
                    <span>Physician: {history.physician}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#7047eb]" />
                    <span>Event: {history.event}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileSymlink className="text-[#7047eb]" />
                    <span>Prescription: {history.prescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="text-[#7047eb]" />
                    <span>Remedies: {history.remedies}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#7047eb]" />
                    <span>Date: {history.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}