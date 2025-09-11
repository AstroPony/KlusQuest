"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SignOutButton({ className, children }: Props) {
  return (
    <ClerkSignOutButton>
      <button className={className ?? "btn-ghost text-sm"}>
        {children ?? "Uitloggen"}
      </button>
    </ClerkSignOutButton>
  );
}
