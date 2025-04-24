import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface NavbarProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavigationMenuDemo({ setIsMenuOpen }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList className="max-md:flex max-md:gap-4 max-md:flex-col max-md:items-center max-md:justify-center max-md:w-full">
        <NavigationMenuItem>
          <a
            href="/#services"
            onClick={() => setIsMenuOpen(false)} // Close the menu when clicked
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("navbar.services")}
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <a
            href="/#about"
            onClick={() => setIsMenuOpen(false)} // Close the menu when clicked
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("navbar.about")}
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)} // Close the menu when clicked
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("navbar.contact")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  const { t } = useTranslation();

  return (
    <li>
      <NavigationMenuLink className="hover:bg-[var(--card-background)]" asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none text-[var(--headline)] no-underline outline-none transition-colors hover:bg-accent hover:bg-none hover:text-[var(--headline)] focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-[var(--headline)]">
            {title ? t(title) : ""}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {typeof children === "string" ? t(children) : children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
