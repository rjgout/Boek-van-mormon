"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isStandalone } from "@/lib/pwaInstall";

/**
 * Op mobiel/tablet (buiten een al-geïnstalleerde PWA) blijven deze knoppen
 * bewust weg uit de altijd-zichtbare header — zie WelcomeCta.tsx voor
 * dezelfde afweging op het welkomscherm zelf, dat op die schermformaten al
 * naar "zet de app op je scherm" stuurt i.p.v. naar deze knoppen. Zodra de
 * app al als PWA op het scherm staat horen ze er ook hier weer gewoon bij.
 */
export default function HeaderAuthLinks() {
  const [showOnMobile, setShowOnMobile] = useState(false);

  useEffect(() => {
    setShowOnMobile(isStandalone());
  }, []);

  return (
    <nav className={`items-center gap-2 ${showOnMobile ? "flex" : "hidden lg:flex"}`}>
      <Link href="/login" className="btn-secondary !px-4 !py-2">
        Inloggen
      </Link>
      <Link href="/register" className="btn-primary !px-4 !py-2">
        Account maken
      </Link>
    </nav>
  );
}
