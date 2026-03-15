"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const match = items.find((item) => item.url === path);
      if (match) setActiveTab(match.name);
    }
  }, [items]);

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mt-4",
        className
      )}
    >
      <div className="flex items-center gap-1 bg-[var(--surface-hex)] border border-[var(--border-hex)] backdrop-blur-xl py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs font-semibold px-5 py-2 rounded-full transition-colors duration-200",
                isActive
                  ? "text-[var(--text-hex)]"
                  : "text-[var(--muted-hex)] hover:text-[var(--text-hex)]"
              )}
            >
              <span className="hidden md:inline tracking-wide">{item.name}</span>
              <span className="md:hidden">
                <Icon size={16} strokeWidth={2} />
              </span>

              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 w-full bg-[var(--border-hex)] rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[var(--text-hex)] rounded-full">
                    <div className="absolute w-10 h-4 bg-[var(--text-hex)]/15 rounded-full blur-md -top-1 -left-2" />
                    <div className="absolute w-6 h-3 bg-[var(--text-hex)]/20 rounded-full blur-sm -top-0.5" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
