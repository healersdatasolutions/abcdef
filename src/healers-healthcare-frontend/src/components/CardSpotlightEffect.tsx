import React from "react";
import { useRef, useState } from "react";
// import Roadmap from "./FeatureSection/Feature";
import { AnimatedPinDemo } from "./3dPinReal";
import { HeroScrollDemo } from "./ScrollHero";
import { motion } from "framer-motion";
import { Features } from "./FeatureSection/Features2";
import Iphone15Pro from "./magicui/iphone-15-pro";
import { VelocityScroll } from "./magicui/scroll-based-velocity";
import RetroGrid from "./magicui/retro-grid";
import DotPattern from "./magicui/dot-pattern";
import { cn } from "../lib/utils";
import MobileAppSection from "./MobileAppSection";
import FAQ from "./FAQ";
import { BentoGridThirdDemo } from "./BentoGrid1";
import { BackgroundBoxesDemo } from "./BackgroundBoxes";

export const CardSpotlightEffect1 = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current || isFocused) return;
  
      const div = divRef.current;
      const rect = div.getBoundingClientRect();
  
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
  
    const handleFocus = () => {
      setIsFocused(true);
      setOpacity(1);
    };
  
    const handleBlur = () => {
      setIsFocused(false);
      setOpacity(1);
    };
  
    const handleMouseEnter = () => {
      setOpacity(1);
    };
  
    const handleMouseLeave = () => {
      setOpacity(1);
    };
  
    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className=" relative max-w-full overflow-hidden rounded-xl "
      >
        
        <div
          
          className="pointer-events-none absolute -inset-px opacity-0 transition ease-in duration-600 -z-10"
          style={{
            opacity,
            background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(157, 67, 171, 0.4), transparent 50%)`,
          }}
          
        />
        {/* <Roadmap /> */}
        {/* <Features /> */}
        <BentoGridThirdDemo />
        <AnimatedPinDemo />
        {/* <HeroScrollDemo /> */}
        
       <MobileAppSection/>


       <p className="mt-36 mb-10 z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
    FAQs
  </p>  



  {/* faq section */}

  <FAQ/>

  

  
  <p className="mt-36 mb-10 z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
    That's Healers For You
  </p>   
        <BackgroundBoxesDemo/>


        
        
        
      </div>
    );
  };
  