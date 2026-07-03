import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import rawData from "../data/falabak-data.json";
import type { FalaBakData } from "../types/data";

const data = rawData as FalaBakData;

interface CoinContextValue {
  balance: number;
  /** Tries to deduct `amount`. Returns false (and leaves balance untouched) if insufficient. */
  spend: (amount: number) => boolean;
}

const CoinContext = createContext<CoinContextValue | null>(null);

export function CoinProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(data.user.coinBalance);

  const spend = useCallback(
    (amount: number) => {
      if (balance < amount) return false;
      setBalance((prev) => prev - amount);
      return true;
    },
    [balance]
  );

  const value = useMemo(() => ({ balance, spend }), [balance, spend]);

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
}

export function useCoin() {
  const ctx = useContext(CoinContext);
  if (!ctx) {
    throw new Error("useCoin must be used within a CoinProvider");
  }
  return ctx;
}