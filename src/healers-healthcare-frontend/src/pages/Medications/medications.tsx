'use client'

import * as React from 'react'
import { Bell, Brain, FileText, LayoutDashboard, Pill, Plus, Search, ShieldAlert, User, ChevronRight, Upload, AlertCircle, ShoppingCart, TvMinimalPlayIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Sample data for schedules
const scheduleData = [
  {
    id: "SCH001",
    date: "2024-01-15",
    time: "08:00",
    medicine: "Paracetamol 500mg",
    doses: "1 tablet",
    status: "TAKEN",
    comment: "Take with warm water"
  },
  {
    id: "SCH002",
    date: "2024-01-15",
    time: "14:00",
    medicine: "Vitamin D3",
    doses: "1 capsule",
    status: "PENDING",
    comment: "Take after lunch"
  },
  {
    id: "SCH003",
    date: "2024-01-15",
    time: "20:00",
    medicine: "Omeprazole",
    doses: "1 tablet",
    status: "UPCOMING",
    comment: "Take before dinner"
  },
]

// Sample data for alerts
const alertsData = [
  {
    id: "ALT001",
    medicine: "Paracetamol",
    message: "Stock running low - Only 5 tablets left",
    daysLeft: 2,
    type: "STOCK",
    severity: "HIGH",
    action: "BUY"
  },
  {
    id: "ALT002",
    medicine: "Vitamin C",
    message: "Order #ORD123 will be delivered tomorrow",
    daysLeft: 1,
    type: "ORDER",
    severity: "LOW",
    action: "VIEW"
  },
  {
    id: "ALT003",
    medicine: "Blood Pressure Medicine",
    message: "Prescription expires in 5 days",
    daysLeft: 5,
    type: "PRESCRIPTION",
    severity: "MEDIUM",
    action: "RENEW"
  },
]

// Sample data for marketplace
const marketplaceData = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    manufacturer: "HealthCare Pharma",
    price: 9.99,
    quantity: "Strip of 15 tablets",
    prescription: false
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    manufacturer: "MediCure Labs",
    price: 24.99,
    quantity: "Strip of 10 capsules",
    prescription: true
  },
  {
    id: "MED003",
    name: "Vitamin D3 1000IU",
    manufacturer: "Wellness Pharmaceuticals",
    price: 15.99,
    quantity: "Bottle of 60 capsules",
    prescription: false
  },
]

export default function Medications() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [newSchedule, setNewSchedule] = React.useState({
    date: '',
    time: '',
    medicine: '',
    doses: '',
    comment: ''
  })
  const [showAddDialog, setShowAddDialog] = React.useState(false)

  // Handle new schedule submission
  const handleAddSchedule = () => {
    // Add schedule logic here
    setShowAddDialog(false)
    setNewSchedule({
      date: '',
      time: '',
      medicine: '',
      doses: '',
      comment: ''
    })
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      case 'LOW':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TAKEN':
        return 'text-green-500'
      case 'PENDING':
        return 'text-yellow-500'
      case 'UPCOMING':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
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
                item.label === 'Medications' && "bg-accent text-primary"
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
              placeholder="Search medications..."
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

        <h1 className="text-3xl font-bold mb-6">Medications</h1>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="marketplace">Market Place</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Medication Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Medicine & Doses</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Additional Comment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleData.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>{schedule.id}</TableCell>
                          <TableCell>{schedule.date}</TableCell>
                          <TableCell>{schedule.time}</TableCell>
                          <TableCell>
                            {schedule.medicine}
                            <br />
                            <span className="text-sm text-muted-foreground">{schedule.doses}</span>
                          </TableCell>
                          <TableCell>
                            <span className={cn("font-medium", getStatusColor(schedule.status))}>
                              {schedule.status}
                            </span>
                          </TableCell>
                          <TableCell>{schedule.comment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Add Schedule Button */}
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="absolute bottom-4 right-4 rounded-full h-12 w-12"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Schedule</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newSchedule.date}
                            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newSchedule.time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="medicine">Medicine</Label>
                          <Input
                            id="medicine"
                            value={newSchedule.medicine}
                            onChange={(e) => setNewSchedule({ ...newSchedule, medicine: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doses">Doses</Label>
                          <Input
                            id="doses"
                            value={newSchedule.doses}
                            onChange={(e) => setNewSchedule({ ...newSchedule, doses: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="comment">Additional Comment</Label>
                          <Textarea
                            id="comment"
                            value={newSchedule.comment}
                            onChange={(e) => setNewSchedule({ ...newSchedule, comment: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddSchedule}>Add Schedule</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Medication Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        getSeverityColor(alert.severity),
                "bg-opacity-10 border border-white border-opacity-20"
              )}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{alert.medicine}</h4>
                        <p className="text-white text-sm mb-2">{alert.message}</p>
                        <div className="text-white text-sm opacity-75">
                          {alert.daysLeft} days remaining
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                        >
                          {alert.action === 'BUY' && <ShoppingCart className="h-4 w-4 mr-2" />}
                          {alert.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle>Medication Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Card className="bg-primary/5 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-8 w-8 mb-4 text-primary" />
                      <h3 className="text-lg font-semibold mb-2">Upload Prescription</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Upload your prescription to automatically find medicines
                      </p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Prescription
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {marketplaceData.map((medicine) => (
                    <Card key={medicine.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold mb-1">{medicine.name}</h3>
                            <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                          </div>
                          {medicine.prescription && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                              Prescription Required
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold">${medicine.price}</span>
                          <span className="text-sm text-muted-foreground">{medicine.quantity}</span>
                        </div>
                        <Button className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
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

