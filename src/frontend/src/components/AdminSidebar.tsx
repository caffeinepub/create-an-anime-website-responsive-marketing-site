import { FileText, Film, Mail, ShieldCheck, Users, X } from "lucide-react";
import type React from "react";
import type { AdminSection } from "./AdminDashboard";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "episodes",
    label: "Episodes",
    icon: <Film className="w-4 h-4" />,
    description: "Manage anime episodes",
  },
  {
    id: "characters",
    label: "Characters",
    icon: <Users className="w-4 h-4" />,
    description: "Manage characters",
  },
  {
    id: "content",
    label: "Content",
    icon: <FileText className="w-4 h-4" />,
    description: "Announcements & lore",
  },
  {
    id: "contacts",
    label: "Contact Requests",
    icon: <Mail className="w-4 h-4" />,
    description: "View & manage requests",
  },
  {
    id: "roles",
    label: "Role Management",
    icon: <ShieldCheck className="w-4 h-4" />,
    description: "Grant admin access",
  },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b admin-sidebar-border">
        <p className="text-xs font-semibold uppercase tracking-widest admin-muted-text">
          Navigation
        </p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                isActive
                  ? "admin-sidebar-active"
                  : "admin-sidebar-item hover:admin-sidebar-item-hover"
              }`}
            >
              <span
                className={`shrink-0 ${isActive ? "admin-accent-text" : "admin-muted-text group-hover:admin-accent-text"}`}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium truncate ${isActive ? "admin-heading" : "admin-muted-text"}`}
                >
                  {item.label}
                </p>
                <p className="text-xs admin-muted-text truncate hidden lg:block">
                  {item.description}
                </p>
              </div>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full admin-accent-dot shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t admin-sidebar-border">
        <p className="text-xs admin-muted-text text-center">
          Whispers of the White Moon
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 admin-sidebar shrink-0 border-r admin-sidebar-border">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            role="button"
            tabIndex={-1}
            onClick={onMobileClose}
            onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
          />
          <aside className="relative w-64 admin-sidebar flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b admin-sidebar-border">
              <p className="text-xs font-semibold uppercase tracking-widest admin-muted-text">
                Navigation
              </p>
              <button
                type="button"
                onClick={onMobileClose}
                className="admin-muted-text hover:admin-accent-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                      isActive
                        ? "admin-sidebar-active"
                        : "admin-sidebar-item hover:admin-sidebar-item-hover"
                    }`}
                  >
                    <span
                      className={`shrink-0 ${isActive ? "admin-accent-text" : "admin-muted-text"}`}
                    >
                      {item.icon}
                    </span>
                    <p
                      className={`text-sm font-medium truncate ${isActive ? "admin-heading" : "admin-muted-text"}`}
                    >
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
