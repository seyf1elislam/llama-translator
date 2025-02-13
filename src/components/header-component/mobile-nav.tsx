"use client";
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

import dynamic from "next/dynamic";
import type { ToggleThemeModeProps } from "../theme-components/toggle_theme_mode";
import { MainNavElement } from "./main-nav";
import { usePathname, useSearchParams } from "next/navigation";
import { CiShop } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { FaGripfire } from "react-icons/fa";
import { CiBullhorn } from "react-icons/ci";

//! this solves the hydration problem when the server tries to render client side only components
//!on server side  and it gets theme = "" on server and "light" on client side it gives runtime error
const ToggleThemeMode: React.ComponentType<ToggleThemeModeProps> = dynamic(
  () => import("../theme-components/toggle_theme_mode"),
  {
    ssr: false,
  },
);

export default function MobileNav() {
  const [open, setOpen] = React.useState(false);
  
  const pathname_ = usePathname();
  // const searchParams = useSearchParams();
  const closeSheet = () => setOpen(false);
  // useEffect(() => {
  //   setOpen(false);
  // }, [searchParams]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"outline"} className="w-10 px-0 sm:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">toggle Theme</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        {/* <MobileLink href="/" onOpenChange={setOpen}>
          Home
        </MobileLink>
        <MobileLink href="/blog" onOpenChange={setOpen}>
          blog
        </MobileLink>
        <MobileLink href="/about" onOpenChange={setOpen}>
          About
        </MobileLink> */}
        <MainNavElement pathname={pathname_} href="/" title="Home" isMobile>
          <IoHomeOutline />
        </MainNavElement>
        <MainNavElement pathname={pathname_} href="/shop" title="Shop" isMobile>
          <CiShop />
        </MainNavElement>
        {/* <MainNavElement
          pathname={pathname_}
          href="#Popular-Products"
          alias_href="/#Popular-Products"
          title="Popular Products"
          isMobile
          
        >
          <FaGripfire />
        </MainNavElement>
        <MainNavElement
          pathname={pathname_}
          href="#Announcement"
          alias_href="/#Announcement"
          title="Announcement"
          isMobile
          
        >
          <CiBullhorn />
        </MainNavElement> */}
        <Separator />
        <div>
          <ToggleThemeMode />
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href.toString()}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
