"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type PremiumPlan = "starter" | "bestseller" | "ultra";

export interface PlanConfig {
  id: PremiumPlan;
  name: string;
  price: number;
  maxPromoted: number;
  badge?: string;
  features: string[];
}

export const PLANS: PlanConfig[] = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    maxPromoted: 3,
    features: [
      "Do 3 promowanych produktów",
      'Badge "Promowany" na kartach',
      "Pozycje 1–3 w wynikach",
    ],
  },
  {
    id: "bestseller",
    name: "Best Seller",
    price: 499,
    maxPromoted: 10,
    badge: "Najpopularniejszy",
    features: [
      "Do 10 promowanych produktów",
      'Badge "Promowany" na kartach',
      "Pozycje 1–3 w wynikach",
      "Wyróżnienie w kategoriach",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    price: 799,
    maxPromoted: Infinity,
    features: [
      "Nieograniczona liczba promocji",
      'Badge "Promowany" na kartach',
      "Pozycje 1–3 w wynikach",
      "Wyróżnienie w kategoriach",
      "Priorytetowe wsparcie",
    ],
  },
];

interface PromotionContextValue {
  isPremium: boolean;
  activePlan: PremiumPlan | null;
  promotedProductIds: string[];
  isPurchasing: boolean;
  buyPremium: (plan: PremiumPlan) => Promise<void>;
  togglePromotion: (productId: string) => void;
}

const PromotionContext = createContext<PromotionContextValue | null>(null);

const STORAGE_KEY_PLAN = "fashionhero_premium_plan";
const STORAGE_KEY_PROMOTED = "fashionhero_promoted_products";

export function PromotionProvider({ children }: { children: React.ReactNode }) {
  const [activePlan, setActivePlan] = useState<PremiumPlan | null>(null);
  const [promotedProductIds, setPromotedProductIds] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(STORAGE_KEY_PLAN) as PremiumPlan | null;
      if (storedPlan) setActivePlan(storedPlan);
      const stored = localStorage.getItem(STORAGE_KEY_PROMOTED);
      if (stored) setPromotedProductIds(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const buyPremium = useCallback(async (plan: PremiumPlan) => {
    setIsPurchasing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    localStorage.setItem(STORAGE_KEY_PLAN, plan);
    setActivePlan(plan);
    setIsPurchasing(false);
  }, []);

  const togglePromotion = useCallback(
    (productId: string) => {
      if (!activePlan) return;
      const planConfig = PLANS.find((p) => p.id === activePlan);
      setPromotedProductIds((prev) => {
        if (prev.includes(productId)) {
          const updated = prev.filter((id) => id !== productId);
          localStorage.setItem(STORAGE_KEY_PROMOTED, JSON.stringify(updated));
          return updated;
        }
        if (planConfig && prev.length >= planConfig.maxPromoted) return prev;
        const updated = [...prev, productId];
        localStorage.setItem(STORAGE_KEY_PROMOTED, JSON.stringify(updated));
        return updated;
      });
    },
    [activePlan]
  );

  return (
    <PromotionContext.Provider
      value={{
        isPremium: activePlan !== null,
        activePlan,
        promotedProductIds,
        isPurchasing,
        buyPremium,
        togglePromotion,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotion() {
  const ctx = useContext(PromotionContext);
  if (!ctx) throw new Error("usePromotion must be used within PromotionProvider");
  return ctx;
}
