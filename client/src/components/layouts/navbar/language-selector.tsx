"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LanguageSelectorProps } from "./types";

export function LanguageSelector({
  selectedLang,
  languages,
  changeLanguage,
  fullWidth = false,
}: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--card-background)] px-2 py-2 text-[var(--headline)] ${fullWidth ? "max-md:w-full" : ""}`}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src={selectedLang.flag || "/placeholder.svg"}
              alt={selectedLang.code}
              className="h-5 w-5"
            />
            <span>{selectedLang.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className={`flex cursor-pointer items-center gap-2 ${selectedLang.code === lang.code ? "bg-muted" : ""}`}
          >
            <img
              src={lang.flag || "/placeholder.svg"}
              alt={lang.code}
              className="h-5 w-5"
            />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
