"use client";
import { useState } from "react";

type UserRole = "PARENT" | "KID";

type Props = {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
};

export default function RoleSelector({ onRoleSelect, selectedRole }: Props) {
  const [role, setRole] = useState<UserRole | undefined>(selectedRole);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    onRoleSelect(selectedRole);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Wat ben jij?</h3>
        <p className="text-muted">Kies je rol om te beginnen</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleRoleSelect("PARENT")}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
            role === "PARENT"
              ? "border-primary bg-primary/10 text-primary"
              : "border-white/10 bg-card hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="font-semibold">Ouder</div>
          <div className="text-sm text-muted mt-1">
            Beheer klussen en beloningen
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect("KID")}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
            role === "KID"
              ? "border-primary bg-primary/10 text-primary"
              : "border-white/10 bg-card hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          <div className="text-3xl mb-2">🧒</div>
          <div className="font-semibold">Kind</div>
          <div className="text-sm text-muted mt-1">
            Voltooi klussen en verdien punten
          </div>
        </button>
      </div>

      {role && (
        <div className="text-center">
          <p className="text-sm text-muted">
            Geselecteerd: <span className="font-medium text-primary">{role === "PARENT" ? "Ouder" : "Kind"}</span>
          </p>
        </div>
      )}
    </div>
  );
} 