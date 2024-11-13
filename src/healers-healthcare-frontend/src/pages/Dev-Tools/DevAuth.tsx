'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Principal } from '@dfinity/principal'
import { Toggle } from "@/components/ui/toggle"
import { Mail, Lock, User, X, Building2, Users, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useInternetIdentity } from 'ic-use-internet-identity'
import { Actor, HttpAgent } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'
import { idlFactory } from '../../../../declarations/parent_canister/parent_canister.did.js'
import { _SERVICE } from '../../../../declarations/parent_canister/parent_canister.did.js'
import { ActorSubclass } from '@dfinity/agent'
import { ethers } from 'ethers'

import Spinner from "../../Spinner.js"
import { twMerge } from "tailwind-merge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

function SignupButton() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState('')
  const [walletId, setWalletId] = useState('')
  const [userType, setUserType] = useState('hospital')
  const [isLoading, setIsLoading] = useState(false)
  const [authClient, setAuthClient] = useState<AuthClient | null>(null)
  const [parentActor, setParentActor] = useState<ActorSubclass<_SERVICE> | null>(null)
  const [hospitalNames, setHospitalNames] = useState<string[]>([])
  const [selectedHospital, setSelectedHospital] = useState('')
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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 }
  }

  // MetaMask functions
  // const connectToMetaMask = async () => {
  //   setIsConnecting(true)
  //   setError("")

  //   try {
  //     if (window.ethereum) {
  //       const provider = new ethers.BrowserProvider(window.ethereum)
  //       const accounts = await provider.send("eth_requestAccounts", [])
  //       if (accounts.length > 0) {
  //         const address = accounts[0]
  //         setEthAddress(address)
  //         setIsConnected(true)
  //         setConnectedWallet('MetaMask')
  //         setWalletId(address)
  //       } else {
  //         throw new Error("No accounts found")
  //       }
  //     } else {
  //       throw new Error("MetaMask is not installed")
  //     }
  //   } catch (err) {
  //     setError("Failed to connect to MetaMask. Please try again.")
  //     console.error(err)
  //   } finally {
  //     setIsConnecting(false)
  //     setShowWalletPopup(false)
  //   }
  // }

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#3c95d4] to-[#0b0245] flex flex-col lg:flex-row justify-center items-center">
      {/* Left half - gradient placeholder (hidden on mobile and tablet) */}
      <img src='HealersHealthcareOfficialLogo.png' alt='LoginImg' className="hidden lg:flex m-5 rounded-lg lg:w-1/2 size-80" >

        {/* You can replace this div with an actual image when available */}
      </img>

      {/* Right half - login form */}
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
          <div className="mb-8 flex justify-center">
            <Toggle
              pressed={isLogin}
              onPressedChange={setIsLogin}
              className="w-48 h-12 bg-transparent backdrop-blur border border-white/20 rounded-full"
            >
              <div className="grid grid-cols-2 w-full h-full">
                <div className={`flex items-center justify-center ${isLogin ? 'text-white' : 'text-gray-400'}`}>Login</div>
                <div className={`flex items-center justify-center ${!isLogin ? 'text-white' : 'text-gray-400'}`}>Signup</div>
              </div>
            </Toggle>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-transparent backdrop-blur-md border-white/20 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-center text-gray-200 mb-6">
                  {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started'}
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
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
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
                            transition={{ duration: 0.3 }}
                          >
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-gray-200">
                                {userType === 'hospital' ? 'Hospital Name' : 'Admin Name'}
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder={userType === 'hospital' ? 'Hospital Name' : 'Admin Name'}
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                      {!isLogin && userType === 'admin' && (
                        <div className="space-y-2">
                          <Label htmlFor="hospital" className="text-gray-200">Select Hospital</Label>
                          <Select onValueChange={setSelectedHospital} value={selectedHospital}>
                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
                      <Button type="submit" className="w-full bg-white text-cyan-600 hover:bg-gray-100 transition-colors duration-200">
                        {isLogin ? 'Login' : 'Sign Up'}
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
              <CardFooter>
                <p className="text-center text-sm text-gray-300 w-full">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-white font-semibold hover:underline focus:outline-none"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </CardFooter>
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
  )

}
export default SignupButton;

function getHost(): string | undefined {
  throw new Error('Function not implemented.')
}
