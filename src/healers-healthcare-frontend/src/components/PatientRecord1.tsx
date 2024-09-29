'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { User, MapPin, Droplet, Ruler, Weight, FileText, Calendar, Send, Menu, BackpackIcon, Cake } from 'lucide-react'
import Lottie from 'lottie-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MouseParallax } from "react-just-parallax"
// import { gradient } from '../assets'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { motion } from 'framer-motion'
import { BorderBeam } from './magicui/border-beam'
import Ripple from './magicui/ripple'
import animationData from '../components/lotties/medical4.json'
import animationData2 from '../components/lotties/medical3.json'
//import { AiFillHeart } from 'react-icons/ai'

import { healers_healthcare_backend } from "../../../.././src/declarations/healers-healthcare-backend";
//import { Actor, HttpAgent } from '@dfinity/agent';



// Dummy data for charts
const healthData = [
  { name: 'Jan', weight: 70, bloodPressure: 120 },
  { name: 'Feb', weight: 72, bloodPressure: 118 },
  { name: 'Mar', weight: 71, bloodPressure: 122 },
  { name: 'Apr', weight: 73, bloodPressure: 121 },
  { name: 'May', weight: 72, bloodPressure: 119 },
  { name: 'Jun', weight: 74, bloodPressure: 120 },
]

const recoveryData = [
  { name: 'Week 1', progress: 20 },
  { name: 'Week 2', progress: 40 },
  { name: 'Week 3', progress: 60 },
  { name: 'Week 4', progress: 80 },
  { name: 'Week 5', progress: 90 },
  { name: 'Week 6', progress: 95 },
]

interface PatientInfoProps {
  patientId: string; // Define the type of patientId
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: animationData2,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
interface MedicalHistory  {
  pharmacy: string;
  physician: string;
  event: string;
  prescription: string;
  remedies: string;
};

interface TestReport  {
  doctor: string;
  referedto: string;
  testtype: string;
  comments: string;
  file: number[] | Uint8Array
};

interface Patient {
  id: string;
  name: string;
  age: bigint;
  gender: string;
  location: string;
  blood: string;
  height: bigint;
  weight: bigint;
  medicalHistories: MedicalHistory[];
  testReports: TestReport[];
  pdate: bigint;
}
type Appointment = {
 
  patientName : string;
  patientAge : string;
  gender : string;
  contact : bigint;
  email : string;
  doctor : string;
  date : string;
  appTime : string;
  consultation : string;
  existingConditions: [string];
  currentMedications : string;
  allergies : string;
  nOfVisits : bigint;
  insuranceProvider : string;
  emergencyContactName : string;
  emergencyContactPhone : bigint; 
}


/*interface  Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood: string;
  height: number;
  weight: number;
  location: string;
  medicalHistories: []; // Adjust type as necessary
  testReports: []; // Adjust type as necessary
  pdate: number; // You can use `Date` if you want to format it later
}
*/

// Dummy patient data


// Dummy AI responses
const aiResponses = [
  "The patient's blood pressure has been stable over the last 6 months.",
  "Based on the recent test results, the patient's cholesterol levels have improved.",
  "I recommend scheduling a follow-up appointment in 3 months to monitor progress.",
  "The patient's BMI is within the normal range, but regular exercise is advised.",
  "No significant drug interactions were found with the current medication regimen.",
]

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true)
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [aiConversation, setAiConversation] = useState<string[]>(['AI: Hello! How can I assist you today?'])
  const chatRef = useRef<HTMLDivElement>(null)
  

  const [editedData, setEditedData] = useState<Patient | null>(null);
  const [editedData2, setEditedData2] = useState<Appointment | null>(null);
  



  const [patientData, setPatientData] = useState<Patient | null>(null);
    const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);



    const fetchPatientData = useCallback(async () => {
      if (!id) {
        console.error('No patient ID provided')
        setIsLoading(false)
        return
      }
    
      try {
        setIsLoading(true)
        console.log("Fetching patient with ID:", id)
        const patientResult = await healers_healthcare_backend.getPatientById(id)
        console.log("Fetched patient data:", patientResult)
        
        if (patientResult) {
          const patient = patientResult[0];
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
              testReports: patient.testReports,
              pdate: BigInt(patient.pdate)
            };
            setPatientData(formattedPatient)
            setEditedData(formattedPatient)
          } else {
            console.error('No patient found with the given ID')
            setPatientData(null)
            setEditedData(null)
          }
        } else {
          console.error('Invalid response from getPatientById')
          setPatientData(null)
          setEditedData(null)
        }
    
        const appointments = await healers_healthcare_backend.listAppointments();
        console.log("Fetched appointment data:", appointments);
    
        if (Array.isArray(appointments)) {
          setAppointmentsData(appointments as Appointment[]);
        } 
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setPatientData(null)
        setEditedData(null)
      } finally {
        setIsLoading(false)
      }
    }, [id])
  
    useEffect(() => {
      fetchPatientData()
    }, [fetchPatientData])
  
    useEffect(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
      }
    }, [aiConversation])
  
    const handleSave = useCallback(async () => {
      if (!editedData) return;
    
      try {
        const updatedPatient = await healers_healthcare_backend.updatePatient(
          editedData.id,
          [editedData.name],
          [editedData.age],
          [editedData.gender],
          [editedData.location],
          [editedData.blood],
          [editedData.height],
          [editedData.weight],
          [editedData.medicalHistories],
          [editedData.testReports]
        );
    
        if (updatedPatient && updatedPatient.length > 0) {
          const patient = updatedPatient[0];
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
              testReports: patient.testReports,
              pdate: BigInt(patient.pdate)
            };
            setPatientData(formattedPatient);
            setEditedData(formattedPatient);
            toast.success('Patient details updated successfully');
          } else {
            toast.error('Failed to update patient details');
          }
        } else {
          toast.error('Failed to update patient details');
        }
      } catch (error) {
        console.error('Error updating patient:', error);
        toast.error('An error occurred while updating patient details');
      }
    }, [editedData]);
  
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditedData((prev: Patient | null) => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: name === 'age' || name === 'height' || name === 'weight' ? BigInt(value) : value,
        };
      });
    }, []);
  
    const handleAiQuery = useCallback((e: React.FormEvent) => {
      e.preventDefault()
      setAiConversation(prev => [...prev, `You: ${aiQuery}`])
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      setTimeout(() => {
        setAiConversation(prev => [...prev, `AI: ${randomResponse}`])
      }, 1000)
      setAiQuery('')
    }, [aiQuery])


    const handleMedicalHistoryChange = (index: number, field: keyof MedicalHistory, value: string) => {
      setEditedData(prev => {
        if (!prev) return null;
        const updatedHistories = [...prev.medicalHistories];
        updatedHistories[index] = { ...updatedHistories[index], [field]: value };
        return { ...prev, medicalHistories: updatedHistories };
      });
    };
    
    const handleTestReportChange = (index: number, field: keyof TestReport, value: any) => {
      setEditedData(prev => {
        if (!prev) return null;
        const updatedReports = [...prev.testReports];
        updatedReports[index] = { ...updatedReports[index], [field]: value };
        return { ...prev, testReports: updatedReports };
      });
    };



    const addMedicalHistory = () => {
      setEditedData(prev => {
        if (!prev) return null;
    
        return {
          ...prev,
          medicalHistories: [
            ...prev.medicalHistories,
            {
              pharmacy: '',
              physician: '',
              event: '',
              prescription: '',
              remedies: ''
            }
          ],
          id: prev.id || '', // Ensure id is not undefined
        };
      });
    };
    
    const removeMedicalHistory = (index: number) => {
      setEditedData(prev => {
        if (!prev) return null;
    
        return {
          ...prev,
          medicalHistories: prev.medicalHistories.filter((_, i) => i !== index),
          id: prev.id || '', // Ensure id is not undefined
        };
      });
    };
    
    const addTestReport = () => {
      setEditedData(prev => {
        if (!prev) return null;
    
        return {
          ...prev,
          testReports: [
            ...prev.testReports,
            {
              doctor: '',
              referedto: '',
              testtype: '',
              comments: '',
              file: []
            }
          ],
          id: prev.id || '', // Ensure id is not undefined
        };
      });
    };
    
    const removeTestReport = (index: number) => {
      setEditedData(prev => {
        if (!prev) return null;
    
        return {
          ...prev,
          testReports: prev.testReports.filter((_, i) => i !== index),
          id: prev.id || '', // Ensure id is not undefined
        };
      });
    };
    

    



  const SidebarContent = () => (
    <>
      {/* <h2 className="text-xl md:text-2xl font-bold text-[#7047eb] mb-8">Healers Healthcare</h2> */}
      <img src={'/HealersHealthcareOfficialLogo.png'} alt="Healers Healthcare" className="w-40 mx-auto" />
      <nav className="space-y-2">
        {[
          { name: 'Health Records', icon: FileText },
          { name: 'Doctor Dashboard', icon: User },
          { name: 'Appointments', icon: Calendar },
          { name: 'Inventory', icon: Weight },
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
    return (

      
      <div className="flex flex-col gap-5 md:flex-row min-h-screen bg-black text-white p-8 dark:animate-pulse">
        <div className="w-full md:w-64 bg-gray-800 h-screen rounded-lg" />
        <div className="flex-1 space-y-8 rounded-lg">
          <div className="h-32 bg-gray-800 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-800 rounded-lg" />
            <div className="h-64 bg-gray-800 rounded-lg" />
          </div>
          <div className="h-96 bg-gray-800 rounded-lg" />
        </div>
      </div>
    )
  }
  if (!editedData) {
    return <div className="text-white">No patient data found</div>
}
const firstAppointment = appointmentsData[0] || {};
  return (
    
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
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

      <div className="hidden md:block w-64 bg-black p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="relative flex-1 min-h-screen bg-black text-white p-8 sm:p-10">
        
        <Toaster />
        
        <div className="mb-6 flex items-center text-sm text-gray-500">
          
          <a href="/health-records" className="hover:text-[#7047eb]">Health Records</a>
          <span className="mx-2">/</span>
          <span className="text-[#7047eb]">Patient Details</span>
        </div>

            <p className="text-gray-400 text-center sm:text-right text-xl mb-4">Patient ID: {editedData.id}</p>
        <div className='relative bg-[#131313a2]  mb-12 flex-col items-center justify-center overflow-hidden rounded-lg border border-black md:shadow-xl'>

          <Card className="bg-[#131313a2]">
          <div className="flex  flex-col mx-auto sm:mx-0 items-center my-0 lg:my-8 p-10 md:p-15 ">
            <div className='container flex flex-wrap px-0 md:justify-between'>

            
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-5 lg:gap-0 py-5'>

            <img src={`/defaultProfilePhoto.jpg`} alt="Patient" className="sm:col-span-4 w-[30vh] sm:w-[40vh] h-[30vh] sm:h-[40vh] rounded-lg hover:scale-95 transition duration-100 mx-auto lg:mx-0 sm:my-auto" />

            <div className='flex flex-col justify-between w-full sm:col-span-8'>
            <h1 className="text-5xl font-bold mb-8 text-white">Name: {editedData.name}</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-top gap-2 items-center">
                  <User className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Gender:</h4> <p className='text-white/55'>{editedData.gender}</p></span>
                </div>
                <div className="flex items-top gap-2 items-center">
                  <Cake className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Age:</h4> <p className='text-white/55'>{editedData.age.toString()}</p></span>
                </div>
                
                <div className="flex items-top gap-2 items-center">
                  <MapPin className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Location:</h4> <p className='text-white/55'>{editedData.location}</p></span>
                </div>
                <div className="flex items-top gap-2 items-center">
                  <Droplet className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Blood Group:</h4> <p className='text-white/55'>{editedData.blood}</p></span>
                </div>
                <div className="flex items-top gap-2 items-center">
                  <Ruler className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Height:</h4> <p className='text-white/55'>{editedData.height.toString()}</p></span>
                </div>
                <div className="flex items-top gap-2 items-center">
                  <Weight className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Weight:</h4> <p className='text-white/55'>{editedData.weight.toString()} kg</p></span>
                </div>
                {/*
                <div className="flex items-top gap-2 items-center">
                  <BackpackIcon className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Occupation:</h4> <p className='text-white/55'>{firstAppointment?.occupation || 'N/A'}</p></span>
                </div>
                */}
                
                <div className="flex items-top gap-2 items-center">
                  <User className="h-8 w-8 text-[#7047eb]" />
                  <span className='flex items-center gap-2'><h4 className='text-white'>Contact:</h4><p className='text-white/55'>{firstAppointment?.contact ? String(firstAppointment.contact) : 'N/A'}</p></span>
                </div>
                
              </div> 
              <div className="flex flex-wrap gap-2 ">
            <Badge variant="outline" className="bg-[#fff] text-black">Heart Rate: Normal</Badge>
            <Badge variant="outline" className="bg-[#fff] text-black">Blood Pressure: Controlled</Badge>
            <Badge variant="outline" className="bg-[#fff] text-black">Cholesterol: In Range</Badge>
            <Badge variant="outline" className="bg-[#fff] text-black">BMI: Healthy</Badge>
            {/* add more */}
            <Badge variant="outline" className="bg-[#fff] text-black">Blood Sugar: Normal</Badge>
            <Badge variant="outline" className="bg-[#fff] text-black">Oxygen Level: Normal</Badge>
            <Badge variant="outline" className="bg-[#fff] text-black">Vaccination: Completed</Badge>
            
          </div>
            </div>
            </div>
          </div>
          </Card>
          <BorderBeam size={250} duration={12} delay={9} />

        </div>

        <div className='relative'>
        {/* <MouseParallax ref={parallaxRef} className="absolute z-10">
            <div className="hidden sm:block inset-0 left-90 w-[56.625rem] opacity-10 mix-blend-color-dodge pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
              </div>
            </div>
          </MouseParallax> */}


        <div className=" flex justify-between items-center mb-8 sm:mb-15">
        
          <h2 className="text-4xl font-bold">Patient Records</h2>
          <Drawer>
  <DrawerTrigger asChild>
    <Button className="border bg-[#7047eb] hover:bg-[#000] hover:border-[#7047eb] text-white">Edit Patient Details</Button>
  </DrawerTrigger>
  <DrawerContent className="bg-black text-white">
    <DrawerHeader>
      <DrawerTitle>Edit Patient Details</DrawerTitle>
      <DrawerDescription>Make changes to patient information here.</DrawerDescription>
    </DrawerHeader>
    <ScrollArea className="h-[calc(100vh-10rem)] px-4">
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {editedData && Object.entries(editedData).map(([key, value]) => (
        key !== 'medicalHistories' && key !== 'testReports' && (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
            <Input
  id={key}
  name={key}
  value={typeof value === 'bigint' ? value.toString() : value}
  onChange={handleInputChange}
  type={key === 'age' || key === 'height' || key === 'weight' ? 'number' : 'text'}
  className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
/>
          </div>
        )
      ))}
    </div>

    {/* Medical History Section */}
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Medical History</h3>
      {editedData.medicalHistories.map((history, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-700 rounded-lg">
          <h4 className="text-lg font-medium mb-2">Medical History {index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`pharmacy${index}`}>Pharmacy</Label>
              <Input
                id={`pharmacy${index}`}
                name={`pharmacy${index}`}
                value={history.pharmacy}
                onChange={(e) => handleMedicalHistoryChange(index, 'pharmacy', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`physician${index}`}>Physician</Label>
              <Input
                id={`physician${index}`}
                name={`physician${index}`}
                value={history.physician}
                onChange={(e) => handleMedicalHistoryChange(index, 'physician', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`event${index}`}>Event</Label>
              <Input
                id={`event${index}`}
                name={`event${index}`}
                value={history.event}
                onChange={(e) => handleMedicalHistoryChange(index, 'event', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`prescription${index}`}>Prescription</Label>
              <Input
                id={`prescription${index}`}
                name={`prescription${index}`}
                value={history.prescription}
                onChange={(e) => handleMedicalHistoryChange(index, 'prescription', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`remedies${index}`}>Remedies</Label>
              <Input
                id={`remedies${index}`}
                name={`remedies${index}`}
                value={history.remedies}
                onChange={(e) => handleMedicalHistoryChange(index, 'remedies', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
          </div>
          {index > 0 && (
            <Button
              type="button"
              onClick={() => removeMedicalHistory(index)}
              className="mt-4 bg-black text-white border hover:border-red-500 hover:bg-transparent"
            >
              Remove Medical History
            </Button>
          )}
        </div>
      ))}
      {editedData.medicalHistories.length < 5 && (
        <Button
          type="button"
          onClick={addMedicalHistory}
          className="mt-4 bg-black text-white border hover:border-green-500 hover:bg-transparent"
        >
          Add Medical History
        </Button>
      )}
    </div>

    {/* Test Report Section */}
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Test Reports</h3>
      {editedData.testReports.map((report, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-700 rounded-lg">
          <h4 className="text-lg font-medium mb-2">Test Report {index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`doctor${index}`}>Doctor</Label>
              <Input
                id={`doctor${index}`}
                name={`doctor${index}`}
                value={report.doctor}
                onChange={(e) => handleTestReportChange(index, 'doctor', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`referedto${index}`}>Referred to</Label>
              <Input
                id={`referedto${index}`}
                name={`referedto${index}`}
                value={report.referedto}
                onChange={(e) => handleTestReportChange(index, 'referedto', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`testtype${index}`}>Test Type</Label>
              <Input
                id={`testtype${index}`}
                name={`testtype${index}`}
                value={report.testtype}
                onChange={(e) => handleTestReportChange(index, 'testtype', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`comments${index}`}>Comments</Label>
              <Input
                id={`comments${index}`}
                name={`comments${index}`}
                value={report.comments}
                onChange={(e) => handleTestReportChange(index, 'comments', e.target.value)}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`file${index}`}>File</Label>
              <Input
                id={`file${index}`}
                name={`file${index}`}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        const arrayBuffer = event.target.result as ArrayBuffer;
                        const uint8Array = new Uint8Array(arrayBuffer);
                        handleTestReportChange(index, 'file', Array.from(uint8Array));
                      }
                    };
                    reader.readAsArrayBuffer(file);
                  }
                }}
                className="bg-black border hover:bg-transparent hover:border-[#7047eb] transition duration-200 text-white"
              />
            </div>
          </div>
          {index > 0 && (
            <Button
              type="button"
              onClick={() => removeTestReport(index)}
              className="mt-4 bg-black text-white border hover:border-red-500 hover:bg-transparent"
            >
              Remove Test Report
            </Button>
          )}
        </div>
      ))}
      {editedData.testReports.length < 5 && (
        <Button
          type="button"
          onClick={addTestReport}
          className="mt-4 bg-black text-white border hover:border-green-500 hover:bg-transparent"
        >
          Add Test Report
        </Button>
      )}
    </div>

    <div className="p-4">
      <div className='w-full flex justify-center items-center'>
        <Button onClick={handleSave} className="w-[30vh] border bg-[#7047eb] hover:bg-[#000] hover:border-[#7047eb] hover:text-white ">Save Changes</Button>
      </div>
    </div>
    </ScrollArea>
  </DrawerContent>
</Drawer>
        </div>
        </div>



         {/* Medical History card */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 sm:my-32">
          <Link to={`/patient/${id}/medical-history`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full h-[45vh] bg-[#131313a2] border border-[#7047eb] rounded-lg flex items-center justify-center cursor-pointer p-20"
            >
                <Lottie
                animationData={defaultOptions.animationData}
        height={150}
        width={150}
      />
              <div className="text-center">
                {/* <FileText className="text-[#7047eb] w-16 h-16 mb-4 mx-auto" /> */}
                <span className="text-2xl font-semibold">Medical History</span>
              </div>
            </motion.div>
          </Link>

          {/* Test Report Card */}
          <Link to={`/patient/${id}/test-report`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full h-[45vh] bg-[#131313a2] border border-[#7047eb] rounded-lg flex items-center justify-center cursor-pointer p-20"
            >
                <Lottie
                animationData={defaultOptions2.animationData}
        height={50}
        width={50}
      />
              <div className="text-center">
                {/* <FileText className="text-[#7047eb] w-16 h-16 mb-4 mx-auto" /> */}
                <span className="text-2xl font-semibold">Test Reports</span>
              </div>
            </motion.div>
          </Link>
        </div>


        {/* Ai ChatBox Part */}
        <h2 className="text-4xl font-bold mb-8">Ask The AI</h2>
        <div className='grid  grid-cols-1 md:grid-cols-2 justify-between w-full gap-5 '>

          <div className="relative bg-[#131313a2] flex w-auto md:w-[70vh] mb-12 flex-col items-center justify-center overflow-hidden rounded-lg border border-black md:shadow-xl">
          <Card className="bg-[#131313a2] w-full h-full p-1 ">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] mb-4 z-3" ref={chatRef}>
              {aiConversation.map((message, index) => (
                <div key={index} className={`mb-2 ${message.startsWith('You:')
                  ? 'text-right ml-2 text-wrap'
                  : 'text-left mr-2 text-wrap'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.startsWith('You:')
                    ? 'bg-[#7047eb] text-white'
                    : 'bg-gray-700 text-white'}`}>
                    {message}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleAiQuery} className="relative z-3">
              <Input
                type="text"
                placeholder="Ask anything about this patient..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="w-full pr-12 bg-[#131313a2] border-[#7047eb] text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                className="absolute right-0.25 top-1/2 transform -translate-y-1/2 bg-[#7047eb] hover:bg-[#5f3cc4]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
            
          </Card>
     
      <BorderBeam size={250} duration={12} delay={9} />
      <Ripple className='z-1' />
    </div>

    <div className="relative flex w-auto md:w-[70vh] mb-12 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
          
      <BorderBeam size={250} duration={12} delay={9} />
      <Ripple className='z-1' />
    </div>


        
        
        
        </div>

        
       


        {/* Parallax Section */}
        {/* <MouseParallax ref={parallaxRef} className="relative z-10">
          <div className="hidden sm:block inset-0 left-90 w-[56.625rem] opacity-10 mix-blend-color-dodge pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
              <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
            </div>
          </div>
        </MouseParallax> */}

        



        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-8">Patient Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#131313a2]  text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#7047eb" />
                    <YAxis yAxisId="right" orientation="right" stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="weight" fill="#7047eb" />
                    <Bar yAxisId="right" dataKey="bloodPressure" fill="#ffffff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-[#131313a2] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Recovery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={recoveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#7047eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
