"use client"; // Tandai file ini sebagai Client Component

import { SessionProvider } from "next-auth/react";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <Toaster />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}
