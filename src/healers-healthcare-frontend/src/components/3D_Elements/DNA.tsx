"use client"

import React, { useEffect, useState } from "react"
import Spline from "@splinetool/react-spline"
import { useTheme } from "../ThemeProvider/theme-provider"

// ErrorBoundary component (unchanged)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong with the 3D scene. Please try refreshing the page.</h2>
    }

    return this.props.children
  }
}

export default function DNA() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-screen">
        {theme === "dark" ? (
          <Spline
            id="darkDna"
            scene="https://prod.spline.design/c1XepuiX8cYvQIfO/scene.splinecode"
          />
        ) : (
          <Spline
            id="lightDna"
            scene="https://prod.spline.design/ifBvrRPuCxfvHzWi/scene.splinecode"
          />
        )}
      </div>
    </ErrorBoundary>
  )
}