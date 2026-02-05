import { createContext, useContext, useState } from "react";
import translations from "./translations.json";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Language = "en" | "de" | "fr" | "es";

const languageLabel: Record<Language, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
};

type LanguageContextType = {
  lang: Language;
  t: (key: keyof typeof translations["en"]) => string;
  switchLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: keyof typeof translations["en"]) =>
    translations[lang][key];

  return (
    <LanguageContext.Provider
      value={{ lang, t, switchLanguage: setLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}


export function LanguageToggle() {
  const { lang, switchLanguage } = useLanguage();

  const setLanguage = (language: Language) => {
    // Switch between 'en' and 'de'
    switchLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            relative inline-flex h-9 w-9 items-center justify-center
            rounded-md
            text-foreground
            text-md
            hover:bg-accent hover:text-accent-foreground
            transition-colors hover:cursor-pointer
          "
        >
          {languageLabel[lang]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[3rem] p-2"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setLanguage("en")}
            className={cn(
              "h-7 justify-center px-2 text-md",
              lang === "en" && "bg-gray-200 dark:bg-gray-700 text-accent-foreground"
            )}>
            EN
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("de")}
            className={cn(
              "h-7 justify-center px-2 text-md",
              lang === "de" && "bg-gray-200 dark:bg-gray-700 text-accent-foreground"
            )}>
            DE
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("fr")}
            className={cn(
              "h-7 justify-center px-2 text-md",
              lang === "fr" && "bg-gray-200 dark:bg-gray-700 text-accent-foreground"
            )}>
            FR
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("es")}
            className={cn(
              "h-7 justify-center px-2 text-md",
              lang === "es" && "bg-gray-200 dark:bg-gray-700 text-accent-foreground"
            )}>
            ES
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    // <button
    //   onClick={toggleLanguage}
    //   className="relative inline-flex h-9 w-9 items-center justify-center
    //         rounded-md
    //         text-foreground
    //         hover:bg-accent hover:text-accent-foreground
    //         transition-colors hover:cursor-pointer"
    // >
    //   {lang === "en" ? "DE" : "EN"}
    // </button>
  );
}