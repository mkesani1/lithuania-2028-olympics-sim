import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Filter } from "lucide-react";
import { useState } from "react";
import type { Agent } from "@shared/schema";

const factionColors: Record<string, string> = {
  "Medal Optimists": "#22c55e",
  "Skeptics": "#ef4444",
  "Realists": "#3b82f6",
  "Wildcards": "#f59e0b",
};

const stanceColors: Record<string, string> = {
  optimistic: "#22c55e",
  pessimistic: "#ef4444",
  neutral: "#3b82f6",
};

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="bg-card border-card-border hover:border-primary/30 transition-colors" data-testid={`card-agent-${agent.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
            {agent.avatar || "👤"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold truncate">{agent.name}</h3>
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 shrink-0"
                style={{ borderColor: stanceColors[agent.stance] + "66", color: stanceColors[agent.stance] }}
              >
                {agent.stance}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>
            <Badge
              variant="secondary"
              className="text-[10px] h-4 px-1.5 mt-2"
              style={{ backgroundColor: factionColors[agent.faction] + "15", color: factionColors[agent.faction] }}
            >
              {agent.faction}
            </Badge>
            <p className="text-xs text-foreground/70 mt-2 leading-relaxed line-clamp-3">{agent.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentSkeleton() {
  return (
    <Card className="bg-card border-card-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentsPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [stanceFilter, setStanceFilter] = useState("all");

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const filteredAgents = (agents || []).filter((agent) => {
    if (roleFilter !== "all" && !agent.role.toLowerCase().includes(roleFilter.toLowerCase())) return false;
    if (stanceFilter !== "all" && agent.stance !== stanceFilter) return false;
    return true;
  });

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "lithuanian", label: "Lithuanian" },
    { value: "rival", label: "Rival Athletes" },
    { value: "coach", label: "Coaches" },
    { value: "analyst", label: "Analysts" },
    { value: "journalist", label: "Journalists" },
    { value: "government", label: "Government" },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" data-testid="text-agents-title">
            <Users className="w-5 h-5 text-primary" />
            Simulation Agents
          </h1>
          <p className="text-sm text-muted-foreground">{filteredAgents.length} agents in the simulation</p>
        </div>

        <div className="flex gap-3 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36" data-testid="select-role-filter">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stanceFilter} onValueChange={setStanceFilter}>
            <SelectTrigger className="w-36" data-testid="select-stance-filter">
              <SelectValue placeholder="Stance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stances</SelectItem>
              <SelectItem value="optimistic">Optimistic</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="pessimistic">Pessimistic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <AgentSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
