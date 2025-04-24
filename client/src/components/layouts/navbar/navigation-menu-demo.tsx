"use client";

import { Link } from "react-router-dom";

export function NavigationMenuDemo({
  setIsMenuOpen,
}: {
  setIsMenuOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="flex gap-4">
      <Link to={"/"}>
        <button onClick={() => setIsMenuOpen(false)}>Home</button>
      </Link>
      <a href={"/#about"}>
        <button onClick={() => setIsMenuOpen(false)}>About</button>
      </a>
      <a href={"/#services"}>
        <button onClick={() => setIsMenuOpen(false)}>Services</button>
      </a>
      <Link to={"/contact"}>
        <button onClick={() => setIsMenuOpen(false)}>Contact</button>
      </Link>
    </div>
  );
}
