import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const tokenCreationFormSchema = z.object({
  mint: z.string().min(1),
  accountOwner: z.string().min(1),
});

export default function CreateTokenAccount() {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const form = useForm<z.infer<typeof tokenCreationFormSchema>>({
    resolver: zodResolver(tokenCreationFormSchema),
    defaultValues: {
      mint: "",
      accountOwner: publicKey?.toBase58(),
    },
  });

  async function onSubmit(values: z.infer<typeof tokenCreationFormSchema>) {
    if (!publicKey || !connection) {
      toast.error("Wallet not connected");
      return;
    }

    const transaction = new web3.Transaction();
    const owner = new web3.PublicKey(values.accountOwner);
    const mint = new web3.PublicKey(values.mint);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );

    try {
      const txSig = await sendTransaction(transaction, connection);
      setTxSig(txSig);
      setTokenAccount(associatedToken.toString());
    } catch (error) {
      console.error(error);
      toast.error("Failed to create token account");
    }
  }

  return (
    <div className="w-full space-y-2">
      <h1 className="text-lg">Create Token Account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-lg">
          <FormField
            control={form.control}
            name="mint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token mint</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token account owner</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create token account</Button>
        </form>
      </Form>
      {txSig && <p className="text-sm">Token account: {tokenAccount}</p>}
      {txSig && <p className="text-sm">View your <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" className="underline">transaction</a></p>}
    </div>
  );
}
