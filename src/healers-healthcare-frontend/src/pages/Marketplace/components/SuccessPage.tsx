import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { CartItem } from '../types/types'

interface SuccessPageProps {
  product: CartItem
  onBackToMarketplace: () => void
  onViewCollection: () => void
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ product, onBackToMarketplace, onViewCollection }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Purchase Successful!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {product.type === 'nft' 
          ? 'Your NFT has been added to your collection'
          : 'Your subscription has been activated'}
      </p>
      <div className="flex gap-4">
        <Button onClick={onViewCollection}>
          View My Collection
        </Button>
        <Button variant="outline" onClick={onBackToMarketplace}>
          Back to Marketplace
        </Button>
      </div>
    </div>
  )
}

