'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Brain, FileText, LayoutDashboard, Pill, Search, ShieldAlert, User, ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, TvIcon as TvMinimalPlayIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Sample data for diseases and consultation types
const diseases = [
  "Common Cold & Flu",
  "Allergies",
  "Digestive Issues",
  "Skin Conditions",
  "Headaches & Migraines",
  "Mental Health",
  "Joint Pain",
  "Respiratory Issues",
  "Eye Problems",
  "Ear Infections"
]

const consultationTypes = [
  { type: "Critical", description: "Immediate medical attention needed" },
  { type: "Severe", description: "Serious condition requiring prompt care" },
  { type: "General Query", description: "Regular health-related questions" },
  { type: "Follow-up", description: "Follow-up on previous consultation" },
  { type: "Second Opinion", description: "Additional medical perspective" }
]

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: "Understanding Telemedicine",
    excerpt: "Learn how telemedicine is revolutionizing healthcare delivery...",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=400"
  },
  {
    id: 2,
    title: "Mental Health in Digital Age",
    excerpt: "Exploring the impact of technology on mental wellness...",
    author: "Dr. Michael Chen",
    date: "2024-01-14",
    readTime: "7 min read",
    image: "/placeholder.svg?height=200&width=400"
  },
  // Add more blog posts...
]

// Sample video demonstrations
const videos = [
  {
    id: 1,
    title: "Proper Hand Washing Technique",
    description: "Learn the WHO-recommended method for hand hygiene",
    videoUrl: "https://www.youtube.com/embed/3PmVJQUCm4E",
    upvotes: 156,
    downvotes: 3,
    comments: 45
  },
  {
    id: 2,
    title: "Home Blood Pressure Monitoring",
    description: "Step-by-step guide to measuring blood pressure at home",
    videoUrl: "https://www.youtube.com/embed/5mGo1UCAuVQ",
    upvotes: 203,
    downvotes: 5,
    comments: 67
  },
  // Add more videos...
]

export default function Telemedicine() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedDisease, setSelectedDisease] = React.useState('')
  const [selectedConsultationType, setSelectedConsultationType] = React.useState('')
  const [additionalInfo, setAdditionalInfo] = React.useState('')
  const [videoStats, setVideoStats] = React.useState<Record<number, { upvotes: number, downvotes: number }>>({})

  // Initialize video stats
  React.useEffect(() => {
    const stats: Record<number, { upvotes: number, downvotes: number }> = {}
    videos.forEach(video => {
      stats[video.id] = { upvotes: video.upvotes, downvotes: video.downvotes }
    })
    setVideoStats(stats)
  }, [])

  const handleVote = (videoId: number, type: 'up' | 'down') => {
    setVideoStats(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [type === 'up' ? 'upvotes' : 'downvotes']: prev[videoId][type === 'up' ? 'upvotes' : 'downvotes'] + 1
      }
    }))
    toast.success(`Vote recorded!`)
  }

  const isConsultationReady = selectedDisease && selectedConsultationType && additionalInfo

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
                item.label === 'Telly-Medicine' && "bg-accent text-primary"
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
                  { label: 'Appointments', href: '#' },
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

        <h1 className="text-3xl font-bold mb-6">Telemedicine Services</h1>

        {/* Main Tabs */}
        <Tabs defaultValue="consultation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consultation">Live Doctor Consultation</TabsTrigger>
            <TabsTrigger value="blogs">Health Blogs</TabsTrigger>
            <TabsTrigger value="videos">Video Demonstrations</TabsTrigger>
          </TabsList>

          {/* Consultation Content */}
          <TabsContent value="consultation" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Disease Selection Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Select The Disease</CardTitle>
                  <CardDescription>Choose from common conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!selectedDisease ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-2"
                      >
                        {diseases.map((disease) => (
                          <Button
                            key={disease}
                            variant="outline"
                            className="h-auto py-4 px-3 text-sm text-left"
                            onClick={() => setSelectedDisease(disease)}
                          >
                            {disease}
                          </Button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="font-medium">{selectedDisease}</p>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedDisease('')}
                        >
                          Change Selection
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Consultation Type Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Select the Type</CardTitle>
                  <CardDescription>Choose consultation category</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!selectedConsultationType ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {consultationTypes.map((type) => (
                          <Button
                            key={type.type}
                            variant="outline"
                            className="w-full justify-start h-auto py-4"
                            onClick={() => setSelectedConsultationType(type.type)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{type.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="font-medium">{selectedConsultationType}</p>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedConsultationType('')}
                        >
                          Change Selection
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Any Additional Info</CardTitle>
                  <CardDescription>Describe your condition</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!additionalInfo ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Textarea
                          placeholder="Please describe your symptoms or concerns..."
                          className="min-h-[150px]"
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="font-medium line-clamp-3">{additionalInfo}</p>
                        <Button
                          variant="ghost"
                          onClick={() => setAdditionalInfo('')}
                        >
                          Edit Description
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Get in Touch Card */}
            <Card className={cn(
              "transition-opacity duration-500",
              isConsultationReady ? "opacity-100" : "opacity-50 pointer-events-none"
            )}>
              <CardHeader>
                <CardTitle>Let's Get you in Touch!</CardTitle>
                <CardDescription>
                  Connect with a healthcare professional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => toast.info("Doxy.me integration coming soon!")}
                >
                  Start Consultation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Blogs Content */}
          <TabsContent value="blogs" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      By {post.author} • {post.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost">Read More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Demonstrations Content */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video">
                      <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleVote(video.id, 'up')}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{videoStats[video.id]?.upvotes || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleVote(video.id, 'down')}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{videoStats[video.id]?.downvotes || 0}</span>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => toast.info("Comments feature coming soon!")}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{video.comments} Comments</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

