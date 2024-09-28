"use client"

import React,{ useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface WordRotateProps {
  sentences: string[]
  duration?: number
  className?: string
}

export default function WordRotate({
  sentences,
  duration = 2500,
  className,
}: WordRotateProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimatingWords, setIsAnimatingWords] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentSentence = sentences[sentenceIndex].split(" ")

  useEffect(() => {
    const animateWords = () => {
      if (wordIndex < currentSentence.length) {
        timeoutRef.current = setTimeout(() => {
          setWordIndex((prev) => prev + 1)
        }, 200)
      } else {
        setIsAnimatingWords(false)
        timeoutRef.current = setTimeout(() => {
          setSentenceIndex((prev) => (prev + 1) % sentences.length)
          setWordIndex(0)
          setIsAnimatingWords(true)
        }, duration)
      }
    }

    animateWords()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [wordIndex, currentSentence.length, sentences.length, duration, sentenceIndex])

  return (
    <div className={cn("overflow-hidden py-2", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={sentenceIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap"
        >
          {currentSentence.map((word, index) => (
            <motion.span
              key={`${sentenceIndex}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={
                isAnimatingWords && index < wordIndex
                  ? { opacity: 1, x: 0 }
                  : isAnimatingWords
                  ? { opacity: 0, x: -20 }
                  : { opacity: 1, x: 0 }
              }
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="mr-2"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}