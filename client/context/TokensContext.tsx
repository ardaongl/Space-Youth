import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface TokensContextValue {
  tokens: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  resetTokens: () => void;
}

const TokensContext = createContext<TokensContextValue | undefined>(undefined);

const STORAGE_KEY = "ux_tokens_balance";

export function TokensProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<number>(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(tokens));
    } catch {}
  }, [tokens]);

  const value = useMemo<TokensContextValue>(
    () => ({
      tokens,
      addTokens: (amount) => setTokens((t) => Math.max(0, t + Math.max(0, Math.floor(amount)))),
      spendTokens: (amount) => {
        const a = Math.max(0, Math.floor(amount));
        let ok = false;
        setTokens((t) => {
          ok = t >= a;
          return ok ? t - a : t;
        });
        return ok;
      },
      resetTokens: () => setTokens(0),
    }),
    [tokens],
  );

  return <TokensContext.Provider value={value}>{children}</TokensContext.Provider>;
}

export function useTokens() {
  const ctx = useContext(TokensContext);
  if (!ctx) throw new Error("useTokens must be used within TokensProvider");
  return ctx;
}
