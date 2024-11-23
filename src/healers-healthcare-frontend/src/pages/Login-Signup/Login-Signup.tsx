'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { Principal } from '@dfinity/principal'
import { Mail, Lock, Building2, Users, ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useInternetIdentity } from 'ic-use-internet-identity'
import { Actor, HttpAgent } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { idlFactory } from '../../../../declarations/parent_canister/parent_canister.did.js'
import { _SERVICE } from '../../../../declarations/parent_canister/parent_canister.did'
import { ActorSubclass } from '@dfinity/agent'

import Spinner from "../../Spinner"
import { twMerge } from "tailwind-merge"

export default function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('hospital')
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState('')
  const [walletId, setWalletId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authClient, setAuthClient] = useState<AuthClient | null>(null)
  const [parentActor, setParentActor] = useState<ActorSubclass<_SERVICE> | null>(null)
  const [error, setError] = useState("")

  const { isLoggingIn, login, clear, identity } = useInternetIdentity()
  
  const navigate = useNavigate()

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create()
        setAuthClient(client)
  
        const agent = new HttpAgent({ 
          host: 'https://ic0.app',
          fetch: (url, options) => {
            return fetch(url, { ...options, credentials: 'same-origin' })
          }
        })
        const actor = Actor.createActor<_SERVICE>(idlFactory as unknown as InterfaceFactory, {
          agent,
          canisterId: 'uh4ji-xiaaa-aaaap-qkk7q-cai'
        });
        setParentActor(actor)
      } catch (error) {
        console.error('Failed to initialize parentActor:', error)
        setError('Failed to connect to the Internet Computer. Please try again.')
      }
    }
  
    initAuthClient()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!parentActor) {
      console.error('parentActor is not initialized')
      setError('The system is still loading. Please try again in a moment.')
      setIsLoading(false)
      return
    }

    try {
      let canisterIdOpt;
      
      if (userType === 'admin') {
        canisterIdOpt = await parentActor.loginAdmin(email, password);
        console.log('Admin Login response:', canisterIdOpt);
      } else {
        canisterIdOpt = await parentActor.loginUser(email, password);
        console.log('User Login response:', canisterIdOpt);
      }
      
      if (canisterIdOpt && canisterIdOpt.length > 0) {
        const principal = canisterIdOpt[0] as unknown as Principal;
        const canisterId = principal.toString();
        console.log('Canister ID:', canisterId);
        localStorage.setItem('hospitalCanisterId', canisterId);
        localStorage.setItem('userType', userType);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(`An error occurred during login: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeChange = (type: string) => {
    setIsLoading(true)
    setUserType(type)
    setTimeout(() => setIsLoading(false), 500) // Simulating loading effect
  }

  function handleInternetIdentityClick() {
    if (identity) {
      clear()
      setConnectedWallet('')
      setWalletId('')
    } else {
      login()
    }
  }

  useEffect(() => {
    if (identity) {
      setConnectedWallet('Internet Identity')
      setWalletId(identity.getPrincipal().toString())
    }
  }, [identity])

  return (
    <div className='bg-gradient-to-br from-black via-[#3c95d4] to-[#0b0245] '>

    <div className="min-h-screen max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-center items-center">
      <img src='HealersHealthcareOfficialLogo.png' alt='LoginImg' className="hidden lg:flex m-5 rounded-lg lg:w-1/2 size-80" />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative">
        {walletId && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white p-3 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm">Connected: {walletId.slice(0, 6)}...{walletId.slice(-4)}</p>
          </motion.div>
        )}
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-transparent backdrop-blur-md border-white/20 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center text-gray-200 mb-6">
                  Enter your credentials to access your account
                </CardDescription>
                <div className="flex justify-center space-x-2 mb-6">
                  <Toggle
                    pressed={userType === 'hospital'}
                    onPressedChange={() => handleUserTypeChange('hospital')}
                    className="bg-white/5 hover:bg-white/10 data-[state=on]:bg-white/20 rounded-full px-4 py-2 transition-all duration-200"
                  >
                    <Building2 size={18} className="mr-2" />
                    Hospital
                  </Toggle>
                  <Toggle
                    pressed={userType === 'general'}
                    onPressedChange={() => handleUserTypeChange('general')}
                    className="bg-white/5 hover:bg-white/10 data-[state=on]:bg-white/20 rounded-full px-4 py-2 transition-all duration-200"
                  >
                    <Users size={18} className="mr-2" />
                    General
                  </Toggle>
                  <Toggle
                    pressed={userType === 'admin'}
                    onPressedChange={() => handleUserTypeChange('admin')}
                    className="bg-white/5 hover:bg-white/10 data-[state=on]:bg-white/20 rounded-full px-4 py-2 transition-all duration-200"
                  >
                    <ShieldCheck size={18} className="mr-2" />
                    Admin
                  </Toggle>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center items-center h-48"
                    >
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={userType}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-200 focus:ring-2 focus:ring-white/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-200">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-white text-cyan-600 hover:bg-gray-100 transition-colors duration-200">
                        Login
                      </Button>
                      
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-red-400 text-sm mt-2"
                        >
                          <AlertCircle size={16} />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
                <div className="mt-6 text-center">
                  <span className="text-gray-300">or</span>
                </div>
                
                <Button
                  onClick={() => setShowWalletPopup(true)}
                  className="w-full mt-4 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
                  disabled={!!connectedWallet}
                >
                  {connectedWallet ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle2 size={18} className="mr-2" />
                      Connected
                    </span>
                  ) : (
                    "Connect with Internet Identity"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      {showWalletPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        >
          <Card className="bg-gray-900 text-white border-gray-700 w-96">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Connect Wallet</CardTitle>
              <button
                onClick={() => setShowWalletPopup(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white hover:scale-95 transition duration-300"
              >
                <X size={24} />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <Button
                onClick={handleInternetIdentityClick}
                disabled={isLoggingIn}
                className={twMerge(
                  "w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors duration-200",
                  isLoggingIn ? "cursor-wait" : "cursor-pointer"
                )}
              >
                <img src="identity.png" alt="Internet Identity" className="w-6 h-6" />
                <span>
                  {identity
                    ? "Logout"
                    : isLoggingIn
                    ? <>
                        Logging in
                        <Spinner className="w-4 h-4 ml-2" />
                      </>
                    : "Connect with Internet Identity"
                  }
                </span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
    </div>
  )
}