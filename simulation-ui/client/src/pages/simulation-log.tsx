import { useAppContext } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Loader2, Activity } from "lucide-react";
import { useMemo, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const factionColors: Record<string, string> = {
  "Medal Optimists": "#22c55e",
  "Skeptics": "#ef4444",
  "Realists": "#3b82f6",
  "Wildcards": "#f59e0b",
};

const factionIcons: Record<string, string> = {
  "Medal Optimists": "📈",
  "Skeptics": "📉",
  "Realists": "⚖️",
  "Wildcards": "🎲",
};

function SentimentMetrics() {
  const { simulationMessages } = useAppContext();

  const metrics = useMemo(() => {
    if (simulationMessages.length === 0) {
      return { consensus: 0, optimism: 0, pessimism: 0, volatility: 0 };
    }

    const sentiments = simulationMessages.map((m) => m.sentiment);
    const avg = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const optimistic = sentiments.filter((s) => s > 0.2).length / sentiments.length;
    const pessimistic = sentiments.filter((s) => s < -0.2).length / sentiments.length;
    const variance = sentiments.reduce((sum, s) => sum + (s - avg) ** 2, 0) / sentiments.length;

    return {
      consensus: Math.round((1 - Math.sqrt(variance)) * 100),
      optimism: Math.round(optimistic * 100),
      pessimism: Math.round(pessimistic * 100),
      volatility: Math.round(Math.sqrt(variance) * 100),
    };
  }, [simulationMessages]);

  const items = [
    { label: "Consensus", value: `${metrics.consensus}%`, color: "text-blue-400" },
    { label: "Optimism", value: `${metrics.optimism}%`, color: "text-green-400" },
    { label: "Pessimism", value: `${metrics.pessimism}%`, color: "text-red-400" },
    { label: "Volatility", value: `${metrics.volatility}%`, color: "text-yellow-400" },
  ];

  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sentiment Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.label} className="text-center p-3 rounded-lg bg-muted/30" data-testid={`metric-${item.label.toLowerCase()}`}>
              <div className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FactionPieChart() {
  const { simulationMessages } = useAppContext();

  const data = useMemo(() => {
    const counts: Record<string, number> = {
      "Medal Optimists": 0,
      "Skeptics": 0,
      "Realists": 0,
      "Wildcards": 0,
    };
    simulationMessages.forEach((m) => {
      counts[m.faction] = (counts[m.faction] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [simulationMessages]);

  if (simulationMessages.length === 0) {
    return (
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Faction Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Run a simulation to see faction data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Faction Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56" data-testid="chart-factions">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={factionColors[entry.name] || "#666"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 25% 12%)",
                  border: "1px solid hsl(222 15% 20%)",
                  borderRadius: "6px",
                  color: "hsl(220 10% 92%)",
                  fontSize: 12,
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-foreground">{factionIcons[value]} {value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageFeed() {
  const { simulationMessages, isSimulating, runSimulation } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [simulationMessages]);

  return (
    <Card className="bg-card border-card-border flex flex-col">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Simulation Feed
          {isSimulating && (
            <span className="sim-pulse inline-flex items-center gap-1 text-xs text-green-400 font-normal normal-case tracking-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Live
            </span>
          )}
        </CardTitle>
        <Button
          data-testid="button-run-sim-feed"
          onClick={runSimulation}
          disabled={isSimulating}
          size="sm"
          variant="outline"
        >
          {isSimulating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              Run
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-[600px]" ref={scrollRef}>
          {simulationMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Activity className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No simulation data yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Run" to start the agent simulation.</p>
            </div>
          ) : (
            <div className="space-y-2 pr-3">
              {simulationMessages.map((msg) => (
                <div key={msg.id} className="fade-slide-in p-3 rounded-lg bg-muted/20 border border-border/50" data-testid={`log-message-${msg.id}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{factionIcons[msg.faction]}</span>
                    <span className="text-sm font-medium">{msg.agentName}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5"
                      style={{ borderColor: factionColors[msg.faction] + "66", color: factionColors[msg.faction] }}
                    >
                      {msg.faction}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto font-mono">R{msg.round}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function SimulationLog() {
  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl font-bold" data-testid="text-sim-title">Simulation Log</h1>
        <p className="text-sm text-muted-foreground">Agent interaction feed and sentiment analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MessageFeed />
        </div>
        <div className="space-y-6">
          <SentimentMetrics />
          <FactionPieChart />
        </div>
      </div>
    </div>
  );
}
