"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { IoMoon } from "react-icons/io5";

import React from "react";
import { IoSunny } from "react-icons/io5";

export default function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <div
      onClick={() => toggleTheme()}
      className={cn(
        "flex h-3 w-7 cursor-pointer items-center rounded-full bg-accent px-0 transition-all",
        className,
      )}
    >
      <div
        className={cn(
          "relative size-5 rounded-full bg-white shadow transition-all duration-1000 ease-in-out",
          { "translate-x-3 bg-primary": isDark },
        )}
      >
        <IoMoon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 transition-all duration-1000 ease-in-out dark:opacity-100" />
        <IoSunny className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-black opacity-100 transition-all duration-1000 ease-in-out dark:opacity-0" />
      </div>
    </div>
  );
}
