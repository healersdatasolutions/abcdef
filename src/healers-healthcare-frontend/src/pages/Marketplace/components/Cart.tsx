import * as React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Trash2 } from 'lucide-react'
import { CartItem } from '../types/types'

interface CartProps {
  items: CartItem[]
  onRemove: (id: number) => void
  onCheckout: () => void
  onClose: () => void
}

export const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout, onClose }) => {
  const total = items.reduce((sum, item) => {
    const price = item.type === 'subscription' 
      ? (item.subscriptionType === 'monthly' ? item.subscriptionOptions!.monthly : item.subscriptionOptions!.perUse)
      : item.price
    return sum + (price * item.quantity)
  }, 0)

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-4 py-6 border-b">
        <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
      </SheetHeader>
      
      <ScrollArea className="flex-1 px-4">
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.type === 'subscription' 
                      ? `${item.subscriptionType} - $${
                          item.subscriptionType === 'monthly' 
                            ? item.subscriptionOptions!.monthly 
                            : item.subscriptionOptions!.perUse
                        }` 
                      : `${item.price} ETH`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4 space-y-4">
        <div className="flex justify-between text-lg font-medium">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onCheckout}>
            Checkout
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

