'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { Card, CardContent } from "./ui/card"
import { PlayCircle, Info } from "lucide-react"
import React from 'react'

interface Video {
  id: string;
  title: string;
  description: string;
}

interface VideoCardProps {
  video: Video;
  index: number;
}

const videos: Video[] = [
  {
    id: 'joCFbTJt0o0',
    title: 'Complete Rust Marathon in 6 hours',
    description: 'Learn Rust programming language in this comprehensive 6-hour marathon. Perfect for beginners and intermediate developers looking to master Rust.'
  },
  {
    id: '1ibsQrnuEEg',
    title: 'Fractional Knapsack Algorithm',
    description: 'Dive into the Fractional Knapsack Algorithm. Understand its principles, implementation, and applications in optimization problems.'
  },
  {
    id: 'C7plHMKIFcU',
    title: 'The case for NFTs',
    description: 'Explore the world of Non-Fungible Tokens (NFTs). Learn about their potential, use cases, and impact on digital ownership and creativity.'
  }
]

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else {
      controls.start('hidden')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="mb-8"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[60vh] sm:p-10">
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <PlayCircle className="mr-2 text-primary align-middle" aria-hidden="true" />
                {video.title}
              </h2>
              <p className="text-muted-foreground flex items-start">
                <Info className="mr-2 mt-1 flex-shrink-0" aria-hidden="true" />
                {video.description}
              </p>
            </div>
            <div className="aspect-video self-center w-full h-full min-h-[300px]">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function VideoComponent() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="w-full space-y-8">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </section>
  )
}