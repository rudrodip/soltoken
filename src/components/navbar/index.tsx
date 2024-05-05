import { ThemeToggler } from "@/components/theme/theme-toggler";
import { icons } from "@/components/icons";
import { siteConfig } from "@/config/site.config";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  return (
    <nav className="w-full py-2 px-3 border-b">
      <div className="w-full mx-auto max-w-3xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <icons.logo width={24} height={24} className="m-1" />
          <h1 className="text-lg font-bold">{siteConfig.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <WalletMultiButton style={{ height: "36px", padding: "10px"  }} />
          <ThemeToggler />
        </div>
      </div>
    </nav>
  );
}
