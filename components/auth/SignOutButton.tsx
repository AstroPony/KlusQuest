"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export default function SignOutButton() {
  return (
    <ClerkSignOutButton>
      <button className="btn-ghost text-sm">
        Uitloggen
      </button>
    </ClerkSignOutButton>
  );
} 