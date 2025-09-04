import { Search, Bell, HelpCircle, Sparkles, Coins } from "lucide-react";
import { useTokens } from "@/context/TokensContext";

function TokenWallet() {
  const { tokens } = useTokens();
  return (
    <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm">
      <Coins className="h-4 w-4 text-amber-500" />
      <span className="tabular-nums">{tokens}</span>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="h-14 flex items-center gap-3 px-4">
        <div className="flex-1 max-w-xl">
          <label className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full h-9 rounded-2xl border bg-secondary/50 px-9 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search"
            />
          </label>
        </div>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
          For Teams
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Upgrade
        </a>
        <TokenWallet />
        <button className="p-2 rounded-full hover:bg-secondary">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-sm font-bold">
          S
        </div>
      </div>
    </header>
  );
}
