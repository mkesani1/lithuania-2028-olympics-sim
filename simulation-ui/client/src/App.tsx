import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SimulationLog from "@/pages/simulation-log";
import AgentsPage from "@/pages/agents-page";
import ReportPage from "@/pages/report-page";
import { useState, createContext, useContext } from "react";
import { SimParams, defaultParams, generateSimulationMessages, SimulationMessage } from "@/lib/simulation";
import { LayoutDashboard, Activity, Users, FileText, ChevronLeft, ChevronRight } from "lucide-react";

// Shared state context
interface AppState {
  params: SimParams;
  setParams: (p: SimParams) => void;
  simulationMessages: SimulationMessage[];
  isSimulating: boolean;
  runSimulation: () => void;
}

export const AppContext = createContext<AppState>({
  params: defaultParams,
  setParams: () => {},
  simulationMessages: [],
  isSimulating: false,
  runSimulation: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

function SidebarNav({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/simulation", label: "Simulation", icon: Activity },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/report", label: "Report", icon: FileText },
  ];

  return (
    <aside className={`${collapsed ? "w-16" : "w-56"} shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200`}>
      {/* Logo area */}
      <div className="p-3 border-b border-sidebar-border flex items-center gap-2">
        <div className="w-9 h-9 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9" aria-label="Lithuania Olympics Simulator">
            {/* Stylized Vytis knight shield + Olympic rings mashup */}
            <rect x="2" y="2" width="32" height="32" rx="6" fill="none" stroke="hsl(43 98% 54%)" strokeWidth="1.5"/>
            {/* Shield shape */}
            <path d="M18 6L10 10V20L18 30L26 20V10L18 6Z" fill="none" stroke="hsl(158 100% 30%)" strokeWidth="1.2"/>
            {/* Knight silhouette - abstract */}
            <path d="M16 14L18 11L20 14L19 17L21 20L18 24L15 20L17 17L16 14Z" fill="hsl(43 98% 54%)" opacity="0.9"/>
            {/* Mini Olympic rings */}
            <circle cx="12" cy="29" r="2" fill="none" stroke="hsl(220 60% 55%)" strokeWidth="0.7"/>
            <circle cx="16" cy="29" r="2" fill="none" stroke="hsl(43 98% 54%)" strokeWidth="0.7"/>
            <circle cx="20" cy="29" r="2" fill="none" stroke="hsl(158 100% 30%)" strokeWidth="0.7"/>
            <circle cx="24" cy="29" r="2" fill="none" stroke="hsl(358 66% 50%)" strokeWidth="0.7"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-xs font-semibold text-sidebar-foreground leading-tight truncate">LTU 2028</div>
            <div className="text-[10px] text-muted-foreground leading-tight truncate">Medal Simulator</div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => {
          const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors
                  ${isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        data-testid="sidebar-collapse"
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-sidebar-border text-muted-foreground hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/simulation" component={SimulationLog} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/report" component={ReportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-auto">
        <AppRouter />
      </main>
    </div>
  );
}

function App() {
  const [params, setParams] = useState<SimParams>(defaultParams);
  const [simulationMessages, setSimulationMessages] = useState<SimulationMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationMessages([]);

    const allMessages = generateSimulationMessages(params, params.simulationRounds);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= allMessages.length) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }
      const batch = allMessages.slice(idx, idx + 2);
      setSimulationMessages((prev) => [...prev, ...batch]);
      idx += 2;
    }, 150);
  };

  return (
    <AppContext.Provider value={{ params, setParams, simulationMessages, isSimulating, runSimulation }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppLayout />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

export default App;
