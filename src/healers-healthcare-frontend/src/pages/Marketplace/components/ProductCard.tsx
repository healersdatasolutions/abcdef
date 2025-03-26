import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { Product } from '../types/types'

interface ProductCardProps {
  product: Product
  onClick: () => void
  isPurchased?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isPurchased = false }) => {
  return (
    <motion.div
      className="relative w-full aspect-[3/4] bg-card rounded-xl cursor-pointer group flex flex-col justify-between"
      whileHover="hover"
      initial="initial"
    >
      {/* <div className=''> */}
        <div>

      {/* Stacked Cards */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          initial: { rotate: 0, x: 0, y: 0 },
          hover: { rotate: -5, x: -60, y: -40 }
        }}
      >
        <div className="rotate-270 w-3/4 text-center aspect-square bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl shadow-lg">
          {isPurchased ? (
            <Badge variant="secondary" className="absolute top-2 right-2">
              <Check className="w-4 h-4 mr-1" /> Owned
            </Badge>
          ) : (
            <span className="text-2xl font-bold">{product.salePercentage}% OFF</span>
          )}
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          initial: { rotate: 0, x: 0, y: 0 },
          hover: { rotate: 5, x: 20, y: -10 }
        }}
      >
        <div className="w-3/4 aspect-square rounded-xl shadow-lg flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.name}
           
            className="absolute  object-cover rounded-xl
             scale-90
            "
          />
        </div>
      </motion.div>
        </div>


      {/* Main Content */}
      <div className=" p-4 flex flex-col justify-between">
        <div className="flex-1" />
        <div className="relative z-10 bg-gradient-to-t from-background/80 via-background/60 to-transparent -mx-4 -mb-4 p-4 backdrop-blur-sm">
          <h3 className="font-semibold truncate text-lg mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {product.type === 'nft' ? `${product.price} ETH` : `$${product.price}/month`}
          </p>
          <Button className="w-full" onClick={onClick}>
            {isPurchased ? 'View Details' : 'View Product'}
          </Button>
        </div>
      </div>
      {/* </div> */}
    </motion.div>
  )
}

