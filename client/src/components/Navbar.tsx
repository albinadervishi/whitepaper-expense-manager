import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar({ onClick }: { onClick: () => void }) {
  const location = useLocation();

  const tabs = [
    { name: "Teams", path: "/" },
    { name: "Expenses", path: "/expenses" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors no-underline",
                  location.pathname === tab.path
                    ? "bg-primary-hover text-white"
                    : "text-black hover:bg-primary-hover hover:text-white"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className=" h-11 w-fit" onClick={onClick}>
              {location.pathname === "/expenses" ? "Add Expense" : "Add Team"}
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
