import * as React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import { Product } from '../types/types'

interface ProductDetailsProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, subscriptionType?: string) => void
  onBuyNow: (product: Product, subscriptionType?: string) => void
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onAddToCart, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [subscriptionType, setSubscriptionType] = React.useState<string | undefined>(
    product.type === 'subscription' ? 'monthly' : undefined
  )

  // Auto-rotate images
  React.useEffect(() => {
    if (!product.images.length) return
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [product.images])

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{product.description}</p>

          {product.type === 'subscription' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Subscription Options</h3>
              <RadioGroup
                value={subscriptionType}
                onValueChange={setSubscriptionType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">
                    Monthly (${product.subscriptionOptions?.monthly})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perUse" id="perUse" />
                  <Label htmlFor="perUse">
                    Pay per use (${product.subscriptionOptions?.perUse})
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex gap-4">
            <Button className="flex-1" onClick={() => onBuyNow(product, subscriptionType)}>
              {product.type === 'nft' ? 'Buy Now' : 'Subscribe'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onAddToCart(product, subscriptionType)}>
              Add to Cart
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Product Details</h3>
          <ul className="space-y-2">
            {product.details.map((detail, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden bg-muted">
          <iframe
            src={product.videoUrl}
            title={`${product.name} demo video`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
        </div>
        

        <div className="space-y-4 space-x-6">
          <div className="aspect-square rounded-xl overflow-hidden ">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              
              className="items-center
              max-h-full
               "
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} preview ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  )
}

