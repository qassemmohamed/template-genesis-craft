import React from "react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  illustration,
  className,
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Illustration/Left panel - hidden on mobile */}
      {illustration && (
        <div className="hidden w-full bg-muted md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
          {illustration}
        </div>
      )}

      {/* Form container */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2",
          illustration ? "md:w-1/2" : "md:mx-auto md:w-full md:max-w-screen-md",
          className,
        )}
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="animate-fade-in w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
