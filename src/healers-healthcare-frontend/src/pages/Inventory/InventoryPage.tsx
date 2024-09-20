'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, UserCog, Calendar, Package, Minus, Plus, Syringe, Pill, Droplet, Menu, Search, X, Edit } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { healers_healthcare_backend } from "../../../../declarations/healers-healthcare-backend"

type InventoryItem = {
  name: string
  count: number
  icon: React.ElementType
  category: string
}

type InventorySection = {
  name: string
  items: InventoryItem[]
}

export default function Inventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inventory, setInventory] = useState<InventorySection[]>([])
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false)
  const [newInventoryItems, setNewInventoryItems] = useState<Array<{ name: string; count: number }>>([{ name: '', count: 0 }])
  const [newSectionName, setNewSectionName] = useState('')
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const result = await healers_healthcare_backend.getInventory()
      const newInventory: InventorySection[] = [
        {
          name: "Medical Supplies and Consumables",
          items: [
            { name: "Masks", count: Number(result.masks), icon: Package, category: "PPE" },
            { name: "Gloves", count: Number(result.gloves), icon: Package, category: "PPE" },
            { name: "Gowns", count: Number(result.gowns), icon: Package, category: "PPE" },
            { name: "Paracetamol", count: Number(result.paracetamol), icon: Pill, category: "Medication" },
            { name: "Painkiller", count: Number(result.painkiller), icon: Pill, category: "Medication" },
            { name: "Cough Syrup", count: Number(result.cough), icon: Droplet, category: "Medication" },
          ]
        },
        {
          name: "Stock For Emergency",
          items: [
            { name: "Oxygen Cylinder", count: Number(result.oxygen), icon: Package, category: "Equipment" },
            { name: "EHR Machine", count: Number(result.ehr), icon: Package, category: "Equipment" },
            { name: "Defibrillator", count: Number(result.defi), icon: Package, category: "Equipment" },
          ]
        },
        {
          name: "Laboratory Supplies",
          items: [
            { name: "Test Tubes", count: Number(result.test), icon: Package, category: "Lab" },
            { name: "Microscope Slides", count: Number(result.microscope), icon: Package, category: "Lab" },
            { name: "Petri Dishes", count: Number(result.petri), icon: Package, category: "Lab" },
          ]
        },
        {
          name: "Surgical Instruments",
          items: [
            { name: "Scalpels", count: Number(result.scalpels), icon: Package, category: "Surgical" },
            { name: "Forceps", count: Number(result.forceps), icon: Package, category: "Surgical" },
            { name: "Surgical Scissors", count: Number(result.surgicalScissors), icon: Package, category: "Surgical" },
          ]
        }
      ]
      setInventory(newInventory)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    }
  }

  const handleCountChange = async (sectionIndex: number, itemIndex: number, change: number) => {
    const item = inventory[sectionIndex].items[itemIndex];
    try {
      const newCount = await healers_healthcare_backend.updateInventory(item.name.toLowerCase().replace(' ', ''), BigInt(change))
      setInventory(prevInventory => {
        const newInventory = [...prevInventory]
        newInventory[sectionIndex].items[itemIndex].count = Number(newCount)
        return newInventory
      })
    } catch (error) {
      console.error("Failed to update inventory:", error)
    }
  }

  const handleFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
  }, [])

  const filteredInventory = useMemo(() => {
    return inventory.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const categoryMatch = filters.category === '' || item.category === filters.category
        const searchMatch = filters.search === '' || 
          item.name.toLowerCase().includes(filters.search.toLowerCase())
        return categoryMatch && searchMatch
      })
    })).filter(section => section.items.length > 0)
  }, [inventory, filters])

  const handleAddInventoryItem = () => {
    if (newInventoryItems.length < 5) {
      setNewInventoryItems([...newInventoryItems, { name: '', count: 0 }])
    }
  }

  const handleRemoveInventoryItem = (index: number) => {
    setNewInventoryItems(newInventoryItems.filter((_, i) => i !== index))
  }

  const handleNewInventoryItemChange = (index: number, field: 'name' | 'count', value: string | number) => {
    const updatedItems = [...newInventoryItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'count' ? Number(value) : value
    }
    setNewInventoryItems(updatedItems)
  }

  const handleAddInventorySubmit = async () => {
    // Here you would typically send this data to your backend
    // For now, we'll just add it to the local state
    const newSection: InventorySection = {
      name: newSectionName,
      items: newInventoryItems.map(item => ({
        name: item.name,
        count: item.count,
        icon: Package, // Default icon
        category: 'New' // Default category
      }))
    }
    setInventory([...inventory, newSection])
    setIsAddInventoryOpen(false)
    setNewSectionName('')
    setNewInventoryItems([{ name: '', count: 0 }])
  }

  const handleEditInventorySubmit = async (sectionIndex: number) => {
    // Here you would typically send this data to your backend
    // For now, we'll just update the local state
    const updatedInventory = [...inventory]
    updatedInventory[sectionIndex] = {
      ...updatedInventory[sectionIndex],
      name: newSectionName,
      items: newInventoryItems.map(item => ({
        name: item.name,
        count: item.count,
        icon: Package, // Default icon
        category: 'Updated' // You might want to add a way to edit the category as well
      }))
    }
    setInventory(updatedInventory)
    setEditingSectionIndex(null)
    setNewSectionName('')
    setNewInventoryItems([{ name: '', count: 0 }])
  }

  const SidebarContent = () => (
    <>
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

      <div className="hidden md:block w-64 bg-n-8 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#7047eb]">Inventory</h1>
        
        <section className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Select onValueChange={(value) => handleFilter('category', value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-n-8 text-white border hover:border-[#7047eb] rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-n-8 text-white border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="PPE">PPE</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Surgical">Surgical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="hidden sm:block text-[#7047eb]" />
            <Input
              placeholder="Search inventory items"
              className="w-full md:w-auto bg-transparent border hover:border-[#7047eb] text-white"
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#7047eb] border hover:bg-transparent hover:border-[#7047eb] text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-n-8 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Add New Inventory Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sectionName">Section Name</Label>
                  <Input
                    id="sectionName"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="bg-transparent border-gray-700"
                  />
                </div>
                {newInventoryItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Item {index + 1}</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => handleNewInventoryItemChange(index, 'name', e.target.value)}
                        className="bg-transparent border-gray-700"
                      />
                      <Input
                        type="number"
                        placeholder="Count"
                        value={item.count}
                        onChange={(e) => handleNewInventoryItemChange(index, 'count', e.target.value)}
                        className="bg-transparent border-gray-700"
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
                  <Button onClick={handleAddInventoryItem} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                )}
                <Button onClick={handleAddInventorySubmit} className="w-full">Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredInventory.map((section, sectionIndex) => (
            <Card key={section.name} className="bg-n-8/[0.5] rounded-lg shadow-lg">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-bold text-[#7047eb]">{section.name}</CardTitle>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => {
                      setEditingSectionIndex(sectionIndex)
                      setNewSectionName(section.name)
                      setNewInventoryItems(section.items.map(item => ({ name: item.name, count: item.count })))
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] bg-n-8 text-white border-gray-700">
                    <SheetHeader>
                      <SheetTitle>Edit Inventory Section</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="editSectionName">Section Name</Label>
                        <Input
                          id="editSectionName"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          className="bg-transparent border-gray-700"
                        />
                      </div>
                      {newInventoryItems.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <Label>Item {index + 1}</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Item Name"
                              value={item.name}
                              onChange={(e) => handleNewInventoryItemChange(index, 'name', e.target.value)}
                              className="bg-transparent border-gray-700"
                            />
                            <Input
                              type="number"
                              placeholder="Count"
                              value={item.count}
                              onChange={(e) => handleNewInventoryItemChange(index, 'count', e.target.value)}
                              className="bg-transparent border-gray-700"
                            />
                            <Button onClick={() => handleRemoveInventoryItem(index)} variant="destructive">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {newInventoryItems.length < 5 && (
                        <Button onClick={handleAddInventoryItem} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      )}
                      <Button onClick={() => handleEditInventorySubmit(sectionIndex)} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-n-8 rounded-lg">
                      <div className="flex items-center">
                        <item.icon className="h-6 w-6 mr-2 text-[#7047eb]" />
                        <span className='text-xs'>{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => handleCountChange(sectionIndex, itemIndex, -1)}
                          className="bg-black border hover:bg-transparent hover:border-red-700 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.count}</span>
                        <Button 
                          onClick={() => handleCountChange(sectionIndex, itemIndex, 1)}
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
    </div>
  )
}