import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { NavigationMenuDemo } from "./navigation-menu-demo";
import { LanguageSelector } from "./language-selector";
import { UserMenu } from "./user-menu";
import type { DesktopNavbarProps } from "./types";
import ThemeSelector from "@/components/common/ThemeSelector";
import { Button } from "@/components/ui/button";

export function DesktopNavbar({
  selectedLang,
  languages,
  changeLanguage,
  isAuthenticated,
  user,
  getUserInitials,
  handleLogout,
  isAdmin,
  setIsMenuOpen,
}: DesktopNavbarProps) {
  return (
    <>
      <div className="lg:w-1/3">
        <Logo />
      </div>

      <div className="hidden items-center justify-center md:flex lg:w-1/3">
        <ul>
          <NavigationMenuDemo setIsMenuOpen={setIsMenuOpen} />
        </ul>
      </div>

      <div className="flex items-center space-x-4 max-md:hidden lg:w-1/3 lg:justify-end">
        {/* <LanguageSelector
          selectedLang={selectedLang}
          languages={languages}
          changeLanguage={changeLanguage}
        /> */}

        {isAuthenticated ? (
          <UserMenu
            user={user}
            getUserInitials={getUserInitials}
            handleLogout={handleLogout}
            isAdmin={isAdmin}
          />
        ) : (
          <Button asChild variant="default">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </>
  );
}
