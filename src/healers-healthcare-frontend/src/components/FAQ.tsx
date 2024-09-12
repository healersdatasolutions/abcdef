import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "./ui/accordion"
  

export default function FAQ() {
  return (

    <div className="w-full flex justify-center px-10 sm:px-40 md:px-60 lg:px-80">

  <Accordion type="single" collapsible className="w-full ">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is this Electronic Health Record?</AccordionTrigger>
    <AccordionContent>
      It is a digital version of a patient's paper chart. EHRs are real-time, patient-centered records that make information available instantly and securely to authorized users. While an EHR does contain the medical and treatment histories of patients, an EHR system is built to go beyond standard clinical data collected in a provider’s office and can be inclusive of a broader view of a patient’s care.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>What Leverage does a Hospital gets from Healers Healthcare?</AccordionTrigger>
    <AccordionContent>
      Healers Healthcare is a comprehensive solution that helps hospitals to manage their operations effectively. It helps hospitals to streamline their operations, reduce costs, and improve patient care. It also helps hospitals to improve their revenue cycle management, reduce errors, and improve patient
      
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>What are the security concerns, related to patient's data?</AccordionTrigger>
    <AccordionContent>
      So at Healers Healthcare, we prioritize the security of patient data. We have implemented various security measures to protect patient data. We use encryption to protect data in transit and at rest. We also have strict access controls in place to ensure that only authorized users can access patient data. We also conduct regular security audits to identify and address any security vulnerabilities.
      Moreover, We have partnered with ICP blockchain to ensure the security of patient data.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-4">
    <AccordionTrigger>What is the flow of the service</AccordionTrigger>
    <AccordionContent>
      So, For user, we have a mobile application, HEALERS HEALTHCARE, where user can register themselves and book an appointment with the doctor. The doctor can view the patient's details and can prescribe the medicine. The patient can view the prescription and can buy the medicine from the pharmacy. The pharmacy can view the prescription and can deliver the medicine to the patient.

    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-5">
    <AccordionTrigger>What are the features of the Mobile application?</AccordionTrigger>
    <AccordionContent>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente voluptas laboriosam ratione cumque nulla magni, omnis, quidem totam facere eos, modi nobis esse eius provident ipsum culpa optio velit vel.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-6">
    <AccordionTrigger>How do become our partner in health?</AccordionTrigger>
    <AccordionContent>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore doloremque non veritatis a! A obcaecati explicabo unde nesciunt magni atque libero iusto maiores! Dicta inventore sit dolor facilis dolores aliquid.
    </AccordionContent>
  </AccordionItem>
</Accordion>
  </div>
    
  )
}
