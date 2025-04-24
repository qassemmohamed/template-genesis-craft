import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      breadcrumbs.push({ label, path: currentPath });
    });

    if (breadcrumbs.length === 0 || breadcrumbs[0].label !== "Dashboard") {
      breadcrumbs.unshift({ label: "Dashboard", path: "/" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="hidden md:flex md:items-center">
      <div className="flex items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0 font-normal"
                onClick={() => navigate(crumb.path)}
              >
                {crumb.label}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
