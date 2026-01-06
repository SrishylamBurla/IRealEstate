"use client";

import { useGetPropertiesQuery } from "@/features/properties/propertyApi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProperties() {
  const { data, isLoading } = useGetPropertiesQuery();
  const properties =
    data?.properties?.filter((p) => p.isApproved).slice(0, 6) || [];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [parallax, setParallax] = useState(20);

  /* 🔁 AUTO SLIDE */
  useEffect(() => {
    if (paused || properties.length === 0) return;

    const timer = setInterval(() => {
      setActive((p) => (p === properties.length - 1 ? 0 : p + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [paused, properties.length]);

  /* ✨ PARALLAX RESET */
  useEffect(() => {
    if (paused) return;
    setParallax(20);
    const t = setTimeout(() => setParallax(0), 80);
    return () => clearTimeout(t);
  }, [active, paused]);

  const prev = () =>
    setActive((i) => (i === 0 ? properties.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === properties.length - 1 ? 0 : i + 1));

  if (isLoading) return <Skeleton />;

  return (
    <section
      className="relative h-[75vh] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* SLIDES */}
      {properties.map((p, i) => (
        <div
          key={p._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* IMAGE */}
          <img
            src={p.images?.[0]}
            alt={p.title}
            className={`h-full w-full object-cover ${
              i === active && !paused ? "cinematic-zoom" : ""
            }`}
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

          {/* CONTENT */}
          <div
            className="absolute bottom-20 left-1/2 max-w-4xl w-full px-6 text-white transition-all duration-[1200ms] ease-out"
            style={{
              transform: `translate(-50%, ${parallax}px)`,
            }}
          >
            {/* 🔥 BADGE */}
            <span
              className="inline-flex items-center gap-2 mb-4 rounded-full px-4 py-1 mr-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg bg-gray-800 transition-all duration-700"
              // ${
                // i === active
                //   ? "opacity-100 translate-y-0 badge-glow"
                //   : "opacity-0 translate-y-3"
              // }`
              
            >
              Featured Property
            </span>
            {/* PURPOSE BADGE */}
            <span
              className={`z-20 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-700
    ${i === active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
    ${p.purpose === "rent" ? "bg-blue-600/90" : "bg-emerald-600/90"}
  `}
            >
              {p.purpose === "rent" ? "For Rent" : "For Sale"}
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow">
              {p.title}
            </h2>

            <p className="mt-3 text-lg text-gray-200">
              ₹{p.price?.toLocaleString()} • {p.location?.city}
            </p>

            <Link
              href={`/properties/${p._id}`}
              className="inline-block mt-6 bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              View Property →
            </Link>
          </div>
        </div>
      ))}

      {/* NAV */}
      <NavButton left onClick={prev}>
        <ChevronLeft />
      </NavButton>

      <NavButton onClick={next}>
        <ChevronRight />
      </NavButton>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {properties.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === active
                ? "bg-amber-400 scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------- UI ---------- */

function NavButton({ children, left, ...props }) {
  return (
    <button
      {...props}
      className={`absolute ${
        left ? "left-6" : "right-6"
      } top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-3 shadow-lg transition`}
    >
      {children}
    </button>
  );
}

function Skeleton() {
  return <div className="h-[75vh] w-full bg-gray-200 animate-pulse" />;
}
