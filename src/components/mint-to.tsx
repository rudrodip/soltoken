import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
} from "@solana/spl-token";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const mintToSchema = z.object({
  mint: z.string().min(1),
  recipient: z.string().min(1),
  amount: z.coerce.number().min(1),
});

export default function MintTo() {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [balance, setBalance] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const form = useForm<z.infer<typeof mintToSchema>>({
    resolver: zodResolver(mintToSchema),
    defaultValues: {
      mint: "",
      recipient: publicKey?.toBase58(),
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof mintToSchema>) {
    if (!publicKey || !connection) {
      toast.error("Wallet not connected");
      return;
    }

    const transaction = new web3.Transaction();
    const recipientPublicKey = new web3.PublicKey(values.recipient);
    const mint = new web3.PublicKey(values.mint);
    const amount = values.amount;

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      recipientPublicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    transaction.add(
      createMintToInstruction(
        mint,
        associatedToken,
        publicKey,
        amount
      )
    );

    try {
      const txSig = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(txSig, "confirmed");
      setTxSig(txSig);
      setTokenAccount(associatedToken.toString());

      const account = await getAccount(connection, associatedToken);
      setBalance(account.amount.toString());
    } catch (error) {
      console.error(error);
      toast.error("Failed to create token account");
    }
  }

  return (
    <div className="w-full space-y-2">
      <h1 className="text-lg">Mint to</h1>
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
                <FormDescription>
                  Enter the mint address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the address of the recipient
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Enter amount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Mint</Button>
        </form>
      </Form>
      {balance && <p className="text-sm">Token balance: {balance}</p>}
      {txSig && <p className="text-sm">Token account: {tokenAccount}</p>}
      {txSig && <p className="text-sm">View your <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" className="underline">transaction</a></p>}
    </div>
  );
}
