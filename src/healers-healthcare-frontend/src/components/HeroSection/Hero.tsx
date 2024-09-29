"use client";
// import { curve, loading, yourlogo } from "../../assets";
// import Button from "../Buttons/Button";
import Section from "../Section/Section";
import { MouseParallax, ScrollParallax} from "react-just-parallax";
import {useRef} from "react";
//import { cn } from "../../lib/utils";
// import Notification from "../Notification/Notification";
// import PlusSvg from "../../assets/svg/PlusSvg";
// import PropTypes from "prop-types";
// import Video from "../Video";
// import { gradient} from "../../assets";
// import Lottie from 'react-lottie';
// import animationData1 from '../../lotties/medicalIcon1.json';
//import {Tooltip} from "flowbite-react";


// const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData1,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice"
//     }
//   };
 
// import DNA from "../3D_Elements/DNA";
import { TextGenerateEffect } from "../ui/text-generate-effect";
// import { TypewriterEffectSmoothDemo } from "../Typewriter";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Spotlight } from "../ui/Spotlight";
import { AbstractIcon } from "../Icons";
// import { Link } from "react-router-dom";



const HeaderWords = [
    {
      text: "Treatment",
      className: "text-[#744de1] dark:text-[#744de1]",
    },
    {
      text: "With",
      className: "text-black dark:text-white",
    },
    
   
  ];

  const HeaderWords2 = [
    {
        text: "The",
        className: "text-black dark:text-white",
      },
    {
      text: "Best",
      className: "text-black dark:text-white",
    },
    {
      text: "Doctor",
      className: "text-black dark:text-white",
      
    },
  ];

import { useTheme } from '../ThemeProvider/theme-provider';
import React from "react";
const Hero = () => {
    const parallaxRef = useRef(null);
    const words = `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
`;
    
    const { theme } = useTheme();

    const dark = theme === 'dark';
    return (

        <Section className="" crosses crossesOffset="lg:translate-y-[5.25rem]" id="hero">
            <div className="h-[60rem] sm:h-[60rem] w-full rounded-md flex md:items-center md:justify-center bg-transparent dark:bg-black/[0.80] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-90 sm:-top-40 left-0 md:left-60 md:-top-20"
        fill={dark? "#fff" : "#000"}
      />
      <div className="absolute">

        <ScrollParallax>
            <div className="flex">

            <AbstractIcon />
            <div className="rotate-[30deg]">

            <AbstractIcon />
            </div>
            </div>

        </ScrollParallax>
      </div>
            <div className="subContainer" >


                {/* <MouseParallax ref={parallaxRef} className="relative z-10">

                    
                <div className="hidden sm:block absolute inset-0 right- w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                    </div>
                </div>
                </MouseParallax> */}

              
                

                
                


                <div className="absolute top-[30.25rem] -right-[20.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                    </div>
                </div>
                <div className="absolute top-[40.25rem] left-[20.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                    </div>
                </div>

                {!dark && (
                    <div>

                        <div className="absolute top-[10.25rem] left-[20.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                            </div>
                        </div>
                        <div className="absolute z-10 top-[60.25rem] left-[45.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                            <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                        </div>
                    </div>
                    <div className="absolute z-10 top-[50.25rem] left-[5.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                            <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                        </div>
                    </div>
                    </div>
                )}
            
            <div className="container relative" ref={parallaxRef}>
                <div className="relative z-1 top-20 max-w-full mb-[3.875rem] md:mb-20 lg:mb-[18.25rem] lg:mt-[1.25rem]">
                    {/* <h1 className="h1 mb-6 mt-10">
                        <span className="text-green-500">
                        Treatment {` `}
                        </span>
                         with the {` `}
                    </h1> */}
                    {/* <h1 className="h1 mb-6">
                  
                        <span className="inline-block relative">
                            Best Doctor <img src={curve} className="absolute top-full left-0 w-full xl:-mt-2" width={624} height={28} alt="" />
                        </span>
                    </h1> */}
                    
                    
                    <div className="HeroTitleAndSubTitle  w-full flex  justify-around ">

                        

                        <div className=" flex flex-col justify-start sm:justify-center items-center lg:items-start  h-[20rem] pt-[10rem] sm:pt-[0]  ">

                            <div className="HeroTitle flex flex-col ">
                            <TypewriterEffectSmooth words={HeaderWords} nextline={false}/>
                            <TypewriterEffectSmooth words={HeaderWords2} nextline={true}/>

                            </div>
        
                            <div className="subtext w-[75%] text-center lg:text-left" >
                                <TextGenerateEffect words={words} />
                            </div>
                        </div>


                        {/* <div className="hidden lg:flex flex-row  items-center justify-center h-[20rem]  ">
                        
                        <img
                            src="/HealersHealthcareLogo.png"
                            alt="hero"
                            className="CompanyLogo object-cover"
                        />

                        <div className="CompanyNameContainer flex flex-col  items-start">

                        <h1 className="CompanyName
                        text-7xl font-bold bg-gradient-to-r from-[#9029c1] via-[#00e7ea] to-[#4b73d1] inline-block text-transparent drop-shadow-2xl bg-clip-text">Healers</h1>
                         <h1 className="CompanyName
                        text-7xl font-bold bg-gradient-to-r from-[#9029c1] via-[#00e7ea] to-[#5079d8] inline-block text-transparent drop-shadow-2xl bg-clip-text">Healthcare</h1>
                        </div>                         
                        </div> */}
                        <img src="/HealersHealthcareOfficialLogo.png" alt="HealersLogoHero"
                        className="CompanyLogo object-cover hidden xl:flex w-[800px] h-[240px]"/>
                    </div>
                </div>

                <div className="bottomButtonsSticky fixed inset-0 top-auto  w-full z-50 flex justify-around mb-10">
                {/* <Tooltip title="Coming Soon" position="top" content="Lorem ipsum dolor sit amet consectetur adipisicing elit."> */}
                    <button className="z-20 relative inline-flex h-12  overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:-translate-y-1 transition duration-400">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="text-black inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#fff] px-3 py-1 text- font-medium backdrop-blur-3xl ">
                            Download Our Mobile App 
                        </span>
                    </button> 
                    {/* </Tooltip> */}
                    {/* <Tooltip title="Coming Soon" position="top" content="Lorem ipsum dolor sit amet consectetur adipisicing elit."> */}
                            <button className="z-20 relative inline-flex h-12  overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:-translate-y-1 transition duration-400">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="text-white inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#000000] px-3 py-1 text- font-medium backdrop-blur-3xl ">
                            Login as a Hospital 
                        </span>
                    </button>
                    {/* </Tooltip> */}

                     
                </div>
            </div>

            
            



                            
                {/* <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
                    <div className="relative z-1 p-0.5 rounded-2xl ">
                        <div className="relative bg-n-8 rounded-[1rem]">
                            <div className=" rounded-t-[0.9rem]" />


                            <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                                <div className="">
                                    <Video className="w-full"/>
                                </div>

                                <div className="flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2 text-base">
                                    <img className="w-5 h-5 mr-4" src={loading} alt="" />
                                    Get medical help in seconds
                                </div>

                                <ScrollParallax isAbsolutelyPositioned className="z-50">
                                    <div className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-[#474060]/40 backdrop-blur border border-white/10 rounded-2xl xl:flex transition hover:scale-105">
                                        
                                        <h6 className="p-5 font-semibold text-base">
                                            I will change this later
                                        </h6>
                                    </div>
                                </ScrollParallax>

                                <ScrollParallax isAbsolutelyPositioned>
                                    <Notification className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex" title="Meet the Team" />
                                </ScrollParallax>
                            </div>
                        </div>

                        <div className="relative z-1 h-6 mx-2.5 bg-[#2c9e5a] shadow-xl rounded-b-[1.25rem] lg:h-6 lg:mx-8" />
                        <div className="relative z-1 h-6 mx-6 bg-[#165a31] shadow-xl rounded-b-[1.25rem] lg:h-6 lg:mx-20" />
                    </div>
                    <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
                    </div>
                </div> */}
            </div>
    </div>


                {/* <div className="hidden relative z-10 mt-20 lg:block">
                    <h5 className="tagline mb-6 text-center text-white/50">Helping people create beautiful content at</h5>
                    <ul className="flex">
                        <li className="flex items-center justify-center flex-1 h-[8.5rem]">
                            <img src={yourlogo} width={134} height={28} alt="" />
                        </li>
                        <li className="flex items-center justify-center flex-1 h-[8.5rem]">
                            <img src={yourlogo} width={134} height={28} alt="" />
                        </li>
                        <li className="flex items-center justify-center flex-1 h-[8.5rem]">
                            <img src={yourlogo} width={134} height={28} alt="" />
                        </li>
                        <li className="flex items-center justify-center flex-1 h-[8.5rem]">
                            <img src={yourlogo} width={134} height={28} alt="" />
                        </li>
                    </ul>
                </div> */}

                                            
        </Section>
    );
};


// BackgroundCircles.propTypes = {
//     parallaxRef: PropTypes.object,
// };

export default Hero;
