'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Brain, FileText, LayoutDashboard, Pill, Search, ShieldAlert, User, ChevronRight, Download, Eye, Plus, Send, Trash2, Edit, Bot, X, MessageSquare, TvIcon as TvMinimalPlayIcon, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

// Sample medical documents data
const initialDocuments = [
  {
    id: 1,
    name: "Medical Certificate",
    date: "2024-01-19",
    type: "certificate",
    status: "verified",
    preview: "/placeholder.svg?height=100&width=200",
    description: "General health certificate issued by Dr. Johnson",
    tags: ["General Health", "Annual"],
    issuer: "City General Hospital",
    expiryDate: "2025-01-19"
  },
  {
    id: 2,
    name: "Fitness Certificate",
    date: "2024-01-20",
    type: "certificate",
    status: "pending",
    preview: "/placeholder.svg?height=100&width=200",
    description: "Physical fitness assessment certificate",
    tags: ["Fitness", "Sports"],
    issuer: "SportsMed Center",
    expiryDate: "2024-07-20"
  },
  {
    id: 3,
    name: "Blood Test Report",
    date: "2024-01-15",
    type: "report",
    status: "verified",
    preview: "/placeholder.svg?height=100&width=200",
    description: "Complete blood count and metabolic panel results",
    tags: ["Pathology", "Regular"],
    issuer: "LifeLabs Diagnostics",
    expiryDate: null
  },
  {
    id: 4,
    name: "Vaccination Record",
    date: "2024-01-10",
    type: "record",
    status: "verified",
    preview: "/placeholder.svg?height=100&width=200",
    description: "COVID-19 vaccination and booster record",
    tags: ["Immunization", "COVID-19"],
    issuer: "Public Health Department",
    expiryDate: null
  }
]

// Sample AI chat messages
const initialMessages = [
  {
    role: 'assistant',
    content: 'Hello! I can help you understand your medical documents. What would you like to know?'
  },
  {
    role: 'user',
    content: 'What was my last blood test date?'
  },
  {
    role: 'assistant',
    content: 'According to your records, your last blood test was conducted on January 15, 2024. The report shows a complete blood count and metabolic panel analysis from LifeLabs Diagnostics.'
  }
]

export default function MedDocs() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [documents, setDocuments] = React.useState(initialDocuments)
  const [selectedDocument, setSelectedDocument] = React.useState<typeof initialDocuments[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = React.useState(false)
  const [messages, setMessages] = React.useState(initialMessages)
  const [newMessage, setNewMessage] = React.useState('')
  const [editForm, setEditForm] = React.useState({
    name: '',
    description: '',
    issuer: '',
    type: '',
    tags: '',
    file: null as File | null
  })
  const [newDocument, setNewDocument] = React.useState({
    name: '',
    description: '',
    issuer: '',
    type: '',
    tags: '',
    file: null as File | null
  })

  // Handle document editing
  const handleEditDocument = () => {
    if (selectedDocument) {
      const updatedDocuments = documents.map(doc =>
        doc.id === selectedDocument.id
          ? {
              ...doc,
              name: editForm.name || doc.name,
              description: editForm.description || doc.description,
              issuer: editForm.issuer || doc.issuer,
              type: editForm.type || doc.type,
              tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()) : doc.tags,
              preview: editForm.file ? URL.createObjectURL(editForm.file) : doc.preview
            }
          : doc
      )
      setDocuments(updatedDocuments)
      setIsEditDrawerOpen(false)
      toast.success('Document updated successfully!')
    }
  }

  // Handle document deletion
  const handleDeleteDocument = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id))
      setIsViewDialogOpen(false)
      toast.success('Document deleted successfully!')
    }
  }

  // Handle adding new document
  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      name: newDocument.name,
      date: new Date().toISOString().split('T')[0],
      type: newDocument.type,
      status: 'pending',
      preview: newDocument.file ? URL.createObjectURL(newDocument.file) : "/placeholder.svg?height=100&width=200",
      description: newDocument.description,
      tags: newDocument.tags.split(',').map(tag => tag.trim()),
      issuer: newDocument.issuer,
      expiryDate: null
    }
    setDocuments([...documents, newDoc])
    setIsAddDialogOpen(false)
    setNewDocument({
      name: '',
      description: '',
      issuer: '',
      type: '',
      tags: '',
      file: null
    })
    toast.success('Document added successfully!')
  }

  // Handle sending AI chat message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      role: 'user',
      content: newMessage
    }
    
    // Simulate AI response
    const aiResponse = {
      role: 'assistant',
      content: `I understand you're asking about "${newMessage}". Based on your medical records, I can provide relevant information. However, please note that I'm a demo AI assistant and this is a simulated response.`
    }

    setMessages([...messages, userMessage, aiResponse])
    setNewMessage('')
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'new' | 'edit') => {
    const file = e.target.files?.[0]
    if (file) {
      if (formType === 'new') {
        setNewDocument(prev => ({ ...prev, file }))
      } else {
        setEditForm(prev => ({ ...prev, file }))
      }
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
                item.label === 'MedDocs' && "bg-accent text-primary"
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
              placeholder="Search documents..."
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
                  { label: 'Documents', href: '#' },
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

        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Health Record Storage</h1>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Document</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Document Name</Label>
                    <Input
                      id="name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Document Type</Label>
                    <Input
                      id="type"
                      value={newDocument.type}
                      onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issuer">Issuer</Label>
                    <Input
                      id="issuer"
                      value={newDocument.issuer}
                      onChange={(e) => setNewDocument({ ...newDocument, issuer: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newDocument.tags}
                      onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">Upload Document</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'new')}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDocument}>Add Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAIChatOpen} onOpenChange={setIsAIChatOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Assistance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Medical Assistant
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex gap-3 text-sm",
                            message.role === 'assistant'
                              ? "flex-row"
                              : "flex-row-reverse"
                          )}
                        >
                          <Avatar className="h-8 w-8">
                            {message.role === 'assistant' ? (
                              <Bot className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </Avatar>
                          <div className={cn(
                            "rounded-lg px-3 py-2 max-w-[80%]",
                            message.role === 'assistant'
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          )}>
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 pt-4">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Documents Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.no</TableHead>
                  <TableHead>Name of Document</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{doc.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Simulate download
                            toast.success('Document download started!')
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedDocument(doc)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[100px] h-[60px] rounded-lg bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                        <Image
                          src={doc.preview}
                          alt={doc.name}
                          width={100}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Document Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedDocument?.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (selectedDocument) {
                        setEditForm({
                          name: selectedDocument.name,
                          description: selectedDocument.description,
                          issuer: selectedDocument.issuer,
                          type: selectedDocument.type,
                          tags: selectedDocument.tags.join(', '),
                          file: null
                        })
                        setIsEditDrawerOpen(true)
                      }
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={handleDeleteDocument}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Document Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{selectedDocument?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Added:</span>
                      <span>{selectedDocument?.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuer:</span>
                      <span>{selectedDocument?.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={selectedDocument?.status === 'verified' ? 'default' : 'secondary'}>
                        {selectedDocument?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument?.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedDocument?.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                <Image
                  src={selectedDocument?.preview || ''}
                  alt={selectedDocument?.name || ''}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Document Drawer */}
        <Sheet open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Document</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Document Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Document Type</Label>
                <Input
                  id="edit-type"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-issuer">Issuer</Label>
                <Input
                  id="edit-issuer"
                  value={editForm.issuer}
                  onChange={(e) => setEditForm({ ...editForm, issuer: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-file">Update Document File</Label>
                <Input
                  id="edit-file"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'edit')}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDocument}>
                Save Changes
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

