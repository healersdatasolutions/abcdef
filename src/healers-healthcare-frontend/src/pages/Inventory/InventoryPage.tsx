'use client'

import React, { useState, useEffect } from 'react'
import { FileText, UserCog, Calendar, Package, Plus, X, Menu, Search, Minus } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { healers_healthcare_backend } from "../../../../declarations/healers-healthcare-backend"
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { Actor, HttpAgent } from '@dfinity/agent';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'

type InventoryItem = {
  itemName: string
  itemCount: bigint
}

type InventorySection = {
  sectionName: string
  items: InventoryItem[]
}

export default function Component() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inventory, setInventory] = useState<InventorySection[]>([])
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newInventoryItems, setNewInventoryItems] = useState<InventoryItem[]>([{ itemName: '', itemCount: BigInt(0) }])
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)

  useEffect(() => {
    const initializeActor = async () => {
      try {
        const canisterId = localStorage.getItem('hospitalCanisterId')
        if (!canisterId) {
          throw new Error('Hospital canister ID not found')
        }
        console.log('Initializing actor with canister ID:', canisterId)
        const agent = new HttpAgent({ host: 'http://localhost:3000' }) // Update this URL if your local network is different
        await agent.fetchRootKey()
        const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory,  {
          agent,
          canisterId,
        })
        console.log('Actor initialized successfully')
        setHospitalActor(actor)
      } catch (err) {
        console.error('Failed to initialize hospital actor:', err)
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
    } catch (error) {
      console.error("Failed to add inventory:", error)
    }
  }

  const handleCountChange = async (sectionName: string, itemName: string, change: number) => {
    if (!hospitalActor) return
    try {
      await hospitalActor.updateInventoryItemCount(sectionName, itemName, BigInt(change))
      await fetchInventory()
    } catch (error) {
      console.error("Failed to update inventory count:", error)
    }
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
              href={`/${item.name.toLowerCase().replace(' ', '-')}`}
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
          <Select>
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
                        value={item.itemName}
                        onChange={(e) => handleNewInventoryItemChange(index, 'itemName', e.target.value)}
                        className="bg-transparent border-gray-700"
                      />
                      <Input
                        type="number"
                        placeholder="Count"
                        value={item.itemCount.toString()}
                        onChange={(e) => handleNewInventoryItemChange(index, 'itemCount', e.target.value)}
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
          {inventory.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-n-8/[0.5] rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#7047eb]">{section.sectionName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-4 bg-n-8 rounded-lg">
                      <div className="flex items-center">
                        <Package className="h-6 w-6 mr-2 text-[#7047eb]" />
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
    </div>
  )
}