﻿"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = {
  code: string;
  name: string;
  flag: string;
  locale: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧", locale: "en-US" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", locale: "nl-NL" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", locale: "de-DE" },
  { code: "fr", name: "Français", flag: "🇫🇷", locale: "fr-FR" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageObj: Language) => {
    setLanguage(languageObj.code as "nl" | "en" | "de" | "fr");
    setIsOpen(false);
    
    // Store language preference in localStorage
    localStorage.setItem("preferredLanguage", languageObj.code);
    
    // You can add more language switching logic here
    // For now, we'll just update the UI
    console.log(`Language changed to ${languageObj.name}`);
  };

  const currentLang = languages.find(lang => lang.code === language) || languages[1];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-white">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                  lang.code === language ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === language && (
                  <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 

