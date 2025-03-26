export type SubscriptionType = "monthly" | "perUse"

export type Product = {
  id: number
  name: string
  type: 'nft' | 'subscription'
  price: number
  salePercentage: number
  description: string
  images: string[]
  details: string[]
  videoUrl: string
  subscriptionOptions?: {
    monthly: number
    perUse: number
  }
  features?: string[]
  benefits?: string[]
}

export type CartItem = Product & { 
  quantity: number
  subscriptionType?: SubscriptionType 
}

export type PurchasedItem = CartItem & { 
  purchaseDate: string
  nextPaymentDate?: string
  subscriptionProgress?: number 
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Medical Card NFT",
    type: "nft",
    price: 0.5,
    salePercentage: 15,
    description: "Secure your medical history on the blockchain. This NFT serves as your digital medical identity card.",
    images: [
      "/healthCardImg3.png",
      "/healthCardImg3.png",
      "/healthCardImg3.png"
    ],
    details: [
      "Immutable medical record storage",
      "Quick access to medical history",
      "Secure sharing with healthcare providers"
    ],
    videoUrl: "https://www.youtube-nocookie.com/embed/C9ctoK4M9Bk",
    features: [
      "Lifetime validity",
      "Instant verification",
      "Global acceptance",
      "HIPAA compliant"
    ],
    benefits: [
      "Seamless healthcare access",
      "Reduced paperwork",
      "Enhanced privacy"
    ]
  },
  {
    id: 2,
    name: "AI Consultation",
    type: "subscription",
    price: 29.99,
    salePercentage: 20,
    description: "24/7 access to our advanced AI medical consultation service.",
    images: [
      "/ai21.png",
      "/ai22.png",
      "/ai21.png"
    ],
    details: [
      "Instant medical advice",
      "Symptom analysis",
      "Treatment recommendations"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    subscriptionOptions: {
      monthly: 29.99,
      perUse: 4.99
    },
    features: [
      "24/7 availability",
      "AI-powered diagnostics",
      "Personalized health insights"
    ],
    benefits: [
      "Immediate medical guidance",
      "Reduced healthcare costs",
      "Early detection of health issues"
    ]
  },
  {
    id: 3,
    name: "General NFT 1",
    type: "nft",
    price: 0.3,
    salePercentage: 10,
    description: "Limited edition healthcare-themed digital collectible.",
    images: [
      "/healthCardImg.png",
      "/healthCardImg3.png",
      "/healthCardImg.png"
    ],
    details: [
      "Unique artwork",
      "Limited edition",
      "Blockchain verified"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: [
      "Exclusive design",
      "Limited availability",
      "High resale value"
    ],
    benefits: [
      "Ownership of unique digital asset",
      "Potential investment growth",
      "Community recognition"
    ]
  },
  {
    id: 4,
    name: "Health Data Summarizer",
    type: "subscription",
    price: 19.99,
    salePercentage: 25,
    description: "AI-powered health data analysis and summarization tool.",
    images: [
      "/ai31.png",
      "/ai22.png",
      "/ai21.png"
    ],
    details: [
      "Automated health report generation",
      "Trend analysis",
      "Personalized insights"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    subscriptionOptions: {
      monthly: 19.99,
      perUse: 2.99
    },
    features: [
      "Comprehensive data analysis",
      "User-friendly reports",
      "Regular updates"
    ],
    benefits: [
      "Better health management",
      "Informed decision making",
      "Improved health outcomes"
    ]
  },
  {
    id: 5,
    name: "Premium Medical Card NFT",
    type: "nft",
    price: 0.8,
    salePercentage: 5,
    description: "Premium version of our medical card NFT with extended features.",
    images: [
      "/healthCardImg.png",
      "/healthCardImg3.png",
      "/healthCardImg.png"
    ],
    details: [
      "Enhanced security features",
      "Priority medical data access",
      "Exclusive healthcare benefits"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: [
      "Priority support",
      "Extended validity",
      "Exclusive access"
    ],
    benefits: [
      "Enhanced privacy",
      "Priority healthcare services",
      "Exclusive community membership"
    ]
  },
  {
    id: 6,
    name: "Wellness NFT Collection",
    type: "nft",
    price: 0.4,
    salePercentage: 15,
    description: "Collectible NFTs promoting wellness and healthy living.",
    images: [
      "/healthCardImg.png",
      "/healthCardImg3.png",
      "/healthCardImg.png"
    ],
    details: [
      "Artistic wellness representations",
      "Community benefits",
      "Health awareness promotion"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: [
      "Unique designs",
      "Limited edition",
      "Community engagement"
    ],
    benefits: [
      "Promotes healthy living",
      "Community support",
      "Potential investment"
    ]
  },
  {
    id: 7,
    name: "Medicharm AI",
    type: "subscription",
    price: 39.99,
    salePercentage: 30,
    description: "Advanced AI-powered medical assistant for comprehensive healthcare support.",
    images: [
      "/ai1.png",
      "/ai21.png",
      "/ai31.png"
    ],
    details: [
      "Personalized health recommendations",
      "Real-time health monitoring",
      "Advanced diagnostic assistance"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    subscriptionOptions: {
      monthly: 39.99,
      perUse: 5.99
    },
    features: [
      "24/7 AI support",
      "Comprehensive health tracking",
      "Personalized insights"
    ],
    benefits: [
      "Improved health outcomes",
      "Convenient healthcare access",
      "Cost-effective"
    ]
  }
]
