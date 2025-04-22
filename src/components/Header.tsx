
import { Logo } from "@/assets/logo";

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {title || "Template Generator"}
      </h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
