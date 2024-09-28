"use client";
// import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
// import {imgForScroll} from "../assets/imgForScroll";
// import Image from "next/image";

import {gradient} from "../assets";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Manage your <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Dashboard
              </span>
            </h1>
          </>
        }
      >
        <img
          src=
            "../../imgForScroll.png"
            
            
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <div className="absolute bottom-[40.25rem] right-[10.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>
                <div className="-z-30 absolute bottom-[145.25rem] right-[10.375rem] w-[56.625rem] opacity-80 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>
                <div className="-z-30 absolute bottom-[105.25rem] right-[10.375rem] w-[56.625rem] opacity-80 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>


    </div>
  );
}
