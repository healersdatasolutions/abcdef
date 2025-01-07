import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DialogFooter } from "@/components/ui/dialog"
import { ImagePlus, X } from 'lucide-react'
import { Product } from '../types/types'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddProductFormProps {
  onSubmit: (product: Product) => void
  onCancel: () => void
}

interface FormData {
  name: string
  type: 'nft' | 'subscription'
  price: string
  salePercentage: string
  description: string
  details: string[]
  videoUrl: string
  images: string[]
  subscriptionOptions: {
    monthly: string
    perUse: string
  }
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    type: 'nft',
    price: '',
    salePercentage: '',
    description: '',
    details: ['', '', ''],
    videoUrl: '',
    images: [],
    subscriptionOptions: {
      monthly: '',
      perUse: ''
    }
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 3) // Limit to 3 images
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) {
      // Use placeholder images if no images are uploaded
      formData.images = [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400"
      ]
    }
    
    onSubmit({
      ...formData,
      id: Date.now(),
      price: Number(formData.price),
      salePercentage: Number(formData.salePercentage),
      subscriptionOptions: formData.type === 'subscription' ? {
        monthly: Number(formData.subscriptionOptions.monthly),
        perUse: Number(formData.subscriptionOptions.perUse)
      } : undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.images.length < 3 && (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Add Image</span>
                          </div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            multiple={true}
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Product Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value: 'nft' | 'subscription') => setFormData({ ...formData, type: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nft" id="nft" />
                        <Label htmlFor="nft">NFT</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subscription" id="subscription" />
                        <Label htmlFor="subscription">Subscription</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">
                      {formData.type === 'nft' ? 'Price (ETH)' : 'Monthly Price (USD)'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step={formData.type === 'nft' ? '0.1' : '0.01'}
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="salePercentage">Sale Percentage</Label>
                    <Input
                      id="salePercentage"
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={formData.salePercentage}
                      onChange={(e) => setFormData({ ...formData, salePercentage: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-6">
                {formData.type === 'subscription' && (
                  <div className="grid gap-2">
                    <Label htmlFor="perUse">Pay Per Use Price (USD)</Label>
                    <Input
                      id="perUse"
                      type="number"
                      step="0.01"
                      required
                      value={formData.subscriptionOptions.perUse}
                      onChange={(e) => setFormData({
                        ...formData,
                        subscriptionOptions: {
                          ...formData.subscriptionOptions,
                          perUse: e.target.value
                        }
                      })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Product Details (3 required)</Label>
                  {formData.details.map((detail, index) => (
                    <Input
                      key={index}
                      value={detail}
                      required
                      placeholder={`Detail ${index + 1}`}
                      onChange={(e) => {
                        const newDetails = [...formData.details]
                        newDetails[index] = e.target.value
                        setFormData({ ...formData, details: newDetails })
                      }}
                    />
                  ))}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">YouTube Video URL</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Product</Button>
      </DialogFooter>
    </form>
  )
}

