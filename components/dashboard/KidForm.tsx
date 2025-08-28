"use client";

import { useState } from "react";

interface Kid {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
}

interface KidFormProps {
  kid?: Kid;
  onSubmit: (data: Omit<Kid, "id" | "level" | "xp" | "coins">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function KidForm({ kid, onSubmit, onCancel, isEditing = false }: KidFormProps) {
  const [formData, setFormData] = useState({
    displayName: kid?.displayName || "",
    avatar: kid?.avatar || "👶"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Naam is verplicht";
    }

    if (formData.displayName.length < 2) {
      newErrors.displayName = "Naam moet minimaal 2 karakters zijn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const avatarOptions = [
    "👶", "👧", "👦", "🧒", "👩", "👨", "🦸‍♀️", "🦸‍♂️", 
    "🐱", "🐶", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯"
  ];

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? "Kind Bewerken" : "Nieuw Kind Toevoegen"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
            Naam *
          </label>
          <input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            className={`input w-full ${errors.displayName ? "input-error" : ""}`}
            placeholder="Voer de naam van je kind in"
          />
          {errors.displayName && (
            <p className="text-error text-sm mt-1">{errors.displayName}</p>
          )}
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium mb-2">
            Avatar
          </label>
          <div className="grid grid-cols-8 gap-2">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => handleChange("avatar", avatar)}
                className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                  formData.avatar === avatar
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            {isEditing ? "Bijwerken" : "Toevoegen"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
} 