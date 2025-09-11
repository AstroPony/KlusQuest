"use client";
import { useState, useEffect } from "react";

type Chore = {
  id?: string;
  title: string;
  description?: string;
  frequency: string;
  kidId?: string;
  kidIds?: string[]; // For multiple kids
  baseXp: number;
  baseCoins: number;
};

type Props = {
  chore?: Chore;
  kids: Array<{ id: string; displayName: string }>;
  onSubmit: (chore: Chore) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

export default function ChoreForm({ chore, kids, onSubmit, onCancel, isEditing = false }: Props) {
  const [formData, setFormData] = useState<Chore>({
    title: "",
    description: "",
    frequency: "DAILY",
    kidId: "",
    baseXp: 10,
    baseCoins: 1,
    ...chore,
    // Initialize kidIds from existing chore if editing
    kidIds: chore?.kidId ? [chore.kidId] : (chore?.kidIds || [])
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Titel is verplicht";
    }
    
    if (formData.baseXp < 1) {
      newErrors.baseXp = "XP moet minimaal 1 zijn";
    }
    
    if (formData.baseCoins < 0) {
      newErrors.baseCoins = "Munten kunnen niet negatief zijn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        kidId: formData.kidId || undefined,
        kidIds: formData.kidIds || []
      });
    }
  };

  const handleChange = (field: keyof Chore, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? "Klus bewerken" : "Nieuwe klus toevoegen"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Titel *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`input w-full ${errors.title ? "input-error" : ""}`}
            placeholder="Bijv. Kamer opruimen"
          />
          {errors.title && (
            <p className="text-error text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Beschrijving
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="input w-full"
            rows={3}
            placeholder="Optionele beschrijving van de klus..."
          />
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium mb-2">
            Frequentie *
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange("frequency", e.target.value)}
            className="input w-full"
          >
            <option value="DAILY">Dagelijks</option>
            <option value="WEEKLY">Wekelijks</option>
            <option value="ONE_OFF">Eenmalig</option>
          </select>
        </div>

        <div>
          <label htmlFor="kidIds" className="block text-sm font-medium mb-2">
            Toewijzen aan (optioneel)
          </label>
          <div className="space-y-2">
            {kids.map(kid => (
              <label key={kid.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.kidIds?.includes(kid.id) || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const currentKidIds = formData.kidIds || [];
                    let newKidIds: string[];
                    
                    if (isChecked) {
                      newKidIds = [...currentKidIds, kid.id];
                    } else {
                      newKidIds = currentKidIds.filter(id => id !== kid.id);
                    }
                    
                    handleChange("kidIds", newKidIds);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{kid.displayName}</span>
              </label>
            ))}
            {kids.length === 0 && (
              <p className="text-sm text-muted">Voeg eerst kinderen toe via het dashboard</p>
            )}
          </div>
          {formData.kidIds && formData.kidIds.length > 0 && (
            <p className="text-sm text-muted mt-1">
              Deze klus wordt aangemaakt voor {formData.kidIds.length} kind(eren)
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="baseXp" className="block text-sm font-medium mb-2">
              Basis XP *
            </label>
            <input
              id="baseXp"
              type="number"
              min="1"
              value={formData.baseXp}
              onChange={(e) => handleChange("baseXp", parseInt(e.target.value))}
              className={`input w-full ${errors.baseXp ? "input-error" : ""}`}
            />
            {errors.baseXp && (
              <p className="text-error text-sm mt-1">{errors.baseXp}</p>
            )}
          </div>

          <div>
            <label htmlFor="baseCoins" className="block text-sm font-medium mb-2">
              Basis munten *
            </label>
            <input
              id="baseCoins"
              type="number"
              min="0"
              value={formData.baseCoins}
              onChange={(e) => handleChange("baseCoins", parseInt(e.target.value))}
              className={`input w-full ${errors.baseCoins ? "input-error" : ""}`}
            />
            {errors.baseCoins && (
              <p className="text-error text-sm mt-1">{errors.baseCoins}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {isEditing ? "Bijwerken" : "Toevoegen"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
} 