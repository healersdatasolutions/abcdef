'use client'

import React, { useState, useEffect } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, ChevronLeft, ChevronRight, Search, Menu, Users, Activity, DollarSign, TrendingUp, Bell, Settings, LogOut, PieChart, Zap, Thermometer, Stethoscope, Pill, Clipboard, Heart, Brain, Eye, Bone, ShieldCheck, Clock, Droplet, Scale, Baby } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'

export default function GeneralUserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [dietPlan, setDietPlan] = useState('')

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100
    const weightInKg = parseFloat(weight)
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters)
      setBmi(parseFloat(bmiValue.toFixed(2)))
    }
  }

  const handleAiConsultation = () => {
    // Simulated AI response
    const responses = [
      "Based on your symptoms, it's recommended to stay hydrated and rest. If symptoms persist, please consult a doctor.",
      "Your described condition doesn't seem severe, but monitor it closely. If it worsens, seek medical attention.",
      "The symptoms you've mentioned could be related to stress. Try relaxation techniques and ensure you're getting enough sleep.",
      "It's advisable to schedule a check-up with your primary care physician to discuss these symptoms in detail."
    ]
    setAiResponse(responses[Math.floor(Math.random() * responses.length)])
  }

  const generateDietPlan = () => {
    // Simulated diet plan generation
    const plans = [
      "Breakfast: Oatmeal with berries\nLunch: Grilled chicken salad\nDinner: Baked salmon with vegetables",
      "Breakfast: Greek yogurt with nuts\nLunch: Quinoa bowl with avocado\nDinner: Lean beef stir-fry",
      "Breakfast: Whole grain toast with peanut butter\nLunch: Lentil soup\nDinner: Grilled tofu with brown rice",
      "Breakfast: Smoothie bowl\nLunch: Turkey and vegetable wrap\nDinner: Baked chicken with sweet potato"
    ]
    setDietPlan(plans[Math.floor(Math.random() * plans.length)])
  }

  const bmiData = [
    { name: 'Your BMI', value: bmi || 0 },
    { name: 'Ideal BMI', value: 22 },
  ]

  const COLORS = ['#0088FE', '#00C49F']

  const SidebarContent = () => (
    <>
      <img src="/HealersHealthcareOfficialLogo.png" alt="Healers Healthcare" className="w-40 mx-auto mb-8" />
      <nav className="space-y-2">
        {[
          { name: 'Dashboard', icon: TrendingUp },
          { name: 'Health Records', icon: FileText },
          { name: 'Appointments', icon: Calendar },
          { name: 'Medications', icon: Pill },
          { name: 'Settings', icon: Settings },
        ].map((item) => (
          <Link 
            key={item.name}
            to={`/${item.name.toLowerCase().replace(' ', '-')}`}
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
    <div className="flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto bg-black text-white">
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

      <div className="hidden md:block w-64 bg-[#030b0b] p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">Your Health Dashboard</h1>
        <p className="text-gray-400 mb-8 text-center md:text-left">Monitor your health, get insights, and stay informed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">BMI Calculator</CardTitle>
              <Scale className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <Input 
                type="number" 
                placeholder="Height (cm)" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                className="mb-2"
              />
              <Input 
                type="number" 
                placeholder="Weight (kg)" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="mb-2"
              />
              <Button onClick={calculateBMI} className="w-full">Calculate BMI</Button>
              {bmi && (
                <div className="mt-4">
                  <p className="text-2xl font-bold">Your BMI: {bmi}</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={bmiData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bmiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">AI Health Consultation</CardTitle>
              <Stethoscope className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <Input 
                type="text" 
                placeholder="Describe your symptoms..." 
                value={aiQuery} 
                onChange={(e) => setAiQuery(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleAiConsultation} className="w-full mb-2">Get Advice</Button>
              {aiResponse && (
                <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                  <p>{aiResponse}</p>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">AI Diet Planner</CardTitle>
              <Clipboard className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <Button onClick={generateDietPlan} className="w-full mb-2">Generate Diet Plan</Button>
              {dietPlan && (
                <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                  <p className="whitespace-pre-line">{dietPlan}</p>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600">
            <CardHeader>
              <CardTitle>Activity Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { day: 'Mon', steps: 6000 },
                  { day: 'Tue', steps: 7500 },
                  { day: 'Wed', steps: 5500 },
                  { day: 'Thu', steps: 8000 },
                  { day: 'Fri', steps: 6500 },
                  { day: 'Sat', steps: 9000 },
                  { day: 'Sun', steps: 7000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#fff" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600">
            <CardHeader>
              <CardTitle>Heart Rate Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { time: '12am', rate: 65 },
                  { time: '4am', rate: 62 },
                  { time: '8am', rate: 78 },
                  { time: '12pm', rate: 85 },
                  { time: '4pm', rate: 82 },
                  { time: '8pm', rate: 75 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#fff" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 mb-8">
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Stay hydrated by drinking at least 8 glasses of water daily.</li>
              <li>Aim for 30 minutes of moderate exercise 5 days a week.</li>
              <li>Include a variety of fruits and vegetables in your diet.</li>
              <li>Practice mindfulness or meditation to reduce stress.</li>
              <li>Ensure you get 7-9 hours of quality sleep each night.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-gray-400 text-sm">
          <p>Remember, this dashboard provides general health information and should not replace professional medical advice.</p>
          <p>Always consult with a healthcare professional for personalized medical guidance.</p>
        </div>
      </div>
    </div>
  )
}

