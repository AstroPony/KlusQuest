"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "nl" | "en" | "de" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  nl: {
    // Common
    "loading": "Laden...",
    "error": "Fout",
    "success": "Succes",
    "cancel": "Annuleren",
    "save": "Opslaan",
    "edit": "Bewerken",
    "delete": "Verwijderen",
    "confirm": "Bevestigen",
    
    // Navigation
    "home": "Home",
    "dashboard": "Dashboard",
    "chores": "Klussen",
    "kids": "Kinderen",
    "back": "Terug",
    
    // Chores
    "newChore": "Nieuwe Klus",
    "choreTitle": "Klus Titel",
    "choreDescription": "Beschrijving",
    "frequency": "Frequentie",
    "daily": "Dagelijks",
    "weekly": "Wekelijks",
    "monthly": "Maandelijks",
    "assignTo": "Toewijzen aan",
    "xpReward": "XP Beloning",
    "coinReward": "Munt Beloning",
    "choreStatusCompleted": "Klus voltooid",
    "addMockChores": "Mock Klussen Toevoegen",
    
    // Kids
    "kidName": "Naam",
    "kidLevel": "Level",
    "kidXp": "XP",
    "kidCoins": "Munten",
    "noKidsFound": "Geen kinderen gevonden",
    
    // Game
    "playGames": "Speel Mini-spellen",
    "gameRewards": "Spel Beloningen",
    "startGame": "Start Spel",
    "gameCompleted": "Spel voltooid",
    "bonusRewards": "Bonus beloningen verdiend",
    
    // Messages
    "choreCreated": "Klus succesvol aangemaakt",
    "choreUpdated": "Klus succesvol bijgewerkt",
    "choreDeleted": "Klus succesvol verwijderd",
    "choreCompleted": "Klus succesvol voltooid",
    "xpGained": "XP verdiend",
    "coinsGained": "Munten verdiend",
    "levelUp": "Level omhoog!",
  },
  en: {
    // Common
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    
    // Navigation
    "home": "Home",
    "dashboard": "Dashboard",
    "chores": "Chores",
    "kids": "Kids",
    "back": "Back",
    
    // Chores
    "newChore": "New Chore",
    "choreTitle": "Chore Title",
    "choreDescription": "Description",
    "frequency": "Frequency",
    "daily": "Daily",
    "weekly": "Weekly",
    "monthly": "Monthly",
    "assignTo": "Assign to",
    "xpReward": "XP Reward",
    "coinReward": "Coin Reward",
    "choreStatusCompleted": "Chore completed",
    "addMockChores": "Add Mock Chores",
    
    // Kids
    "kidName": "Name",
    "kidLevel": "Level",
    "kidXp": "XP",
    "kidCoins": "Coins",
    "noKidsFound": "No kids found",
    
    // Game
    "playGames": "Play Mini-games",
    "gameRewards": "Game Rewards",
    "startGame": "Start Game",
    "gameCompleted": "Game completed",
    "bonusRewards": "Bonus rewards earned",
    
    // Messages
    "choreCreated": "Chore created successfully",
    "choreUpdated": "Chore updated successfully",
    "choreDeleted": "Chore deleted successfully",
    "choreCompleted": "Chore completed successfully",
    "xpGained": "XP gained",
    "coinsGained": "Coins gained",
    "levelUp": "Level up!",
  },
  de: {
    // Common
    "loading": "Laden...",
    "error": "Fehler",
    "success": "Erfolg",
    "cancel": "Abbrechen",
    "save": "Speichern",
    "edit": "Bearbeiten",
    "delete": "LÃ¶schen",
    "confirm": "BestÃ¤tigen",
    
    // Navigation
    "home": "Startseite",
    "dashboard": "Dashboard",
    "chores": "Aufgaben",
    "kids": "Kinder",
    "back": "ZurÃ¼ck",
    
    // Chores
    "newChore": "Neue Aufgabe",
    "choreTitle": "Aufgaben Titel",
    "choreDescription": "Beschreibung",
    "frequency": "HÃ¤ufigkeit",
    "daily": "TÃ¤glich",
    "weekly": "WÃ¶chentlich",
    "monthly": "Monatlich",
    "assignTo": "Zuweisen an",
    "xpReward": "XP Belohnung",
    "coinReward": "MÃ¼nz Belohnung",
    "choreStatusCompleted": "Aufgabe erledigt",
    "addMockChores": "Beispielaufgaben hinzufügen¼gen",
    
    // Kids
    "kidName": "Name",
    "kidLevel": "Level",
    "kidXp": "XP",
    "kidCoins": "MÃ¼nzen",
    "noKidsFound": "Keine Kinder gefunden",
    
    // Game
    "playGames": "Mini-Spiele spielen",
    "gameRewards": "Spiel Belohnungen",
    "startGame": "Spiel starten",
    "gameCompleted": "Spiel beendet",
    "bonusRewards": "Bonus Belohnungen verdient",
    
    // Messages
    "choreCreated": "Aufgabe erfolgreich erstellt",
    "choreUpdated": "Aufgabe erfolgreich aktualisiert",
    "choreDeleted": "Aufgabe erfolgreich gelÃ¶scht",
    "choreCompleted": "Aufgabe erfolgreich erledigt",
    "xpGained": "XP verdient",
    "coinsGained": "MÃ¼nzen verdient",
    "levelUp": "Level aufgestiegen!",
  },
  fr: {
    // Common
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "SuccÃ¨s",
    "cancel": "Annuler",
    "save": "Sauvegarder",
    "edit": "Modifier",
    "delete": "Supprimer",
    "confirm": "Confirmer",
    
    // Navigation
    "home": "Accueil",
    "dashboard": "Tableau de bord",
    "chores": "TÃ¢ches",
    "kids": "Enfants",
    "back": "Retour",
    
    // Chores
    "newChore": "Nouvelle TÃ¢che",
    "choreTitle": "Titre de la TÃ¢che",
    "choreDescription": "Description",
    "frequency": "FrÃ©quence",
    "daily": "Quotidien",
    "weekly": "Hebdomadaire",
    "monthly": "Mensuel",
    "assignTo": "Assigner Ã ",
    "xpReward": "RÃ©compense XP",
    "coinReward": "RÃ©compense PiÃ¨ces",
    "choreStatusCompleted": "TÃ¢che terminÃ©e",
    "addMockChores": "Ajouter des TÃ¢ches Exemple",
    
    // Kids
    "kidName": "Nom",
    "kidLevel": "Niveau",
    "kidXp": "XP",
    "kidCoins": "PiÃ¨ces",
    "noKidsFound": "Aucun enfant trouvÃ©",
    
    // Game
    "playGames": "Jouer aux mini-jeux",
    "gameRewards": "RÃ©compenses de Jeu",
    "startGame": "Commencer le Jeu",
    "gameCompleted": "Jeu terminÃ©",
    "bonusRewards": "RÃ©compenses bonus gagnÃ©es",
    
    // Messages
    "choreCreated": "TÃ¢che crÃ©Ã©e avec succÃ¨s",
    "choreUpdated": "TÃ¢che mise Ã  jour avec succÃ¨s",
    "choreDeleted": "TÃ¢che supprimÃ©e avec succÃ¨s",
    "choreCompleted": "TÃ¢che terminÃ©e avec succÃ¨s",
    "xpGained": "XP gagnÃ©",
    "coinsGained": "PiÃ¨ces gagnÃ©es",
    "levelUp": "Niveau supÃ©rieur!",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("nl");

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("preferredLanguage") as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 

