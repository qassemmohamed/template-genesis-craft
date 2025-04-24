import { MenuIcon } from "lucide-react";
import { MobileNavbarProps } from "./types";

export function MobileNavbar({ setIsMenuOpen }: MobileNavbarProps) {
  return (
    <div className="hidden max-md:flex">
      <button
        className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--headline)]"
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
