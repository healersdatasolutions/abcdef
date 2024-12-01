'use client'

import * as React from 'react'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Brain, FileText, LayoutDashboard, Pill, ShieldAlert, Search, User, ChevronRight, Calendar, Heart, TvMinimalPlayIcon, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { HealthOverview } from './health-overview'
import { HealthTips } from './health-tips'
import { HealthCommunity } from './health-community'
import { Badge } from '@/components/ui/badge'
import { Meteors } from '@/components/ui/meteors'

// Hardcoded data for demonstration
const healthData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 70 },
  { month: 'Mar', value: 75 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 78 },
  { month: 'Jun', value: 82 },
]

const scheduleData = [
  { time: '07:45', task: 'Take 2 Capsule of Vitamin D', status: 'DONE' },
  { time: '09:30', task: 'Blood Pressure Check', status: 'PENDING' },
  { time: '14:25', task: 'Take 2 Capsule of Vitamin C', status: 'YET' },
  { time: '16:00', task: 'Evening Walk', status: 'YET' },
  { time: '20:00', task: 'Take Blood Pressure Medicine', status: 'YET' },
]

const alertsData = [
  { message: 'Paracetamol ends in 2 days!!!', severity: 'high', color: 'bg-red-500' },
  { message: 'Your Order for Linocitrazen will be delivered tomorrow!!!', severity: 'medium', color: 'bg-green-500' },
  { message: 'Blood Pressure checkup due in 5 days', severity: 'low', color: 'bg-yellow-500' },
]

const medicalTips = [
  "An apple a day keeps doctor away!!",
  "Stay hydrated! Drink at least 8 glasses of water daily",
  "Regular exercise boosts immunity and mental health",
  "Good sleep is crucial for overall health",
]

const aiResponses = [
  "Based on your symptoms, it's recommended to rest and stay hydrated.",
  "Your condition seems mild. Monitor for 24 hours.",
  "Consider consulting your physician if symptoms persist.",
]

const suggestedQuestions = [
  "What are the symptoms of COVID-19?",
  "How can I improve my sleep quality?",
  "What's a balanced diet for weight loss?",
  "How often should I exercise?",
]

export default function Dashboard() {
  const [height, setHeight] = React.useState(175)
  const [weight, setWeight] = React.useState(60)
  const [currentTip, setCurrentTip] = React.useState(medicalTips[0])
  const [scheduleDataState, setScheduleData] = React.useState(scheduleData)
  const [query, setQuery] = React.useState('')
  const [chatMessages, setChatMessages] = React.useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showDetailedHealth, setShowDetailedHealth] = React.useState(false)

  // Calculate BMI
  const bmi = weight / ((height / 100) * (height / 100))
  const bmiData = [
    { name: 'BMI', value: bmi },
    { name: 'Ideal', value: 25 - bmi }
  ]
  const COLORS = ['#00C49F', '#FFBB28']

  // Rotate tips every 24 hours
  React.useEffect(() => {
    const index = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % medicalTips.length
    setCurrentTip(medicalTips[index])
  }, [])

  // Handle AI chat
  const handleSendMessage = (message = query) => {
    if (!message.trim()) return

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponses[Math.floor(Math.random() * aiResponses.length)] }
    ])
    setQuery('')
  }

  // Simulated real-time updates for schedules
  React.useEffect(() => {
      const interval = setInterval(() => {
        setScheduleData((prev: any) => {
          const newData = [...prev]
          const randomIndex = Math.floor(Math.random() * newData.length)
          const statuses = ['DONE', 'PENDING', 'YET']
          newData[randomIndex].status = statuses[Math.floor(Math.random() * statuses.length)]
          return newData
        })
      }, 5000) // Update every 5 seconds
  
      return () => clearInterval(interval)
    }, [])

  // More detailed BMI analysis
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  const bmiCategory = getBMICategory(bmi)
  const bmiAdvice = {
    'Underweight': 'Consider increasing your calorie intake with nutrient-rich foods.',
    'Normal weight': 'Maintain your current diet and exercise routine.',
    'Overweight': 'Focus on portion control and increasing physical activity.',
    'Obese': 'Consult with a healthcare professional for a personalized weight loss plan.'
  }

  // User stats data
  const userStats = [
    { title: 'Total Consultations', value: 24, icon: Brain },
    { title: 'Successful Appointments', value: 18, icon: Calendar },
    { title: 'Health Status', value: 'Healthy', icon: Heart },
    { title: 'Medication Adherence', value: '92%', icon: Pill },
  ]

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
            { icon: TvMinimalPlayIcon, label: 'Telly-Medicine', href: '/telly-med' },
            { icon: FileText, label: 'MedDocs', href: '/med-docs' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                item.label === 'Dashboard' && "bg-accent text-primary"
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
                
        
        {showDetailedHealth ? (
          <>
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={() => setShowDetailedHealth(false)} className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => setShowDetailedHealth(false)}>Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Detailed Health Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <HealthOverview height={height} weight={weight} />
          </>
        ) : (
          <>
            <h1 className='text-4xl font-bold mb-5'>Your Dashboard</h1>
          {/* start of the base dashboard content - Base Dashboard */}
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {userStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ai">AI Consultations</TabsTrigger>
                <TabsTrigger value="tips">Health Tips</TabsTrigger>
                <TabsTrigger value="community">Health Community</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              {/* Health Overview Card */}
              <Card className='col-span-2'>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Health Overview</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Edit Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Health Metrics</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Health Score" stroke="#0ea5e9" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bmiData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {bmiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                
                <CardContent>
                  <div className='flex items-center justify-between'>
                  <div>

                  <h3 className="text-lg font-semibold mb-2">BMI Analysis</h3>
                  <Badge variant="outline" className="bg-white text-black">Your BMI: {bmi.toFixed(2)}</Badge>
                  <Badge variant="outline" className="bg-white text-black">Category: {bmiCategory}</Badge>
                  <Badge variant="outline" className="bg-white text-black">Advice: {bmiAdvice[bmiCategory]}</Badge>
                 
                  </div>
                <Button variant="outline" onClick={() => setShowDetailedHealth(true)} className="mt-8">
                        View More
                      </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Medicharm AI Card */}
              <Card>
              <div className=''>
              <div className='relative overflow-x-hidden'>
                <CardHeader>
                  <CardTitle>Medicharm AI</CardTitle>
                </CardHeader>
                <CardContent>
                  

                  <ScrollArea className="h-[200px] z-20 mb-4">
                    <div className="space-y-4 overflow-hidden">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                            message.role === 'user'
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.content}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 w-full mt-[4.8rem]">
                    <Input
                      placeholder="Ask anything..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={() => handleSendMessage()}>Send</Button>
                  </div>
              
                   
                </CardContent>
                <Meteors number={20} />
              </div>
              </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Tip of the Day Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Tip of the Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-center">{currentTip}</p>
                </CardContent>
              </Card>

              {/* Upcoming Schedules Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Schedules</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/medications">View Details</a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {scheduleData.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{schedule.time}</p>
                            <p className="text-sm text-muted-foreground">{schedule.task}</p>
                          </div>
                          <span className={cn(
                            "text-sm",
                            schedule.status === 'DONE' && "text-green-500",
                            schedule.status === 'PENDING' && "text-yellow-500",
                            schedule.status === 'YET' && "text-muted-foreground"
                          )}>
                            {schedule.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Med Alerts Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Med Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {alertsData.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between gap-2">
                          <div className={cn(
                            "w-full rounded-lg px-3 py-2",
                            alert.color
                          )}>
                            <p className="text-sm text-white">{alert.message}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] mb-4">
                    <div className="space-y-4">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                            message.role === 'user'
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.content}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask anything..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={() => handleSendMessage()}>Send</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips">
                <HealthTips />
              </TabsContent>

              <TabsContent value="community">
                <HealthCommunity />
              </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </div>
  )
}

