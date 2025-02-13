
import Link from "next/link";
import React from "react";
import { IoLogoGithub } from "react-icons/io";
import { siteConfig } from "@/config/siteConfig";

export default function Footer() {
  return (
   <footer className="m-4 rounded-lg ">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse"
          >
            {/* <LogoImg /> */}
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium  sm:mb-0">
            <li>
              <Link href="/about" className="me-4 hover:underline md:me-6">
                About
              </Link>
            </li>
            {/* <li>
              <Link href="/about" className="me-4 hover:underline md:me-6">
                Privacy Policy
              </Link>
            </li> */}
            <li>
              <Link href="/" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        {/* <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2024
          <Link href="/" className="ml-1 hover:underline">
            tttttt
          </Link>
          . All Rights Reserved.
        </span> */}
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          Developed by
          <Link
            href="https://github.com/seyf1elislam"
            target="_blank"
            className="mx-1 hover:underline"
          >
            <IoLogoGithub className="mx-0.5 inline" />
            seyf1elislam
          </Link>
        
        </span>
      </div>
    </footer>
  );
}
