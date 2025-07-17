"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface PromoData {
  name: string;
  prices: { label: string; value: number }[];
  description: string;
  day: string;
  image: string;
  available: boolean;
}

const promoData: Record<string, PromoData> = {
  monday: {
    name: "MEGA COMBO",
    prices: [{ label: "", value: 5.99 }],
    description: "Hamburguesa de pollo con bacon + Papas",
    day: "TODOS LOS LUNES",
    image:
      "https://pub-b31207be229f4824971f6e8674928e73.r2.dev/promo-monday.png",
    available: true,
  },
  tuesday: {
    name: "MONCHI-PAPAS",
    prices: [{ label: "", value: 5.99 }],
    description: "Papas cargadas con queso, bacon y salsa especial",
    day: "TODOS LOS MARTES",
    image:
      "https://pub-b31207be229f4824971f6e8674928e73.r2.dev/promo-wednesdays.png",
    available: true,
  },
  wednesday: {
    name: "DOBLE CARNE",
    prices: [{ label: "", value: 4.99 }],
    description: "Hamburguesa doble carne",
    day: "TODOS LOS MIÉRCOLES",
    image: "https://pub-b31207be229f4824971f6e8674928e73.r2.dev/wednesday.PNG",
    available: true,
  },
};

export type { PromoData };

interface PromoBannerProps {
  onPromoClick: (promo: PromoData) => void;
  onPromoUnavailable: (nextDay: string) => void;
}

export default function PromoBanner({
  onPromoClick,
  onPromoUnavailable,
}: PromoBannerProps) {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [serverDay, setServerDay] = useState<number | null>(null);

  // Fetch server day on mount
  useEffect(() => {
    fetch("/api/promo-day")
      .then((res) => res.json())
      .then((data) => setServerDay(data.day))
      .catch(() => setServerDay(null));
  }, []);

  const promoKeys = Object.keys(promoData);
  const activePromo = promoData[promoKeys[currentPromoIndex]];

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promoKeys.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [promoKeys.length, isPaused]);

  // Check if current promo is available today (server-side)
  const isToday = () => {
    if (serverDay === null) return false;
    const currentKey = promoKeys[currentPromoIndex];
    return (
      (currentKey === "monday" && serverDay === 1) ||
      (currentKey === "wednesday" && serverDay === 3)
    );
  };

  const nextPromo = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoKeys.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevPromo = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPromoIndex(
        (prev) => (prev - 1 + promoKeys.length) % promoKeys.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  if (!activePromo) return null;

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 shadow-2xl border-4 border-white cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={(e) => {
          // Prevent main click logic if clicking on navigation or progress buttons
          const target = e.target as HTMLElement;
          if (
            target.closest(".promo-nav-arrow") ||
            target.closest(".promo-progress-indicator")
          ) {
            return;
          }
          if (isToday()) {
            onPromoClick(activePromo);
          } else {
            onPromoUnavailable(activePromo.day);
          }
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-10 translate-y-12 -translate-x-12"></div>

        {/* Diagonal stripes pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 w-full h-full"></div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevPromo}
          className="promo-nav-arrow absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextPromo}
          className="promo-nav-arrow absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Main content with transition */}
        <div
          className={`relative z-10 transition-all duration-600 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12">
            {/* Left side - Text content */}
            <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0 lg:pr-8">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-red-800 px-4 py-2 rounded-full font-black text-sm mb-4 shadow-lg">
                {isToday() ? (
                  <>
                    <Clock className="w-4 h-4" />
                    ¡DISPONIBLE HOY!
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    PRÓXIMA OFERTA
                  </>
                )}
              </div>

              {/* Main title */}
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-wider drop-shadow-2xl transform -rotate-1">
                {activePromo.name}
              </h2>

              {/* Description */}
              <p className="text-white text-lg lg:text-xl mb-6 font-semibold drop-shadow-lg">
                {activePromo.description}
              </p>

              {/* Price */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <span className="text-white text-2xl font-black drop-shadow-lg">
                  SÓLO
                </span>
                <div className="bg-yellow-400 text-red-800 px-6 py-3 rounded-2xl transform rotate-2 shadow-xl">
                  <span className="text-5xl lg:text-6xl font-black">
                    ${activePromo.prices[0].value.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Day indicator with decorative star */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Star className="w-8 h-8 text-yellow-400 fill-current drop-shadow-lg" />
                <span className="text-2xl lg:text-3xl font-black text-white tracking-wide drop-shadow-lg transform -rotate-1">
                  {activePromo.day}
                </span>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl opacity-30 scale-110"></div>

                <div className="relative bg-white p-2 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-1 rounded-xl">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <Image
                        src={activePromo.image || "/placeholder.svg"}
                        alt={activePromo.name}
                        width={300}
                        height={200}
                        className="w-full h-48 lg:w-80 lg:h-60 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="bg-white text-center py-4 border-t-4 border-yellow-400">
          <p className="text-red-700 font-black text-lg lg:text-xl tracking-wider">
            {activePromo.day.toUpperCase()} SOLO EN LUIGI'S
          </p>
        </div>

        {/* Corner accent */}
        <div className="absolute top-4 left-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-red-700 fill-current" />
          </div>
        </div>

        {/* Progress indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {promoKeys.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentPromoIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`promo-progress-indicator w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPromoIndex
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Auto-rotation pause indicator */}
        {isPaused && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
            Pausado
          </div>
        )}
      </div>
    </div>
  );
}
