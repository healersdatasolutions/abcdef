'use client'

// https://ui.shadcn.com/docs/components/tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

// https://github.com/shadcn-ui/ui/blob/bf0c8b596bd7fb32daed989cab318430fd4c8919/apps/www/hooks/use-media-query.tsx#L4
import { useMediaQuery } from '../../lib/hooks/use-media-query'

// https://github.com/shadcn-ui/ui/blob/bf0c8b596bd7fb32daed989cab318430fd4c8919/apps/www/lib/utils.ts
import { cn } from '../../lib/utils'
import React from 'react'
// import { gradient} from "../../assets";
import {useRef} from "react";
import { MouseParallax, ScrollParallax } from "react-just-parallax";
import { VelocityScroll } from '../magicui/scroll-based-velocity'


const features = [
  {
    title: 'Health Record',
    description:
      'Matain a list/logs of all the patient record for your Hospital or Clinic.',
    image: {
      dark: '/feature1.png',
      light: '/feature1.png'
    }
  },
  {
    title: 'Patient Record',
    description: 'Get Individual patient record with a trained AI to help you with the diagnosis.',
    image: {
      dark: '/feature2.png',
      light: '/feature2.png'
    }
  },
  {
    title: 'Calendar',
    description: 'All your trades organized into a classic Calendar, giving you a brief overview.',
    image: {
      dark: '/feature3.png',
      light: '/feature3.png'
    }
  },
  {
    title: 'Share',
    description: 'Easily share your trades with friends through our shareable components feature.',
    image: {
      dark: '/feature4.png',
      light: '/feature4.png'
    }
  }
]

export function Features() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const parallaxRef = useRef(null);

  return (
    <section
      id='features'
      aria-label='Features for running your books'
      className='overflow-hidden py-20'
    >
        {/* <MouseParallax ref={parallaxRef} className="relative -z-30">

                    
                <div className="hidden sm:block absolute inset-0 right- w-[56.625rem] opacity-20 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                    </div>
                </div>
                </MouseParallax> */}
                <div className="absolute top-[20.25rem] left-[40rem] right-[1.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none -z-20">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src='/gradient.png' width={942} height={942} alt="" />
                    </div>
                </div>
                
      <div className='container'>
        <div className='pb-20 md:mx-auto md:text-center'>
          <h2 className='font-cal text-3xl sm:text-4xl md:text-5xl'>
            Glimpse of the of What we offer
          </h2>
          <p className='pt-6 text-lg tracking-tight text-muted-foreground'>
            Well everything you need when we're actually finished making the product.
          </p>
        </div>

        <Tabs
          defaultValue='Patient Record'
          className='lg:grid lg:grid-cols-12'
          orientation={isDesktop ? 'vertical' : 'horizontal'}
        >
          {/* Tabs List */}
          <div className='lg:col-span-5 lg:my-auto'>
            <TabsList
              className={cn(
                'h-fit w-full justify-normal', // override default styles
                'p-4 bg-transparent rounded-lg', // base styles
                'overflow-x-auto rounded-b-none  ', // small screens
                'lg:flex-col lg:justify-center lg:rounded-md lg:rounded-r-none lg:p-1' // large screens
              )}
              // doesn't work in Safari (use justify-normal on parent with first:ml-auto last:mr-auto on children)
              // style={{ justifyContent: 'safe center' }}
            >
              {features.map((feat) => (
                <TabsTrigger
                  key={feat.title}
                  className={cn(
                    // override default styles
                    'bg-[#724cde] border hover:border-violet-600 rounded-lg hover:bg-transparent/25 text-wrap', // base styles
                    'bg-transparent ', // selected styles
                    'first:ml-auto last:mr-auto', // small screens
                    'lg:flex lg:h-32 lg:w-full lg:flex-col lg:items-start lg:rounded-r-none lg:text-left ' // large screens
                  )}
                  value={feat.title}
                >
                    <div className='  rounded-lg'>

                  <h3 className='font-cal text-lg text-foreground text-[#724dce] '>{feat.title}</h3>
                  <p className='hidden pt-3 text-sm lg:block '>{feat.description}</p>
                    </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tabs Content */}
          <div className='my-auto lg:col-span-7'>
            {features.map((feat) => (
              <TabsContent
                forceMount
                key={feat.title}
                value={feat.title}
                className={cn(
                  'mt-0', // override default styles
                  'rounded-b-md bg-transparent shadow-xl data-[state=inactive]:hidden', // base styles
                  'lg:rounded-t-md' // large styles
                )}
              >
                <div className='flex w-fit justify-center bg-transparent p-4 pt-0 lg:hidden'>
                  <p>{feat.description}</p>
                </div>
                <div className='w-[45rem] sm:w-auto lg:w-[65rem] lg:rounded-t-md '>
                  <img
                    className='hidden rounded-md dark:block'
                    src={feat.image.dark}
                    width={2880}
                    height={1880}
                    alt={feat.title}
                  />
                  <img
                    className='rounded-md dark:hidden'
                    src={feat.image.light}
                    width={2880}
                    height={1880}
                    alt={feat.title}
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      <div className=" rotate-6 ">

            <VelocityScroll
            text="Wait We Have More"
            default_velocity={1}
            className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black/70 drop-shadow-sm dark:text-white/30 md:text-7xl md:leading-[5rem]"
          />
        </div>
    </section>
  )
}