'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, ChevronLeft, ChevronRight, Upload, User, Briefcase, Stethoscope } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const stages = [
  { title: 'Introduction', subtitle: 'Tell us about yourself', icon: User },
  { title: 'General Information', subtitle: 'Your basic details', icon: Briefcase },
  { title: 'Medical Information', subtitle: 'Your health profile', icon: Stethoscope }
]

export function ProfileCompletionForm({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = React.useState(0)
  const [profileData, setProfileData] = React.useState({
    firstName: '',
    lastName: '',
    profilePic: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    alternativeEmail: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    height: '',
    weight: '',
    bloodType: '',
    documents: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({ ...profileData, [name]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePic: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileData({
        ...profileData,
        documents: [...profileData.documents, ...Array.from(e.target.files)],
      })
    }
  }

  const handleNext = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1)
    }
  }

  const handlePrevious = () => {
    if (stage > 0) {
      setStage(stage - 1)
    }
  }

  const handleSubmit = () => {
    // Here you would typically send the profileData to your backend
    console.log(profileData)
    toast.success("Profile updated successfully!")
    onClose()
  }

  const calculateProgress = () => {
    const totalFields = Object.keys(profileData).length
    const filledFields = Object.values(profileData).filter(value => value !== '').length
    return (filledFields / totalFields) * 100
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Welcome to Healers Healthcare</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-8">
          {stages.map((s, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`rounded-full p-2 ${index === stage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <span className="text-sm mt-2">{s.title}</span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">{stages[stage].subtitle}</h3>
            {stage === 0 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileData.profilePic} />
                      <AvatarFallback>{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
                      <Upload className="h-4 w-4" />
                    </Label>
                    <Input id="profile-pic" type="file" className="hidden" onChange={handleFileUpload} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}
            {stage === 1 && (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" value={profileData.dateOfBirth} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" value={profileData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={profileData.address} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={profileData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={profileData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" name="zipCode" value={profileData.zipCode} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternativeEmail">Alternative Email (Optional)</Label>
                    <Input id="alternativeEmail" name="alternativeEmail" type="email" value={profileData.alternativeEmail} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" name="occupation" value={profileData.occupation} onChange={handleInputChange} />
                  </div>
                </div>
              </ScrollArea>
            )}
            {stage === 2 && (
              <ScrollArea className="h-[400px] pr-4">
                <Tabs defaultValue="medical-info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
                    <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                    <TabsTrigger value="medical-metrics">Medical Metrics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="medical-info" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input id="emergencyContact" name="emergencyContact" value={profileData.emergencyContact} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input id="emergencyPhone" name="emergencyPhone" type="tel" value={profileData.emergencyPhone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea id="allergies" name="allergies" value={profileData.allergies} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">Current Medications</Label>
                      <Textarea id="currentMedications" name="currentMedications" value={profileData.currentMedications} onChange={handleInputChange} />
                    </div>
                  </TabsContent>
                  <TabsContent value="medical-history" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea id="medicalHistory" name="medicalHistory" value={profileData.medicalHistory} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documents">Upload Medical Documents</Label>
                      <Input id="documents" type="file" multiple onChange={handleDocumentUpload} />
                    </div>
                    {profileData.documents.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Uploaded Documents:</h4>
                        <ul className="list-disc pl-5">
                          {profileData.documents.map((doc: File, index: number) => (
                            <li key={index}>{doc.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="medical-metrics" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input id="height" name="height" type="number" value={profileData.height} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" name="weight" type="number" value={profileData.weight} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select name="bloodType" value={profileData.bloodType} onValueChange={(value) => handleSelectChange('bloodType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center mt-8">
          <Button onClick={handlePrevious} disabled={stage === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Step {stage + 1} of {stages.length}</div>
            <Progress value={calculateProgress()} className="w-[200px]" />
          </div>
          {stage === stages.length - 1 ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
