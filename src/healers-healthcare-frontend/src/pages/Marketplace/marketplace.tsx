'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Brain, FileText, LayoutDashboard, Pill, Search, ShieldAlert, User, ChevronRight, Calendar, Heart, TvIcon as TvMinimalPlayIcon, Plus, ArrowLeft, Youtube, ShoppingCart, Check, Clock, Gift } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ProductCard } from './components/ProductCard'
import { ProductDetails } from './components/ProductDetails'
import { Cart } from './components/Cart'
import { SuccessPage } from './components/SuccessPage'
import { Product, CartItem, PurchasedItem, initialProducts, SubscriptionType } from './types/types'
import { AddProductForm } from './components/AddProductForm'
import { CollectionItemDetails } from './components/CollectionItemDetails';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [products, setProducts] = React.useState(initialProducts)
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false)
  const [cartItems, setCartItems] = React.useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [purchasedItems, setPurchasedItems] = React.useState<PurchasedItem[]>([])
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [lastPurchasedItem, setLastPurchasedItem] = React.useState<CartItem | null>(null)
  const [showCollection, setShowCollection] = React.useState(false)
  const [selectedCollectionItem, setSelectedCollectionItem] = React.useState<PurchasedItem | null>(null)

  const handleAddToCart = (product: Product, subscriptionType?: string) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, subscriptionType: subscriptionType as SubscriptionType }])
    }
    toast.success('Added to cart!')
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
    toast.success('Removed from cart!')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    const now = new Date()
    const newPurchasedItems = cartItems.map(item => ({
      ...item,
      purchaseDate: now.toLocaleDateString(),
      nextPaymentDate: item.type === 'subscription'
        ? new Date(now.setMonth(now.getMonth() + 1)).toLocaleDateString()
        : undefined,
      subscriptionProgress: item.type === 'subscription' ? 0 : undefined
    }))
    
    setPurchasedItems([...purchasedItems, ...newPurchasedItems])
    setLastPurchasedItem(cartItems[0])
    setCartItems([])
    setIsCartOpen(false)
    setShowSuccess(true)
  }

  const handleBuyNow = (product: Product, subscriptionType?: string) => {
    const purchaseItem = {
      ...product,
      quantity: 1,
      subscriptionType: subscriptionType as SubscriptionType,
      purchaseDate: new Date().toLocaleDateString(),
      nextPaymentDate: product.type === 'subscription'
        ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()
        : undefined,
      subscriptionProgress: product.type === 'subscription' ? 0 : undefined
    }
    
    setPurchasedItems([...purchasedItems, purchaseItem])
    setLastPurchasedItem({ ...product, quantity: 1, subscriptionType: subscriptionType as SubscriptionType })
    setShowSuccess(true)
  }

  // Update subscription progress periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPurchasedItems(items =>
        items.map(item => {
          if (item.type === 'subscription' && item.subscriptionProgress !== undefined) {
            const newProgress = Math.min(100, (item.subscriptionProgress + 1))
            return { ...item, subscriptionProgress: newProgress }
          }
          return item
        })
      )
    }, 86400000) // Update every 24 hours

    return () => clearInterval(interval)
  }, [])

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
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItems.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {cartItems.length}
                </Badge>
              )}
            </Button>
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
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowCollection(true)}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    My Collection
                  </Button>
                  {[
                    { label: 'Wishlist', href: '#' },
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
        </div>

        {showSuccess ? (
          <SuccessPage
            product={lastPurchasedItem!}
            onBackToMarketplace={() => {
              setShowSuccess(false)
              setSelectedProduct(null)
            }}
            onViewCollection={() => {
              setShowSuccess(false)
              setShowCollection(true)
            }}
          />
        ) : showCollection ? (
          selectedCollectionItem ? (
            <CollectionItemDetails
              item={selectedCollectionItem}
              onBack={() => setSelectedCollectionItem(null)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">My Collection</h1>
                  <p className="text-muted-foreground">
                    {purchasedItems.length} items in your collection
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCollection(false)}
                >
                  Back to Marketplace
                </Button>
              </div>

              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="nft">NFTs</TabsTrigger>
                  <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {purchasedItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item}
                        isPurchased
                        onClick={() => setSelectedCollectionItem(item)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="nft" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {purchasedItems
                      .filter(item => item.type === 'nft')
                      .map((item) => (
                        <ProductCard
                          key={item.id}
                          product={item}
                          isPurchased
                          onClick={() => setSelectedCollectionItem(item)}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {purchasedItems
                      .filter(item => item.type === 'subscription')
                      .map((item) => (
                        <ProductCard
                          key={item.id}
                          product={item}
                          isPurchased
                          onClick={() => setSelectedCollectionItem(item)}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )
        ) : selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Marketplace</h1>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setShowCollection(true)}>
                  <Gift className="mr-2 h-4 w-4" />
                  My Collection
                </Button>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <AddProductForm
                      onSubmit={(newProduct) => {
                        setProducts([...products, newProduct])
                        setIsAddProductOpen(false)
                        toast.success('Product added successfully!')
                      }}
                      onCancel={() => setIsAddProductOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {products
                .filter(product => 
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
            </div>
          </>
        )}

        {/* Cart Sheet */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <Cart
              items={cartItems}
              onRemove={handleRemoveFromCart}
              onCheckout={handleCheckout}
              onClose={() => setIsCartOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

