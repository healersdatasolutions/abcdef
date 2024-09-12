'use client'

import React, { useState, useMemo, useCallback, useRef } from 'react'
import { FileText, UserCog, Calendar, Package, Minus, Plus, Syringe, Pill, Droplet, Menu, Search } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { MouseParallax } from "react-just-parallax"
// import { gradient } from '../assets'
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"

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
  const parallaxRef = useRef(null)
  const [inventory, setInventory] = useState<InventorySection[]>([
    {
      name: "Medical Supplies and Consumables",
      items: [
        { name: "Masks", count: 150, icon: Package, category: "PPE" },
        { name: "Gloves", count: 150, icon: Package, category: "PPE" },
        { name: "Gowns", count: 150, icon: Package, category: "PPE" },
        { name: "Paracetamol", count: 150, icon: Pill, category: "Medication" },
        { name: "Painkiller", count: 150, icon: Pill, category: "Medication" },
        { name: "Cough Syrup", count: 150, icon: Droplet, category: "Medication" },
      ]
    },
    {
      name: "Stock For Emergency",
      items: [
        { name: "Oxygen Cylinder", count: 150, icon: Package, category: "Equipment" },
        { name: "EHR Machine", count: 150, icon: Package, category: "Equipment" },
        { name: "Defibrillator", count: 150, icon: Package, category: "Equipment" },
      ]
    },
    {
      name: "Laboratory Supplies",
      items: [
        { name: "Test Tubes", count: 500, icon: Package, category: "Lab" },
        { name: "Microscope Slides", count: 1000, icon: Package, category: "Lab" },
        { name: "Petri Dishes", count: 200, icon: Package, category: "Lab" },
      ]
    },
    {
      name: "Surgical Instruments",
      items: [
        { name: "Scalpels", count: 100, icon: Package, category: "Surgical" },
        { name: "Forceps", count: 75, icon: Package, category: "Surgical" },
        { name: "Surgical Scissors", count: 50, icon: Package, category: "Surgical" },
      ]
    }
  ])

  const [filters, setFilters] = useState({ category: '', search: '' })

  const handleCountChange = (sectionIndex: number, itemIndex: number, change: number) => {
    setInventory(prevInventory => {
      const newInventory = [...prevInventory]
      newInventory[sectionIndex].items[itemIndex].count += change
      return newInventory
    })
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

  const SidebarContent = () => (
    <>
      {/* <h2 className="text-xl md:text-2xl font-bold text-[#7047eb] mb-8">Healers Healthcare</h2> */}
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
      {/* Mobile Sidebar */}
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
      <div className="hidden md:block w-64 bg-n-8 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      {/* Main content */}
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
        </section>
        
        <div className='relative'>
        {/* <MouseParallax ref={parallaxRef} className="relative z-10">
            <div className="hidden sm:block inset-0 left-90 w-[56.625rem] opacity-10 mix-blend-color-dodge pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
              </div>
            </div>
          </MouseParallax> */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredInventory.map((section, sectionIndex) => (
              <Card key={section.name} className="bg-n-8/[0.5] rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#7047eb]">{section.name}</CardTitle>
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
                            className="bg-black border  hover:bg-transparent hover:border-red-700 text-white rounded-full w-8 h-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.count}</span>
                          <Button 
                            onClick={() => handleCountChange(sectionIndex, itemIndex, 1)}
                            className="bg-black border  hover:bg-transparent hover:border-green-700 text-white rounded-full w-8 h-8 p-0"
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
    </div>
  )
}