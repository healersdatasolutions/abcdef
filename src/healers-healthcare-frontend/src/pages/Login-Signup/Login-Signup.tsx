'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useNavigate } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Principal } from '@dfinity/principal';
import { Toggle } from "../../components/ui/toggle"
import { Mail, Lock, User, X, Building2, Users, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import React from 'react'
import { useInternetIdentity } from 'ic-use-internet-identity'
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import { idlFactory } from '../../../../declarations/parent_canister/parent_canister.did.js';
import { _SERVICE } from '../../../../declarations/parent_canister/parent_canister.did';
import { ActorSubclass } from '@dfinity/agent';
import { ethers } from 'ethers'
// import PlugConnect from '@psychedelic/plug-connect'
//import { healers_healthcare_backend, canisterId as healthcareCanisterId } from '../../../../declarations/healers-healthcare-backend'

import Spinner from "../../Spinner"
import { twMerge } from "tailwind-merge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider
    ic?: {
      plug: {
        principalId: string
        accountId: string
        createActor: (options: { canisterId: string; interfaceFactory: any }) => Promise<any>
      }
    }
  }
}

type Result = {
  ok?: string;
  err?: string;
};


export default function LoginButton() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState('')
  const [walletId, setWalletId] = useState('')
  const [userType, setUserType] = useState('hospital')
  const [isLoading, setIsLoading] = useState(false)
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [parentActor, setParentActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [hospitalNames, setHospitalNames] = useState<string[]>([])
  const [selectedHospital, setSelectedHospital] = useState('')
  // MetaMask states
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [ethAddress, setEthAddress] = useState("")
  const [error, setError] = useState("")

  // Internet Identity states
  const { isLoggingIn, login, clear, identity } = useInternetIdentity()

  // Plug Wallet states
  const [isPlugConnected, setIsPlugConnected] = useState(false)
  const [plugPrincipal, setPlugPrincipal] = useState('')
  const [plugAccountId, setPlugAccountId] = useState('')
  
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
        //// await agent.fetchRootKey()
        const actor = Actor.createActor<_SERVICE>(idlFactory as unknown as InterfaceFactory, {
          agent,
          canisterId: 'uh4ji-xiaaa-aaaap-qkk7q-cai'
        });
        setParentActor(actor)

        // Fetch hospital names
        const hospitals = await actor.listHospitals()
        setHospitalNames(hospitals.map(([name, _]) => name))
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
      if (isLogin) {
        let canisterIdOpt;
      
        // Temporary bypass for login
        const bypassLogin = false;  // Set this to 'false' in production
      
        if (bypassLogin) {
          // Hardcode values for testing
          canisterIdOpt = ['grnch-ciaaa-aaaap-qkfqq-cai'];  // Replace with your test canister ID
          const userType = 'admin';  // Or 'user', depending on your test case
          console.log('Bypassing login. Using test values.');
        } else {
          if (userType === 'admin') {
            canisterIdOpt = await parentActor.loginAdmin(email, password);
            console.log('Admin Login response:', canisterIdOpt);
          } else {
            canisterIdOpt = await parentActor.loginUser(email, password);
            console.log('User Login response:', canisterIdOpt);
          }
        }
      
        if (canisterIdOpt && canisterIdOpt.length > 0) {
          const principal = canisterIdOpt[0] as unknown as Principal;
          const canisterId = principal.toString();
          console.log('Canister ID:', canisterId);
          localStorage.setItem('hospitalCanisterId', canisterId);
          localStorage.setItem('userType', userType);
          navigate('/dashboard');  // This is where the routing happens after authentication
        } else {
          throw new Error('Invalid login credentials');
        }
      
      
      } else if (userType === 'hospital') {
        const result:string = await parentActor.registerHospital(name, email, password)
        console.log('Hospital Registration result:', result)
        
        if (result.includes("Hospital registered and canister created with ID:")) {
          const canisterId = result.split("ID: ")[1]
          alert(`Hospital registered successfully. Canister ID: ${canisterId}`)
          setIsLogin(true)
        } else {
          throw new Error(`Failed to register hospital: ${result}`)
        }
      } else if (userType === 'admin') {
        if (!selectedHospital) {
          throw new Error('Please select a hospital')
        }
        const result:string = await parentActor.registerAdmin(name, email, password, selectedHospital)
        console.log('Admin Registration result:', result)
        
        if (result === "Admin registered successfully") {
          alert('Admin registered successfully')
          setIsLogin(true)
        } else {
          throw new Error(`Failed to register admin: ${result}`)
        }
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Registration error:', error)
      setError(`An error occurred during ${isLogin ? 'login' : 'registration'}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeChange = (type: string) => {
    setIsLoading(true)
    setUserType(type)
    setTimeout(() => setIsLoading(false), 500) // Simulating loading effect
  }

  const formVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }

  // MetaMask functions
  const connectToMetaMask = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        if (accounts.length > 0) {
          const address = accounts[0]
          setEthAddress(address)
          setIsConnected(true)
          setConnectedWallet('MetaMask')
          setWalletId(address)
        } else {
          throw new Error("No accounts found")
        }
      } else {
        throw new Error("MetaMask is not installed")
      }
    } catch (err) {
      setError("Failed to connect to MetaMask. Please try again.")
      console.error(err)
    } finally {
      setIsConnecting(false)
      setShowWalletPopup(false)
    }
  }

  // Internet Identity functions
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

  // Plug Wallet functions
  

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      {walletId && (
        <div className="absolute top-4 right-4  text-white p-2 rounded flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-green-400 rounded-full"></div>
          <p>Connected Wallet:</p> <p>{walletId.slice(0, 6)}...{walletId.slice(-4)}</p>
        </div>
      )}
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
              <div className="mt-4 flex justify-center">
                <Toggle
                  pressed={userType === 'hospital'}
                  onPressedChange={() => handleUserTypeChange('hospital')}
                  className="w-1/3 h-12 bg-gray-800 rounded-l-full"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 size={18} />
                    <span>Hospital</span>
                  </div>
                </Toggle>
                <Toggle
                  pressed={userType === 'general'}
                  onPressedChange={() => handleUserTypeChange('general')}
                  className="w-1/3 h-12 bg-gray-800"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users size={18} />
                    <span>General</span>
                  </div>
                </Toggle>
                <Toggle
                  pressed={userType === 'admin'}
                  onPressedChange={() => handleUserTypeChange('admin')}
                  className="w-1/3 h-12 bg-gray-800 rounded-r-full"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShieldCheck size={18} />
                    <span>Admin</span>
                  </div>
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
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </motion.div>
                ) : (
                  <motion.form
                    key={userType}
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <AnimatePresence mode="wait">
                    {!isLogin && (userType === 'hospital' || userType === 'admin') && (
  <motion.div
    key="name"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="space-y-2">
      <Label htmlFor="name" className="text-gray-200">
        {userType === 'hospital' ? 'Hospital Name' : 'Admin Name'}
      </Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input
          id="name"
          type="text"
          placeholder={userType === 'hospital' ? 'Hospital Name' : 'Admin Name'}
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
                    {!isLogin && userType === 'admin' && (
                      <div className="space-y-2">
                        <Label htmlFor="hospital" className="text-gray-200">Select Hospital</Label>
                        <Select onValueChange={setSelectedHospital} value={selectedHospital}>
                          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select a hospital" />
                          </SelectTrigger>
                          <SelectContent>
                            {hospitalNames.map((hospital) => (
                              <SelectItem key={hospital} value={hospital}>
                                {hospital}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                      {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                    
                    {error && (
                      <div className="text-red-500 text-sm mt-2">
                        {error}
                      </div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
              <div className="mt-4 text-center">
                <span className="text-gray-400">or</span>
              </div>
              
              <Button
                onClick={() => setShowWalletPopup(true)}
                className="w-full mt-4 bg-transparent-600 border text-white hover:bg-black hover:border-white"
                disabled={!!connectedWallet}
              >
                {connectedWallet ? "Connected" : "Connect with Internet Identity"}
              </Button>
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
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="bg-gray-950 text-white border-gray-800 w-96">
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
                  "w-full flex items-center justify-center space-x-2 hover:scale-95 transition duration-300",
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
        </div>
      )}
    </div>
  )
}

function getHost(): string | undefined {
  throw new Error('Function not implemented.')
}
