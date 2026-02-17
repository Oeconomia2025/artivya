import { useState, ReactNode, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletConnect } from "@/components/wallet-connect";
import { EcosystemSidebar } from "@/components/ecosystem-sidebar";

import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Palette,
  User,
  FolderOpen,
} from "lucide-react";
import { SiX, SiMedium, SiYoutube, SiDiscord, SiGithub, SiTelegram } from "react-icons/si";

interface LayoutProps {
  children: ReactNode;
}

const artivyaLogo = "https://pub-37d61a7eb7ae45898b46702664710cb2.r2.dev/With%20Border/Art%20no%20Border.png";

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  const [linksOpen, setLinksOpen] = useState(false);

  const [location, navigate] = useLocation();
  const isNavigatingRef = useRef(false);
  const lockedCollapsedStateRef = useRef<boolean | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Social links
  const socialLinks = [
    { name: "Twitter/X", icon: SiX, url: "https://x.com/Oeconomia2025", enabled: true },
    { name: "Medium", icon: SiMedium, url: "https://medium.com/@oeconomia2025", enabled: true },
    { name: "YouTube", icon: SiYoutube, url: "https://www.youtube.com/@Oeconomia2025", enabled: true },
    { name: "Discord", icon: SiDiscord, url: "https://discord.com/invite/XSgZgeVD", enabled: true },
    { name: "GitHub", icon: SiGithub, url: "https://github.com/Oeconomia2025", enabled: true },
    { name: "Telegram", icon: SiTelegram, url: "https://t.me/OeconomiaDAO", enabled: true },
  ];

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Enforce locked collapse state during navigation
  useEffect(() => {
    if (lockedCollapsedStateRef.current !== null && sidebarCollapsed !== lockedCollapsedStateRef.current) {
      setSidebarCollapsed(lockedCollapsedStateRef.current);
      localStorage.setItem("sidebar-collapsed", String(lockedCollapsedStateRef.current));
      setTimeout(() => {
        if (lockedCollapsedStateRef.current !== null) {
          setSidebarCollapsed(lockedCollapsedStateRef.current);
        }
      }, 0);
    }
  }, [sidebarCollapsed]);

  // Unlock after navigation completes
  useEffect(() => {
    if (isNavigatingRef.current) {
      setTimeout(() => {
        isNavigatingRef.current = false;
        lockedCollapsedStateRef.current = null;
      }, 100);
    }
  }, [location]);

  const handleNavigation = (path: string) => {
    const wasCollapsed = sidebarCollapsed;

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      navigate(path);
      setSidebarOpen(false);
      return;
    }

    lockedCollapsedStateRef.current = wasCollapsed;
    isNavigatingRef.current = true;
    localStorage.setItem("sidebar-collapsed", String(wasCollapsed));
    navigate(path);
    setTimeout(() => {
      setSidebarCollapsed(wasCollapsed);
      localStorage.setItem("sidebar-collapsed", String(wasCollapsed));
    }, 1);
  };

  const toggleCollapsed = () => {
    isNavigatingRef.current = false;
    lockedCollapsedStateRef.current = null;
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const sidebarItems = [
    { icon: User, label: "Profile", path: "/profile", active: location === "/profile" },
    { icon: FolderOpen, label: "Collections", path: "/collections", active: location === "/collections" },
    { icon: Palette, label: "NFT Market", path: "/", active: location === "/" || location === "/nft-market" },
  ];

  return (
    <>
      {/* Collapse/Expand button - outside all containers for true fixed positioning */}
      <button
        onClick={toggleCollapsed}
        className={`hidden lg:flex fixed top-[29px] z-[60] w-6 h-6 border rounded-full items-center justify-center hover:opacity-80 transition-all duration-300 ${
          sidebarCollapsed ? "left-[52px]" : "left-[180px]"
        }`}
        style={{ backgroundColor: "#1a1a2e", borderColor: "#8a88f6" }}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" style={{ color: "#11c4fe" }} /> : <ChevronLeft className="w-3 h-3" style={{ color: "#11c4fe" }} />}
      </button>

      {/* Mobile hamburger - fixed top-left on small screens */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#1a1a2e", border: "1px solid #8a88f6" }}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Root: sidebar + main column */}
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 ${
            sidebarCollapsed ? "w-16" : "w-48"
          } transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-xl shadow-black/70`}
          style={{ backgroundColor: "#000000", borderRight: "1px solid #8a88f6" }}
        >
          {/* Sidebar header */}
          <div className="sticky top-0 z-10 flex items-center justify-between h-20 px-4 border-b-0" style={{ backgroundColor: "#000000" }}>
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "space-x-3"}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={artivyaLogo} alt="Artivya Logo" className="w-full h-full object-cover" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-lg font-bold text-white">Artivya</h2>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar nav */}
          <div className="sticky top-20 z-10 border-b-0" style={{ backgroundColor: "#000000" }}>
            <nav className="p-2">
              <ul className="space-y-2">
                {sidebarItems.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                      } py-2 rounded-lg text-left transition-colors group relative ${
                        item.active
                          ? "text-white font-medium shadow-lg transition-all duration-200"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                      style={item.active ? { background: "linear-gradient(135deg, #11c4fe, #8a88f6)" } : {}}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" style={item.active ? { color: "white" } : {}} />
                      {!sidebarCollapsed && <span className="whitespace-nowrap" style={item.active ? { color: "white" } : {}}>{item.label}</span>}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--crypto-dark)] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Fill space */}
          <div className="flex-1 overflow-y-auto p-4" />

          {/* Bottom section */}
          <div className="sticky bottom-0 p-2 border-t flex flex-col space-y-2" style={{ backgroundColor: "#000000", borderColor: "#8a88f6" }}>
            {/* Links Button */}
            <DropdownMenu onOpenChange={setLinksOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                  } py-2 rounded-lg text-left transition-colors group relative transition-all duration-200 focus:outline-none focus:ring-0 focus:border-none outline-none ring-0 ${
                    linksOpen ? "text-white font-medium shadow-lg" : "bg-gray-800 shadow-lg"
                  }`}
                  style={linksOpen ? { background: "linear-gradient(135deg, #11c4fe, #8a88f6)" } : {}}
                  onMouseEnter={(e) => { if (!linksOpen) e.currentTarget.style.background = "linear-gradient(135deg, #11c4fe, #8a88f6)"; }}
                  onMouseLeave={(e) => { if (!linksOpen) e.currentTarget.style.background = ""; }}
                  title={sidebarCollapsed ? "Links" : undefined}
                >
                  <Globe className="w-5 h-5 flex-shrink-0" style={{ color: "white" }} />
                  {!sidebarCollapsed && <span className="text-sm text-white">Links</span>}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--crypto-dark)] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Links
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className={`mb-2 ${sidebarCollapsed ? "w-[calc(4rem-1rem)]" : "w-[calc(12rem-1rem)]"}`}
                style={{ borderColor: "#8a88f6", backgroundColor: "#000000" }}
              >
                <DropdownMenuItem
                  onClick={() => window.open("https://oeconomia.tech/", "_blank")}
                  className={`cursor-pointer rounded-md transition-all duration-200 focus:bg-transparent ${
                    sidebarCollapsed ? "justify-center px-2" : "px-3"
                  }`}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #11c4fe, #8a88f6)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                >
                  <Globe className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? "" : "mr-3"}`} />
                  {!sidebarCollapsed && <span>Website</span>}
                </DropdownMenuItem>
                {socialLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.name}
                    onClick={() => link.enabled && window.open(link.url, "_blank")}
                    className={`cursor-pointer rounded-md transition-all duration-200 focus:bg-transparent ${
                      !link.enabled ? "opacity-50" : ""
                    } ${sidebarCollapsed ? "justify-center px-2" : "px-3"}`}
                    disabled={!link.enabled}
                    onMouseEnter={(e) => { if (link.enabled) e.currentTarget.style.background = "linear-gradient(135deg, #11c4fe, #8a88f6)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    <link.icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? "" : "mr-3"}`} />
                    {!sidebarCollapsed && <span>{link.name}</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Oeconomia Button */}
            <button
              onClick={() => window.open("https://oeconomia.io/", "_blank")}
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 rounded-lg text-left transition-colors group relative text-white hover:bg-white/5 transition-all duration-200`}
              style={{
                background: "linear-gradient(#000000, #000000) padding-box, linear-gradient(135deg, #11c4fe, #8a88f6) border-box",
                border: "2px solid transparent",
              }}
              title={sidebarCollapsed ? "Oeconomia" : undefined}
            >
              <img
                src="https://pub-37d61a7eb7ae45898b46702664710cb2.r2.dev/images/OEC%20Logo%20Square.png"
                alt="OEC Logo"
                className="w-5 h-5 flex-shrink-0"
              />
              {!sidebarCollapsed && <span className="text-sm">Oeconomia</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--crypto-dark)] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Oeconomia
                </div>
              )}
            </button>

            {/* OECsplorer */}
            <a
              href="https://oecsplorer.oeconomia.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 rounded-lg text-left transition-colors group relative text-white font-semibold shadow-lg hover:brightness-110 overflow-hidden`}
              style={{ background: "linear-gradient(135deg, #11c4fe, #8a88f6)" }}
              title={sidebarCollapsed ? "OECsplorer" : undefined}
            >
              <img
                src="https://pub-37d61a7eb7ae45898b46702664710cb2.r2.dev/images/Globe%20Black.png"
                alt="OECsplorer"
                className="w-5 h-5 flex-shrink-0 object-contain"
              />
              {!sidebarCollapsed && <span className="text-sm">OECsplorer</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--crypto-dark)] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  OECsplorer
                </div>
              )}
            </a>

            <WalletConnect collapsed={sidebarCollapsed} />

            {/* Network indicator */}
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "space-x-2 px-3"
              } py-1.5 text-xs text-gray-500`}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                style={{ boxShadow: "0 0 6px #22C55E44" }}
              />
              {!sidebarCollapsed && <span>Sepolia Testnet</span>}
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main column - no top bar */}
        <div className="flex-1 lg:ml-0 mr-9 relative flex flex-col">
          <main className="flex-1">
            {children}
            <footer className="border-t-0 mt-8 py-6 px-6 text-center">
              <p className="text-sm text-muted-foreground">&copy; 2025 Oeconomia. All rights reserved.</p>
            </footer>
          </main>
        </div>
      </div>

      {/* Ecosystem Sidebar */}
      <EcosystemSidebar />
    </>
  );
}
