import WalletBalance from "@/components/wallet-balance";
import CreateMint from "@/components/create-mint";
import CreateTokenAccount from "@/components/create-token-account";
import MintTo from "@/components/mint-to";
import { siteConfig } from "@/config/site.config";

export default function App() {
  return (
    <main className="app space-y-12 px-1 md:px-0">
      <h1 className="head-text solana-gradient">SolToken</h1>
      <section className="w-full max-w-xl space-y-12 border-l-4 pl-4">
        <WalletBalance />
        <CreateMint />
        <CreateTokenAccount />
        <MintTo />
      </section>
      <footer className="w-full max-w-xl pl-4 my-12 flex items-center gap-12 text-sm">
        <a href={siteConfig.links.twitter} target="_blank" className="underline">Twitter</a>
        <a href={siteConfig.links.github} target="_blank" className="underline">Github</a>
      </footer>
    </main>
  );
}