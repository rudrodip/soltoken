import { useWallet } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import { useState, useEffect } from "react"

export default function WalletBalance() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { publicKey } = useWallet()
  
  useEffect(() => {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
    if (!publicKey) return
    connection.getBalance(publicKey).then(balance => {
      setBalance(balance / web3.LAMPORTS_PER_SOL)
      setLoading(false)
    })
  }, [publicKey])

  return (
    <p>
      {
        !publicKey ? "Connect your wallet to see your balance" :
        loading ? "Loading..." :
        balance === null ? "Failed to load balance" :
        `Balance: ${balance} SOL`
      }
    </p>
  )
}