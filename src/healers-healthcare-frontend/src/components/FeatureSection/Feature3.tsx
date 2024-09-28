"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Card } from "../ui/card"

interface CardData {
  id: number
  title: string
  color: string
  description: string
  content: string
  image: string
}

const cardData: CardData[] = [
  {
    id: 1,
    title: "Health Records",
    color: "text-indigo-500",
    description: "Manage The Records for the Patients",
    content: "The Smart Health Records System is a web-based application that allows patients to view their health records and doctors to manage their patients' records.",
    image: "/feature1.png? height=490&width=519"
  },
  {
    id: 2,
    title: "Appointments",
    color: "text-sky-800 dark:text-sky-400",
    description: "Handle Appointments for the Patients ",
    content: "Know about the appointments of the patients and manage them easily. Book Appointments, Check Availability, Past Records and much more.",
    image: "/feature3.png"
  },
  {
    id: 3,
    title: "Patient Details",
    color: "text-teal-800 dark:text-teal-400",
    description: "Get the   details of the Patients",
    content: "Get the Patient's Medical History, Test Reports, Past Appointments, Prescriptions, Recovery and Much More.",
    image: "/feature2.png? height=490&width=519"
  },
  {
    id: 4,
    title: "Inventory",
    color: "text-sky-500",
    description: "Manage the Inventory of the Hospital",
    content: "Manage the Inventory of the Hospital, Check the availability of the Medicines, Equipments, and other necessary items.",
    image: "/feature4.png? height=490&width=519"
  },
  
]

export default function Feature3() {
  const [entered, setEntered] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setEntered(index)
          }
        })
      },
      { rootMargin: '-30% 0px -70% 0px' }
    )

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.setProperty('--i', index.toString())
        observer.observe(ref)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="max-w-8xl h-full mx-auto">
      <div className="relative z-0 space-y-14 ">
        {cardData.map((card, index) => (
          <section
            key={card.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
              // No return statement needed
            }}
            data-index={index}
            className="[--i:0]"
            style={{ '--e': entered } as React.CSSProperties}
          >
            <Card className={`relative py-10 bg-[#d7d7d7] dark:bg-[#0b0b0b] border-b-2 dark:border-slate-700 overflow-hidden transition-transform duration-700 ease-in-out
              ${index === 0 ? 'z-[30]' : index === 1 ? 'z-[29]' : index === 2 ? 'z-[28]': 'z-[27]'}
              ${entered >= index ? 'translate-y-0' : '-translate-y-[calc(100%*(var(--i)-var(--e)))]'}`}
            >
              <div className="md:flex justify-around items-center my-5">
                <div className="shrink-0 px-12 py-14 max-md:pb-0 md:pr-0">
                  <div className="md:max-w-md">
                    <div className={`font-serif text-xl ${card.color} mb-2 relative inline-flex justify-center items-end`}>
                      {card.title}
                      <svg className="absolute fill-current opacity-40 -z-10" xmlns="http://www.w3.org/2000/svg" width="88" height="4" viewBox="0 0 88 4" aria-hidden="true" preserveAspectRatio="none">
                        <path d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999" />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-[#242424] dark:text-slate-50 mb-4">{card.description}</h1>
                    <p className="text-[#6f6f6f] dark:text-slate-600 mb-6">{card.content}</p>
                    <a className="text-sm font-medium inline-flex items-center justify-center px-3 py-1.5 border border-slate-700 rounded-lg tracking-normal transition text-slate-300 hover:text-slate-50 group" href="#0">
                      Learn More <span className="text-[#6f6f6f] dark:text-slate-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                    </a>
                  </div>
                </div>
                <img className="mx-auto rounded-lg lg:mx-10" src={card.image} width="800" height="900" alt={`Illustration ${card.id}`} />
              </div>
              <div className="absolute left-12 bottom-0 h-14 flex items-center text-xs font-medium text-slate-800">0{card.id}</div>
            </Card>
          </section>
        ))}
      </div>
    </div>
  )
}