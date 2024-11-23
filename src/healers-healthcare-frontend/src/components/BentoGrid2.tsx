"use client"

import React, { useRef, useEffect } from "react"
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion"

export default function BentoGrid2() {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.8 })
  const controls = useAnimation()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const createFloatingAnimation = () => ({
    x: Math.random() * 80 - 20,
    y: Math.random() * 80 - 20,
    rotate: Math.random() * 20 - 10,
    transition: {
      duration: Math.random() * 1 + 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  })

  const floatingVariants = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants2 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants3 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants4 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants5 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants6 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants7 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants8 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants9 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  const floatingVariants10 = {
    floating: createFloatingAnimation(),
    aligned: { x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  }
  


  useEffect(() => {
    if (isInView) {
      controls.start("aligned")
    } else {
      controls.start("floating")
    }
  }, [isInView, controls])

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div ref={ref} id="bentotwo" className="relative max-w-6xl mx-auto p-10" style={{ opacity }}>
      <div className="grid grid-cols-12 gap-3 auto-rows-fr mb-[0.75rem]">
        <motion.div className="col-span-3" variants={floatingVariants} initial="floating" animate={controls}>
          <img src="/card1.png" alt="" className="w-full h-full object-cover hover:scale-95 transition duration-200" />
        </motion.div>
        <motion.div className="col-span-6" variants={floatingVariants2} initial="floating" animate={controls}>
          <img src="/card2.png" alt="" className="w-full h-full object-cover hover:scale-95 transition duration-200" />
        </motion.div>
        <div className="doubleImg flex flex-col justify-between col-span-3 h-full">
          <motion.div variants={floatingVariants3} initial="floating" animate={controls}>
            <img src="/card3.1.png" alt="" className="w-full  object-cover hover:scale-95 transition duration-200" />
          </motion.div>
          <motion.div variants={floatingVariants4} initial="floating" animate={controls}>
            <img src="/card3.2.png" alt="" className="w-full  object-cover hover:scale-95 transition duration-200" />
          </motion.div>
        </div>
      </div>

      {/* <motion.div
        className="absolute w-52 h-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        variants={floatingVariants5}
        initial="floating"
        animate={controls}
      > */}
        <img src="/circleBento.png" alt="" className="absolute w-52 h-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " />
        
      {/* </motion.div> */}

      <div className="grid grid-cols-12 gap-3 mt-[0.75rem]">
        <div className="flex flex-col justify-between col-span-3">
          <motion.div variants={floatingVariants6} initial="floating" animate={controls}>
            <img src="/card4.png" alt="" className="w-full  object-cover hover:scale-95 transition duration-200" />
          </motion.div>
          <motion.div variants={floatingVariants7} initial="floating" animate={controls}>
            <img src="/card4.1.png" alt="" className="w-full  object-cover hover:scale-95 transition duration-200" />
          </motion.div>
        </div>
        <motion.div className="flex col-span-3" variants={floatingVariants8} initial="floating" animate={controls}>
          <img src="/card5.png" alt="" className="w-full h-full object-cover hover:scale-95 transition duration-200" />
        </motion.div>
        <motion.div className="col-span-3" variants={floatingVariants9} initial="floating" animate={controls}>
          <img src="/card6.png" alt="" className="w-full h-full object-cover hover:scale-95 transition duration-200" />
        </motion.div>
        <motion.div className="col-span-3" variants={floatingVariants10} initial="floating" animate={controls}>
          <img src="/card7.png" alt="" className="w-full h-full object-cover hover:scale-95 transition duration-200" />
        </motion.div>
      </div>
    </motion.div>
  )
}