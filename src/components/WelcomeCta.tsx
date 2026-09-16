"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import InstallAppCard from "./InstallAppCard";
import { isStandalone } from "@/lib/pwaInstall";

const authButtons = (
  <div className="flex gap-3">
    <Link href="/register" className="btn-primary">
      Gratis beginnen
    </Link>
    <Link href="/login" className="btn-secondary">
      Ik heb al een account
    </Link>
  </div>
);

/**
 * Op mobiel/tablet (buiten een al-geïnstalleerde PWA) sturen we bewust naar
 * "zet 'm eerst op je scherm" i.p.v. meteen inloggen/registreren in de
 * mobiele browser — zie InstallAppCard variant="hero". Zodra de app al als
 * PWA op het scherm staat (bv. iemand installeerde 'm eerder en is nu
 * uitgelogd) is dit gewoon "de app", dus horen de normale knoppen er weer.
 * Op desktop (>= lg) blijven de knoppen sowieso altijd zichtbaar.
 */
export default function WelcomeCta() {
  const [standalone, setStandalone] = useState<boolean | null>(null);

  useEffect(() => {
    setStandalone(isStandalone());
  }, []);

  return (
    <>
      <div className="hidden lg:block">{authButtons}</div>
      <div className="lg:hidden w-full max-w-sm">
        {standalone === null ? null : standalone ? authButtons : <InstallAppCard variant="hero" />}
      </div>
    </>
  );
}
