"use client"

import * as React from "react"
import ScrollTo from '../ui/scrollTo';
import { cn } from "../../lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { HoveredLink } from "../ui/navbar-menu"
import { ModeToggle } from "../mode-toggle"
import MetaMaskLogo from "../MetamaskLogo"
import { Link } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Hospitals",
    href: "#clients",
    description:
      "Hospitals Onboarded With Us",
  },
  {
    title: "AI Patient Response",
    href: "#features",
    description:
      "AI which can suggest the best possible response to the patient's queries.",
  },
  {
    title: "Progress",
    href: "#bentotwo",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    description:
      "document that explains how an organization handles any customer, client or employee information gathered in its operations.",
  },
  
]

export function NavigationMenuNew() {
  return (
    <div className="w-full flex fixed justify-between z-50 md:px-10 bg-transparent backdrop-blur-lg">
      <div className="flex justify-between items-center gap-4 logo bg-transparent px-6 py-3 rounded-full">
        <HoveredLink href="/">
          <img src={'/HealersHealthcareOfficialLogo.png'} alt="Healers Healthcare" className="w-40 mx-auto" />
        </HoveredLink>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block py-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Healer Healthcare
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Great Things Are Being Develop By Our Incredible Team
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ScrollTo to="ytLinks" >

                  <ListItem title="Introduction">
                    Know About Our Breif and Story
                  </ListItem>
                  </ScrollTo>
                  <ScrollTo to="clients" >

                  <ListItem  title="Onboards">
                    Get To Know About Our Clients
                  </ListItem>
                  </ScrollTo>
                  <ScrollTo to="downloadMobileApp" >

                  <ListItem  title="Mobile Application">
                    Get Our Mobile Application 
                  </ListItem>
                  </ScrollTo>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ScrollTo to="features">Features</ScrollTo>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ScrollTo to="faq">FAQ</ScrollTo>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ScrollTo to="contactUs">Contact Us</ScrollTo>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden py-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-lg font-semibold">
                Home
              </Link>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="getting-started">
                  <AccordionTrigger>Getting Started</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      <Link to="/docs" className="text-sm">
                        Introduction
                      </Link>
                      <Link to="/docs/installation" className="text-sm">
                        Installation
                      </Link>
                      <Link to="/docs/primitives/typography" className="text-sm">
                        Typography
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="components">
                  <AccordionTrigger>Components</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      {components.map((component) => (
                        <Link key={component.title} to={component.href} className="text-sm">
                          {component.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <ScrollTo to="features" >
                Features
              </ScrollTo>
              <ScrollTo to="faq" >
                FAQ
              </ScrollTo>
              <ScrollTo to="contactUs">
                Contact Us
              </ScrollTo>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="connectWalletSection flex justify-between items-center rounded-full gap-5">
        <ModeToggle />
        <MetaMaskLogo />
        <Link to="/login">
          <button className="relative inline-flex h-12 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:-translate-y-1 transition duration-400">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Connect Wallet
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"