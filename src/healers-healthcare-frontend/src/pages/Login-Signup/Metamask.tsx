'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider
  }
}

export default function MetaMaskAuth() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [ethAddress, setEthAddress] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true)
    }
  }, [])

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
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>MetaMask Authentication</CardTitle>
        <CardDescription>Connect your MetaMask wallet to authenticate</CardDescription>
      </CardHeader>
      <CardContent>
        {!isMetaMaskInstalled ? (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle size={20} />
            <p>MetaMask is not installed. Please install it to continue.</p>
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 size={20} />
              <p>Connected to MetaMask</p>
            </div>
            <p className="text-sm">Your Ethereum address:</p>
            <code className="block bg-muted p-2 rounded">{ethAddress}</code>
          </div>
        ) : (
          <Button 
            onClick={connectToMetaMask} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect to MetaMask"}
          </Button>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}