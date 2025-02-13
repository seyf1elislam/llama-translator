"use client";

import Link from "next/link";
import React from "react";
import { siteConfig } from "@/config/siteConfig";
import Image from "next/image";

import { useTheme } from "next-themes";

export default function LogoImg() {
  const { theme } = useTheme();
  return (
    <div className=" w-[140px] p-0">
      <Image
        // className="prose dark:prose-invert w-[140px] transition-all  "
        className="prose dark:prose-invert w-[100px] transition-all  "
        // quality={50}
        src={
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? siteConfig.logo
            : siteConfig.darkLogo
        }
        width={140}
        height={40}
        // fill
        alt="site Logo"
      />
    </div>
  );
}
