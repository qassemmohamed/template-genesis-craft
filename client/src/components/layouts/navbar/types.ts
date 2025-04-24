export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface NavbarProps {
  selectedLang: Language;
  languages: Language[];
  changeLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  user: any; // Replace with your actual user type
  getUserInitials: () => string;
  handleLogout: () => void;
  isAdmin: boolean;
}

export interface MobileMenuProps extends NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export interface DesktopNavbarProps extends NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export interface MobileNavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export interface LanguageSelectorProps {
  selectedLang: Language;
  languages: Language[];
  changeLanguage: (lang: Language) => void;
  fullWidth?: boolean;
}

export interface UserMenuProps {
  user: any; // Replace with your actual user type
  getUserInitials: () => string;
  handleLogout: () => void;
  isAdmin: boolean;
  isMobile?: boolean;
}
