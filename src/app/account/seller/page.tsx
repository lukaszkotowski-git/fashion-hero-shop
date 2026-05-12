"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { usePromotion, PLANS, type PremiumPlan } from "@/components/promotion-provider";
import { products } from "@/data/products";
import type { Product } from "@/types";

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function EmptyProducts() {
  return (
    <div className="py-10 text-center text-warm-gray text-sm">
      <p className="mb-1">Brak produktów do wyświetlenia.</p>
      <p className="text-[12px]">Dodaj produkty do swojego sklepu, aby móc je promować.</p>
    </div>
  );
}

export default function SellerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { isPremium, activePlan, promotedProductIds, isPurchasing, buyPremium, togglePromotion } =
    usePromotion();

  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>("bestseller");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [prevPurchasing, setPrevPurchasing] = useState(false);

  useEffect(() => {
    if (!user) router.push("/account/login");
  }, [user, router]);

  useEffect(() => {
    if (prevPurchasing && !isPurchasing && isPremium) {
      setPaymentSuccess(true);
      const t = setTimeout(() => setPaymentSuccess(false), 4000);
      return () => clearTimeout(t);
    }
    setPrevPurchasing(isPurchasing);
  }, [isPurchasing, isPremium, prevPurchasing]);

  if (!user) return null;

  const sellerProducts: Product[] = products;
  const activePlanConfig = PLANS.find((p) => p.id === activePlan);
  const maxPromoted = activePlanConfig?.maxPromoted ?? 0;
  const promotedCount = promotedProductIds.length;
  const atLimit = isFinite(maxPromoted) && promotedCount >= maxPromoted;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Strona główna</Link>
        <span className="mx-1.5">/</span>
        <Link href="/account" className="hover:text-charcoal transition-colors">Konto</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Panel sprzedawcy</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2">Panel sprzedawcy</h1>
      <p className="text-[13px] text-warm-gray mb-10">
        Zarządzaj swoim planem i promuj produkty, aby dotrzeć do większej liczby kupujących.
      </p>

      {/* Active plan banner */}
      {isPremium && activePlanConfig && (
        <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-lg mb-10">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-amber-900">
              Pakiet {activePlanConfig.name} aktywny — {activePlanConfig.price} zł / mies.
            </p>
            <p className="text-[12px] text-amber-700 mt-0.5">
              Wykorzystano {promotedCount} z{" "}
              {isFinite(maxPromoted) ? maxPromoted : "∞"} możliwych promocji.
            </p>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-[12px] text-green-800 text-center">
          ✓ Płatność zakończona sukcesem! Pakiet {activePlanConfig?.name} jest teraz aktywny.
        </div>
      )}

      {/* Plan selection */}
      <section className="mb-10">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-5 pb-2 border-b border-black/10">
          {isPremium ? "Zmień plan" : "Wybierz pakiet Premium"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isActive = activePlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                disabled={isPurchasing}
                className={[
                  "relative text-left p-5 border-2 rounded-lg transition-all duration-150",
                  isSelected
                    ? "border-charcoal bg-white shadow-md"
                    : "border-black/15 bg-cream-light hover:border-black/30",
                  isPurchasing ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    Aktywny
                  </span>
                )}
                <p className="text-[13px] font-semibold text-charcoal mb-0.5">{plan.name}</p>
                <p className="text-[22px] font-light text-charcoal leading-tight">
                  {plan.price} <span className="text-[13px] text-warm-gray font-normal">zł / mies.</span>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-charcoal/75">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                {isSelected && (
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-charcoal" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => buyPremium(selectedPlan)}
          disabled={isPurchasing || activePlan === selectedPlan}
          className="w-full flex items-center justify-center gap-2 bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.5px] py-3 px-6 hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPurchasing ? (
            <>
              <Spinner />
              <span>Przetwarzanie płatności…</span>
            </>
          ) : activePlan === selectedPlan ? (
            `Pakiet ${PLANS.find((p) => p.id === selectedPlan)?.name} jest już aktywny`
          ) : (
            `Kup pakiet ${PLANS.find((p) => p.id === selectedPlan)?.name} — ${PLANS.find((p) => p.id === selectedPlan)?.price} zł`
          )}
        </button>
        <p className="mt-2 text-[10px] text-warm-gray text-center">
          Symulacja bramki płatności — żadne dane karty nie są wymagane
        </p>
      </section>

      {/* Product promotion section */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Promowane produkty
          </h2>
          {isPremium && (
            <span className="text-[11px] text-warm-gray">
              {promotedCount}{isFinite(maxPromoted) ? ` / ${maxPromoted}` : ""} aktywnych
            </span>
          )}
        </div>

        {!isPremium ? (
          <div className="py-8 text-center text-warm-gray">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-[13px] mb-1">Wymagany pakiet Premium</p>
            <p className="text-[12px]">Kup jeden z pakietów Premium, aby móc wybierać produkty do promowania.</p>
          </div>
        ) : sellerProducts.length === 0 ? (
          <EmptyProducts />
        ) : (
          <>
            {atLimit && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-[12px] text-amber-800">
                Osiągnięto limit {maxPromoted} promowanych produktów dla pakietu {activePlanConfig?.name}. Odznacz produkt lub zmień plan na wyższy.
              </div>
            )}
            <div className="space-y-0">
              {sellerProducts.map((product) => {
                const isPromoted = promotedProductIds.includes(product.id);
                const disabled = !isPromoted && atLimit;
                return (
                  <label
                    key={product.id}
                    className={[
                      "flex items-center gap-4 py-3 border-b border-black/5 px-2 -mx-2 rounded transition-colors",
                      disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-cream-light/50",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={isPromoted}
                      disabled={disabled}
                      onChange={() => togglePromotion(product.id)}
                      className="w-4 h-4 accent-charcoal flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-charcoal truncate">{product.name}</p>
                      <p className="text-[11px] text-warm-gray">{product.price} zł</p>
                    </div>
                    {isPromoted && (
                      <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider bg-amber-400 text-amber-900 px-2 py-0.5">
                        Promowany
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
