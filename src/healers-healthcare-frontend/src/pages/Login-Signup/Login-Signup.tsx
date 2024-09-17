'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Toggle } from "../../components/ui/toggle"
import { Mail, Lock, User } from 'lucide-react'
import React from 'react'

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin && email === 'healers@gmail.com' && password === 'healthcare') {
      navigate('/dashboard')
    } else {
      alert(isLogin ? 'Invalid credentials' : 'Signup functionality not implemented')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Toggle
            pressed={isLogin}
            onPressedChange={setIsLogin}
            className="w-48 h-12 bg-gray-800 rounded-full"
          >
            <div className="grid grid-cols-2 w-full h-full">
              <div className={`flex items-center justify-center ${isLogin ? 'text-white' : 'text-gray-400'}`}>Login</div>
              <div className={`flex items-center justify-center ${!isLogin ? 'text-white' : 'text-gray-400'}`}>Signup</div>
            </div>
          </Toggle>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-950 text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-gray-400 w-full">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white hover:underline focus:outline-none"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}