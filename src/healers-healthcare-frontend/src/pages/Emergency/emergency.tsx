'use client'

import * as React from 'react'
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api'
import { Bell, Brain, FileText, LayoutDashboard, Pill, Search, ShieldAlert, User, ChevronRight, MapPin, Ambulance, Phone, Calendar, Hospital, Clock, AlertCircle, TvMinimalPlayIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Sample data for hospitals and doctors
const doctorsData = [
  {
    id: 1,
    hospital: "City General Hospital",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    availability: "Available",
    timeSlots: ["09:00", "11:00", "14:00"],
    daysAvailable: "Mon, Wed, Fri"
  },
  {
    id: 2,
    hospital: "Metro Healthcare Center",
    name: "Dr. Michael Chen",
    specialty: "Emergency Medicine",
    availability: "Busy",
    timeSlots: ["15:00", "16:00"],
    daysAvailable: "Mon-Sat"
  },
  {
    id: 3,
    hospital: "City General Hospital",
    name: "Dr. Emily Williams",
    specialty: "General Physician",
    availability: "Available",
    timeSlots: ["10:00", "13:00", "16:00"],
    daysAvailable: "Tue, Thu"
  }
]

const hospitals = [
  { id: 1, name: "City General Hospital" },
  { id: 2, name: "Metro Healthcare Center" },
  { id: 3, name: "St. Mary's Medical Center" }
]

export default function Emergency() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showAmbulanceDialog, setShowAmbulanceDialog] = React.useState(false)
  const [showMapDialog, setShowMapDialog] = React.useState(false)
  const [selectedHospital, setSelectedHospital] = React.useState('')
  const [illness, setIllness] = React.useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('')
  const [userLocation, setUserLocation] = React.useState<{lat: number, lng: number} | null>(null)
  const [address, setAddress] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [filteredDoctors, setFilteredDoctors] = React.useState(doctorsData)

  // Google Maps integration
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          // In a real app, reverse geocode to get address
          setAddress("123 Auto-detected Street")
          toast.success("Location detected successfully!")
        },
        () => {
          toast.error("Unable to get location. Please enter manually.")
        }
      )
    }
  }

  // Handle ambulance booking
  const handleBookAmbulance = () => {
    if (!address || !phone) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Ambulance dispatched! ETA: 10 minutes")
    setShowAmbulanceDialog(false)
  }

  // Filter doctors based on selected criteria
  React.useEffect(() => {
    let filtered = doctorsData
    if (selectedHospital) {
      filtered = filtered.filter(doc => doc.hospital === selectedHospital)
    }
    if (selectedTimeSlot) {
      filtered = filtered.filter(doc => doc.timeSlots.includes(selectedTimeSlot))
    }
    setFilteredDoctors(filtered)
  }, [selectedHospital, selectedTimeSlot])

  // Handle appointment request
  const handleAppointmentRequest = (doctorId: number) => {
    if (!illness) {
      toast.error("Please describe your illness")
      return
    }
    toast.success("Appointment request sent successfully!")
  }

  // Handle availability request
  const handleAvailabilityRequest = () => {
    if (!selectedHospital || !illness) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Availability request submitted. We'll notify you when a doctor becomes available.")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold">HEALERS HEALTHCARE</h2>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', href: '/user-dashboard' },
            { icon: Pill, label: 'Medications', href: '/medications' },
            { icon: ShieldAlert, label: 'Emergency', href: '/emergency' },
            { icon: TvMinimalPlayIcon, label: 'Telly-Medicine', href: '/telemedicine' },
            { icon: FileText, label: 'MedDocs', href: '/med-docs' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                item.label === 'Emergency' && "bg-accent text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>User Profile</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <span>Complete your profile</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
              <nav className="space-y-2">
                {[
                  { label: 'Complete your profile', href: '#' },
                  { label: 'Emergency', href: '#' },
                  { label: 'Support', href: '#' },
                  { label: 'Settings', href: '#' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between py-2 text-sm hover:text-primary transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <h1 className="text-3xl font-bold mb-6">Emergency Services</h1>

        {/* Emergency Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Book Ambulance */}
          <Dialog open={showAmbulanceDialog} onOpenChange={setShowAmbulanceDialog}>
            <DialogTrigger asChild>
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Ambulance className="h-12 w-12 mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold mb-2">Book Ambulance</h3>
                  <p className="text-sm text-muted-foreground">
                    Request emergency medical transportation
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book an Ambulance</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Current Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your current address"
                    />
                    <Button
                      variant="outline"
                      onClick={getUserLocation}
                      className="shrink-0"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use GPS
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAmbulanceDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBookAmbulance} className="bg-red-500 hover:bg-red-600">
                  Book Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Search Nearest Hospital */}
          <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
            <DialogTrigger asChild>
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Hospital className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">Search Nearest Hospital</h3>
                  <p className="text-sm text-muted-foreground">
                    Find hospitals near your location
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Nearby Hospitals</DialogTitle>
              </DialogHeader>
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                {isLoaded ? (
                  <GoogleMap
                    zoom={14}
                    center={userLocation || { lat: 40.7128, lng: -74.0060 }}
                    mapContainerClassName="w-full h-full"
                  >
                    {userLocation && (
                      <MarkerF
                        position={userLocation}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent">
                    Loading map...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Get Instant Help */}
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Phone className="h-12 w-12 mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Get Instant Help</h3>
              <p className="text-sm text-muted-foreground">
                Call emergency helpline: 911
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Booking Section */}
        <Card>
          <CardHeader>
            <CardTitle>Book an Instant Appointment</CardTitle>
            <CardDescription>
              Find and book appointments with available doctors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="hospital">Select Hospital</Label>
                <Select
                  value={selectedHospital}
                  onValueChange={setSelectedHospital}
                >
                  <SelectTrigger id="hospital">
                    <SelectValue placeholder="Choose a hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.name}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="illness">Describe your illness</Label>
                <Textarea
                  id="illness"
                  value={illness}
                  onChange={(e) => setIllness(e.target.value)}
                  placeholder="Briefly describe your symptoms"
                />
              </div>
              <div>
                <Label htmlFor="time-slot">Choose Time Slot</Label>
                <Select
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                >
                  <SelectTrigger id="time-slot">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Doctors Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Time Slots</TableHead>
                  <TableHead>Days Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.hospital}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          doctor.availability === "Available" 
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {doctor.availability}
                        </span>
                      </TableCell>
                      <TableCell>{doctor.timeSlots.join(", ")}</TableCell>
                      <TableCell>{doctor.daysAvailable}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAppointmentRequest(doctor.id)}
                        >
                          Request Appointment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No doctors available for selected criteria</p>
                        <Button
                          variant="outline"
                          onClick={handleAvailabilityRequest}
                          className="mt-2"
                        >
                          Request Availability
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

