import * as React from 'react'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PurchasedItem } from '../types/types'

interface CollectionItemDetailsProps {
  item: PurchasedItem
  onBack: () => void
}

export const CollectionItemDetails: React.FC<CollectionItemDetailsProps> = ({ item, onBack }) => {
  return (
    <div className="container max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden ">
            <img
              src={item.images[0]}
              alt={item.name}
             
              className="h-full "
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {item.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={`${item.name} view ${index + 2}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">
              {item.type === 'nft' ? 'NFT' : 'Subscription'}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <p className="text-lg text-muted-foreground">{item.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Purchase Date:</span>
                </div>
                <span className="font-medium">{item.purchaseDate}</span>
              </div>

              {item.type === 'subscription' && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Next Payment:</span>
                    </div>
                    <span className="font-medium">{item.nextPaymentDate}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subscription Progress</span>
                      <span>{item.subscriptionProgress}%</span>
                    </div>
                    <Progress value={item.subscriptionProgress} className="h-2" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {item.features && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

