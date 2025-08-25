"use client";
import { useState } from "react";

type CreateHouseholdData = {
  name: string;
  locale: string;
};

type Props = {
  onSubmit: (data: CreateHouseholdData) => Promise<void>;
  isLoading?: boolean;
};

export default function CreateHouseholdForm({ onSubmit, isLoading = false }: Props) {
  const [formData, setFormData] = useState<CreateHouseholdData>({
    name: "",
    locale: "nl",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Maak je Huisgezin</h2>
        <p className="text-muted">Start met het beheren van klussen voor je gezin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Naam van je gezin
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Bijv. Familie Jansen"
            className="w-full px-3 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="locale" className="block text-sm font-medium mb-2">
            Taal / Language
          </label>
          <select
            id="locale"
            value={formData.locale}
            onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
            className="w-full px-3 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="nl">Nederlands</option>
            <option value="en">English</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Bezig..." : "Huisgezin Aanmaken"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted">
          Je kunt dit later altijd aanpassen in je instellingen
        </p>
      </div>
    </div>
  );
} 