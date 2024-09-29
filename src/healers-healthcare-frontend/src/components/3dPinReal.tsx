"use client";
// import React from "react";
import { PinContainer } from "./ui/3d-pin";
import Heading from "./Heading/Heading"

import {Link} from "react-router-dom";
import Section from "./Section/Section";
//import React from "react";
// import { gradient } from "../assets";

export function AnimatedPinDemo() {
  return (
    <>

    <div>

     <Section className="overflow-hidden" id="3dPins">
            
        <div className="container md:pb-10">
            <Heading tag="Ready to get started" title="Features Out of the Blue" />
        </div>
    </Section>
    
    


    <div className="grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-4
    gap-4
    w-full
    pl-10
    pr-10
    ">
      <div className="absolute top-[70.25rem] left-[20.375rem] w-[56.625rem] opacity-90 mix-blend-color-dodge pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                                <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                            </div>
                        </div>
      
    <Link 
    to = "/health-records"
    >

      
    <div className="h-[24rem] w-full flex items-center justify-center ">

      <PinContainer
        title="Health Record"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Health Records
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <img src="medicalrecord.webp" alt="HealthRecord"/>

          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-800" /> */}
        </div>
      </PinContainer>
      
    </div>
    </Link>



    <Link
    to = "/doctor-dashboard">

    <div className="h-[24rem] w-full flex items-center justify-center ">
      <PinContainer
        title="Doctor Dashboard"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Doctor Dashboard
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <img src="doctdash.png" alt="DoctorDashboard" className="h-88"/>

          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-800" /> */}
        </div>
      </PinContainer>
      
    </div>
    </Link>



    <Link
    to = "/appointments">


    <div className="h-[24rem] w-full flex items-center justify-center ">
      <PinContainer
        title="Appointments"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Appointments
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <img src="app.png" alt="Appoiments"/>
          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-800" /> */}
        </div>
      </PinContainer>
      
    </div>
    </Link>



    <Link
    to = "/inventory">


    <div className="h-[24rem] w-full flex items-center justify-center ">
      <PinContainer
        title="Inventory"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
          Inventory
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <img src="inventory.webp" alt="fuck you"/>
          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-800" /> */}
        </div>
      </PinContainer>
      
    </div>

    </Link>
      
      </div>
    </div>
    
      
    </>
  );
}
