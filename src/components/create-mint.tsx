import { Button } from "@/components/ui/button"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { toast } from "sonner"
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function CreateMint() {
  const [loading, setLoading] = useState(false)
  const [mint, setMint] = useState("")
  const [transactionSignature, setTransactionSignature] = useState("")
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const createMintHandler = async () => {
    setLoading(true)
    if (!publicKey || !connection) {
      toast.error("Connect your wallet to create a mint")
      return
    }

    const mint = web3.Keypair.generate()
    const lamports = await getMinimumBalanceForRentExemptMint(connection)
    console.log(lamports / web3.LAMPORTS_PER_SOL)
    const transaction = new web3.Transaction()

    transaction.add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID
      )
    )

    try {
      const signature = await sendTransaction(transaction, connection, {
        signers: [mint],
      })
      setMint(mint.publicKey.toBase58())
      setTransactionSignature(signature)
      toast.success("Mint created") 
    } catch (error) {
      toast.error("Error creating mint")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="text-sm space-y-1">
      <Button onClick={createMintHandler} className="flex items-center gap-1 mb-2">
        {loading && <LoaderCircle className="animate-spin" />}
        <span>{loading ? "Creating mint" : "Create mint"}</span>
      </Button>
      {mint && <p>Token mint address: {mint}</p>}
      {transactionSignature && <p>View your <a href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} target="_blank" className="underline">transaction</a></p>}
    </div>
  )
}