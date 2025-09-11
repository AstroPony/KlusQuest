"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22c55e",
          colorText: "#e2e8f0",
          colorBackground: "#0f172a",
          borderRadius: "0.75rem",
          fontSize: "1rem",
        },
        elements: {
          rootBox: "clerk-root",
          card: "!bg-[#1e293b] !border !border-white/10 !rounded-2xl",
          headerTitle: "!text-white",
          headerSubtitle: "!text-slate-400",
          formFieldInput:
            "!bg-[#1e293b] !text-white !border !border-white/10 !rounded-xl focus:!border-green-500",
          formButtonPrimary:
            "!bg-[#22c55e] !text-black !rounded-xl hover:!opacity-90 !border-0",
          footerActionText: "!text-slate-400",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
