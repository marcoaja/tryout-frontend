"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Come Tryout",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Create Tryout", icon: Plus, href: "/tryout/create" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={
          isOpen
            ? "fixed top-4 right-4 z-50"
            : "fixed top-4 left-4 z-50 md:hidden"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-r",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto py-2">
            {sidebarItems.map((section, i) => (
              <div key={i} className="px-3 py-2">
                <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, j) => (
                    <Link
                      key={j}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-status-blue-background text-status-blue-foreground"
                          : "hover:bg-status-neutral-background hover:text-status-neutral-foreground"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
