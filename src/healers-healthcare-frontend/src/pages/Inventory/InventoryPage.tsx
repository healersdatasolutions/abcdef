'use client'

import React, { useState, useEffect } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, X, Menu, Search, Minus, Edit, TrendingUp } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '../../components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { Actor, HttpAgent } from '@dfinity/agent'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { toast } from "sonner"
import { Toaster } from "../../components/ui/sonner"

type InventoryItem = {
  itemName: string
  itemCount: bigint
}

type InventorySection = {
  sectionName: string
  items: InventoryItem[]
}

export default function InventoryManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inventory, setInventory] = useState<InventorySection[]>([])
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newInventoryItems, setNewInventoryItems] = useState<InventoryItem[]>([{ itemName: '', itemCount: BigInt(0) }])
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSection, setEditingSection] = useState<InventorySection | null>(null)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)

  useEffect(() => {
    const initializeActor = async () => {
      try {
        const canisterId = localStorage.getItem('hospitalCanisterId')
        if (!canisterId) {
          throw new Error('Hospital canister ID not found')
        }
        console.log('Initializing actor with canister ID:', canisterId)
        const agent = new HttpAgent({ host: 'https://ic0.app' })
        const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory, {
          agent,
          canisterId,
        })
        console.log('Actor initialized successfully')
        setHospitalActor(actor)
      } catch (err) {
        console.error('Failed to initialize hospital actor:', err)
        toast.error('Failed to connect to the hospital service. Please try logging in again.')
      }
    }

    initializeActor()
  }, [])

  useEffect(() => {
    if (hospitalActor) {
      fetchInventory()
    }
  }, [hospitalActor])

  const fetchInventory = async () => {
    if (!hospitalActor) return
    try {
      const result = await hospitalActor.listInventories()
      setInventory(result.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          itemCount: BigInt(item.itemCount.toString())
        }))
      })))
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
      toast.error("Failed to fetch inventory. Please try again.")
    }
  }

  const handleAddInventoryItem = () => {
    if (newInventoryItems.length < 5) {
      setNewInventoryItems([...newInventoryItems, { itemName: '', itemCount: BigInt(0) }])
    }
  }

  const handleRemoveInventoryItem = (index: number) => {
    setNewInventoryItems(newInventoryItems.filter((_, i) => i !== index))
  }

  const handleNewInventoryItemChange = (index: number, field: 'itemName' | 'itemCount', value: string | bigint) => {
    const updatedItems = [...newInventoryItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'itemCount' ? BigInt(value.toString()) : value
    }
    setNewInventoryItems(updatedItems)
  }

  const handleAddInventorySubmit = async () => {
    if (!hospitalActor) return
    try {
      await hospitalActor.AddInventory(newSectionName, newInventoryItems)
      await fetchInventory()
      setIsAddInventoryOpen(false)
      setNewSectionName('')
      setNewInventoryItems([{ itemName: '', itemCount: BigInt(0) }])
      toast.success("Inventory section added successfully")
    } catch (error) {
      console.error("Failed to add inventory:", error)
      toast.error("Failed to add inventory. Please try again.")
    }
  }

  const handleCountChange = async (sectionName: string, itemName: string, change: number) => {
    if (!hospitalActor) return
    try {
      await hospitalActor.updateInventoryItemCount(sectionName, itemName, BigInt(change))
      await fetchInventory()
      toast.success("Inventory count updated successfully")
    } catch (error) {
      console.error("Failed to update inventory count:", error)
      toast.error("Failed to update inventory count. Please try again.")
    }
  }

  const handleEditSection = (section: InventorySection) => {
    setEditingSection(section)
    setIsEditDrawerOpen(true)
  }

  const handleEditSectionSubmit = async () => {
    if (!hospitalActor || !editingSection) return
    try {
      // Assuming there's an updateInventorySection method in the backend
      // await hospitalActor.updateInventorySection(editingSection.sectionName, editingSection.items)  add this part in the backend
      await fetchInventory()
      setIsEditDrawerOpen(false)
      setEditingSection(null)
      toast.success("Inventory section updated successfully")
    } catch (error) {
      console.error("Failed to update inventory section:", error)
      toast.error("Failed to update inventory section. Please try again.")
    }
  }

  const handleEditItemChange = (index: number, field: 'itemName' | 'itemCount', value: string | bigint) => {
    if (!editingSection) return
    const updatedItems = [...editingSection.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'itemCount' ? BigInt(value.toString()) : value
    }
    setEditingSection({ ...editingSection, items: updatedItems })
  }

  const filteredInventory = inventory.filter(section => 
    filter === 'all' || section.sectionName.toLowerCase() === filter.toLowerCase()
  ).map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  const SidebarContent = () => (
    <>
      <img src="/HealersHealthcareOfficialLogo.png" alt="Healers Healthcare" className="w-40 mx-auto mb-8" />
      <nav className="space-y-2">
        {[
          { name: 'Dashboard', icon: TrendingUp },
          { name: 'Health Records', icon: FileText },
          { name: 'Doctor Dashboard', icon: UserCog },
          { name: 'Appointments', icon: Calendar },
          { name: 'Inventory', icon: Package },
        ].map((item, index) => (
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
    <div className="flex flex-col md:flex-row  relative z-10 min-h-screen h-full bg-[url('/gradient9.png')] max-w-[1536px] mx-auto  bg-opacity-100 backdrop:blur-sm text-white">
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
      <div className="hidden md:block w-64 mx-2 my-5 rounded-lg bg-transparent backdrop-blur border border-white/20 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-8">
        <Toaster />
        <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold mb-4 text-white">Inventory Management</h1>
        <p className="text-gray-400 text-center lg:text-left mb-8">Manage and track hospital inventory across different categories.</p>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px] bg-n-8 text-white border hover:border-[#259b95] rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-transparent  text-white border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="PPE">PPE</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Surgical">Surgical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#259b95]" />
            <Input
              placeholder="Search inventory items"
              className="w-full md:w-auto bg-transparent border hover:border-[#259b95] text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#259b95] border hover:bg-transparent hover:border-[#259b95] text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#259b95] mb-4">Add New Inventory Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sectionName">Section Name</Label>
                  <Input
                    id="sectionName"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="bg-black border-gray-700 focus:border-[#259b95]"
                  />
                </div>
                {newInventoryItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Item {index + 1}</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Item Name"
                        value={item.itemName}
                        onChange={(e) => handleNewInventoryItemChange(index, 'itemName', e.target.value)}
                        className="bg-black border-gray-700 focus:border-[#259b95]"
                      />
                      <Input
                        type="number"
                        placeholder="Count"
                        value={item.itemCount.toString()}
                        onChange={(e) => handleNewInventoryItemChange(index, 'itemCount', e.target.value)}
                        className="bg-black border-gray-700 focus:border-[#259b95]"
                      />
                      {index > 0 && (
                        <Button onClick={() => handleRemoveInventoryItem(index)} variant="destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {newInventoryItems.length < 5 && (
                  <Button onClick={handleAddInventoryItem} variant="outline" className="border-[#259b95] text-[#259b95] hover:bg-[#259b95] hover:text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                )}
                <Button onClick={handleAddInventorySubmit} className="w-full bg-[#259b95] hover:bg-[#1a6b67] text-white">Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredInventory.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-transparent backdrop-blur-lg border-[#259b95] rounded-lg shadow-lg relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-[#259b95]">{section.sectionName}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-[#259b95] hover:bg-[#259b95]   hover:text-white transition-colors duration-200"
                  onClick={() => handleEditSection(section)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-4 bg-transparent border border-white/35 rounded-lg">
                      <div className="flex items-center">
                        <Package className="h-6 w-6 mr-2 text-[#259b95]" />
                        <span className='text-xs'>{item.itemName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => handleCountChange(section.sectionName, item.itemName, -1)}
                          className="bg-black border hover:bg-transparent hover:border-red-700 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.itemCount.toString()}</span>
                        <Button 
                          onClick={() => handleCountChange(section.sectionName, item.itemName, 1)}
                          className="bg-black border hover:bg-transparent hover:border-green-700 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Sheet open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <SheetContent side="right" className="w-[400px] bg-[#030b0b] p-4 md:p-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-[#259b95] mb-4">Edit Inventory Section</SheetTitle>
          </SheetHeader>
          {editingSection && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editSectionName">Section Name</Label>
                <Input
                  id="editSectionName"
                  value={editingSection.sectionName}
                  onChange={(e) => setEditingSection({ ...editingSection, sectionName: e.target.value })}
                  className="bg-black border-gray-700 focus:border-[#259b95]"
                />
              </div>
              {editingSection.items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Label>Item {index + 1}</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleEditItemChange(index, 'itemName', e.target.value)}
                      className="bg-black border-gray-700 focus:border-[#259b95]"
                    />
                    <Input
                      type="number"
                      placeholder="Count"
                      value={item.itemCount.toString()}
                      onChange={(e) => handleEditItemChange(index, 'itemCount', e.target.value)}
                      className="bg-black border-gray-700 focus:border-[#259b95]"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                <SheetClose asChild>
                  <Button variant="outline" className="border-[#259b95] text-[#259b95] hover:bg-[#259b95] hover:text-white">
                    Cancel
                  </Button>
                </SheetClose>
                <Button onClick={handleEditSectionSubmit} className="bg-[#259b95] hover:bg-[#1a6b67] text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}