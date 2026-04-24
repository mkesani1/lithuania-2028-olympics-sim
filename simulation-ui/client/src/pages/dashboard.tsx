import { useAppContext } from "@/App";
import { calculateMedals, calculateConfidenceInterval, calculateAthleteRankings, historicalData } from "@/lib/simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Loader2, Users, Target, Medal, Swords, Share2 } from "lucide-react";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function MedalSummary({ predicted, ci }: { predicted: number; ci: [number, number] }) {
  const goldCount = predicted >= 5 ? 2 : predicted >= 3 ? 1 : 0;
  const silverCount = predicted >= 6 ? 2 : predicted >= 4 ? 1 : 0;
  const bronzeCount = Math.max(0, predicted - goldCount - silverCount);

  return (
    <Card className="bg-card border-card-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Predicted Total Medals</h2>
          </div>
          <Badge variant="secondary" className="text-xs font-mono" data-testid="badge-confidence">
            95% CI: {ci[0]}–{ci[1]}
          </Badge>
        </div>

        <div className="flex items-end gap-6">
          <span className="gold-shimmer text-6xl font-bold leading-none tabular-nums" data-testid="text-medal-count">
            {predicted}
          </span>

          <div className="flex gap-4 pb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full" style={{ background: "#FFD700" }} />
              <span className="text-sm font-medium" data-testid="text-gold-count">{goldCount}</span>
              <span className="text-xs text-muted-foreground">Gold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full" style={{ background: "#C0C0C0" }} />
              <span className="text-sm font-medium" data-testid="text-silver-count">{silverCount}</span>
              <span className="text-xs text-muted-foreground">Silver</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full" style={{ background: "#CD7F32" }} />
              <span className="text-sm font-medium" data-testid="text-bronze-count">{bronzeCount}</span>
              <span className="text-xs text-muted-foreground">Bronze</span>
            </div>
          </div>
        </div>

        {/* Confidence interval bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>0 medals</span>
            <span>10 medals</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full opacity-30"
              style={{
                left: `${ci[0] * 10}%`,
                width: `${(ci[1] - ci[0]) * 10}%`,
                background: "hsl(43 98% 54%)",
              }}
            />
            <div
              className="absolute h-full w-1 rounded-full"
              style={{
                left: `${predicted * 10}%`,
                background: "hsl(43 98% 54%)",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ParameterControls() {
  const { params, setParams, isSimulating, runSimulation } = useAppContext();
  const update = (partial: Partial<typeof params>) => setParams({ ...params, ...partial });

  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Target className="w-4 h-4" />
          Simulation Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Athlete Readiness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Athlete Readiness</label>
            <span className="text-sm font-mono text-primary" data-testid="text-readiness-value">{params.athleteReadiness}%</span>
          </div>
          <Slider
            data-testid="slider-readiness"
            value={[params.athleteReadiness]}
            onValueChange={([v]) => update({ athleteReadiness: v })}
            min={0} max={100} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">How prepared are Lithuania's top athletes?</p>
        </div>

        {/* Government Funding */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Government Funding</label>
            <span className="text-sm font-mono text-primary" data-testid="text-funding-value">€{params.governmentFunding}M</span>
          </div>
          <Slider
            data-testid="slider-funding"
            value={[params.governmentFunding]}
            onValueChange={([v]) => update({ governmentFunding: v })}
            min={5} max={50} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Diminishing returns above €25M — Lithuania already spends €10.7/capita (2x Slovenia)</p>
        </div>

        {/* Coaching Quality */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Coaching Quality</label>
            <span className="text-sm font-mono text-primary" data-testid="text-coaching-value">{params.coachingQuality}/10</span>
          </div>
          <Slider
            data-testid="slider-coaching"
            value={[params.coachingQuality]}
            onValueChange={([v]) => update({ coachingQuality: v })}
            min={1} max={10} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Quality of coaching infrastructure</p>
        </div>

        {/* Russia/Belarus Ban */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Russia/Belarus Ban</label>
            <p className="text-xs text-muted-foreground">Are Russia/Belarus banned?</p>
          </div>
          <Switch
            data-testid="switch-russia-ban"
            checked={params.russiaBan}
            onCheckedChange={(v) => update({ russiaBan: v })}
          />
        </div>

        {/* Alekna Form */}
        <div>
          <label className="text-sm font-medium mb-2 block">Mykolas Alekna Form</label>
          <Select value={params.aleknaForm} onValueChange={(v) => update({ aleknaForm: v })}>
            <SelectTrigger data-testid="select-alekna">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="World Record Form">World Record Form</SelectItem>
              <SelectItem value="Strong">Strong</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Injured">Injured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pentathlon Talent */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Modern Pentathlon Talent</label>
            <p className="text-xs text-muted-foreground">New pentathlete emerged?</p>
          </div>
          <Switch
            data-testid="switch-pentathlon"
            checked={params.pentathalonTalent}
            onCheckedChange={(v) => update({ pentathalonTalent: v })}
          />
        </div>

        {/* Basketball Qualification */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">3x3 Basketball</label>
            <p className="text-xs text-muted-foreground">Qualified for 2028?</p>
          </div>
          <Switch
            data-testid="switch-basketball"
            checked={params.basketballQualified}
            onCheckedChange={(v) => update({ basketballQualified: v })}
          />
        </div>

        {/* Rowing Depth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Rowing Squad Depth</label>
            <span className="text-sm font-mono text-primary" data-testid="text-rowing-value">{params.rowingDepth}/5</span>
          </div>
          <Slider
            data-testid="slider-rowing"
            value={[params.rowingDepth]}
            onValueChange={([v]) => update({ rowingDepth: v })}
            min={1} max={5} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Depth of the rowing pipeline</p>
        </div>

        {/* Host Effect */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Host Country Effect</label>
            <span className="text-sm font-mono text-primary" data-testid="text-host-value">{params.hostEffect}%</span>
          </div>
          <Slider
            data-testid="slider-host"
            value={[params.hostEffect]}
            onValueChange={([v]) => update({ hostEffect: v })}
            min={0} max={10} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">US home advantage medal displacement</p>
        </div>

        {/* Competitive Field Strength */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-destructive" />
              Competitive Field Strength
            </label>
            <span className="text-sm font-mono text-primary" data-testid="text-competition-value">{params.competitiveFieldStrength}/10</span>
          </div>
          <Slider
            data-testid="slider-competition"
            value={[params.competitiveFieldStrength]}
            onValueChange={([v]) => update({ competitiveFieldStrength: v })}
            min={1} max={10} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Rival depth — 10 = historically deep field (e.g. 5-man 70m+ discus)</p>
        </div>

        {/* Social Media Effect */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              Social Media Effect
            </label>
            <span className={`text-sm font-mono ${params.socialMediaEffect < 0 ? 'text-destructive' : params.socialMediaEffect > 0 ? 'text-green-400' : 'text-muted-foreground'}`} data-testid="text-social-value">
              {params.socialMediaEffect > 0 ? '+' : ''}{params.socialMediaEffect}
            </span>
          </div>
          <Slider
            data-testid="slider-social"
            value={[params.socialMediaEffect]}
            onValueChange={([v]) => update({ socialMediaEffect: v })}
            min={-5} max={5} step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Negative = toxic pressure/anxiety. Positive = endorsement motivation/fan energy</p>
        </div>

        {/* Simulation Rounds */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Simulation Rounds</label>
            <span className="text-sm font-mono text-primary" data-testid="text-rounds-value">{params.simulationRounds}</span>
          </div>
          <Slider
            data-testid="slider-rounds"
            value={[params.simulationRounds]}
            onValueChange={([v]) => update({ simulationRounds: v })}
            min={10} max={500} step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Number of agent interaction rounds</p>
        </div>

        {/* Run Simulation Button */}
        <Button
          data-testid="button-run-simulation"
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-primary text-primary-foreground font-semibold"
          size="lg"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

const MEDAL_COLORS: Record<string, string> = {
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
  None: "hsl(var(--muted-foreground))",
};

const QUAL_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  Lock: { bg: "#22c55e22", fg: "#22c55e", border: "#22c55e44" },
  Likely: { bg: "#3b82f622", fg: "#3b82f6", border: "#3b82f644" },
  Possible: { bg: "#f59e0b22", fg: "#f59e0b", border: "#f59e0b44" },
  Borderline: { bg: "#ef444422", fg: "#ef4444", border: "#ef444444" },
};

function AthleteRankings() {
  const { params } = useAppContext();
  const rankings = useMemo(
    () => calculateAthleteRankings(params).slice().sort((a, b) => b.medalProb - a.medalProb),
    [params],
  );

  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          Athlete Medal Rankings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[640px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-xs">#</TableHead>
                <TableHead className="text-xs">Athlete</TableHead>
                <TableHead className="text-xs">Sport</TableHead>
                <TableHead className="text-xs">Event</TableHead>
                <TableHead className="text-xs text-right">WR#</TableHead>
                <TableHead className="text-xs">Qual</TableHead>
                <TableHead className="text-xs text-right">Prob</TableHead>
                <TableHead className="text-xs">Medal</TableHead>
                <TableHead className="text-xs">Form</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((a, i) => {
                const qual = QUAL_COLORS[a.qualStatus] ?? QUAL_COLORS.Possible;
                const medalColor = MEDAL_COLORS[a.predictedMedal];
                return (
                  <TableRow key={a.id} data-testid={`athlete-row-${a.id}`}>
                    <TableCell className="font-mono text-xs text-muted-foreground py-2">{i + 1}</TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs font-medium">{a.name}</div>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">{a.sport}</TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">{a.event}</TableCell>
                    <TableCell className="py-2 text-xs font-mono text-right">
                      {a.worldRank ?? "—"}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5"
                        style={{ backgroundColor: qual.bg, color: qual.fg, borderColor: qual.border }}
                      >
                        {a.qualStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs font-mono text-right tabular-nums">
                      {a.medalProb}%
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={a.predictedMedal === "None" ? "secondary" : "default"}
                        className="text-[10px] h-5 px-1.5"
                        style={{
                          backgroundColor: a.predictedMedal !== "None" ? medalColor + "22" : undefined,
                          color: medalColor,
                          borderColor: medalColor + "44",
                        }}
                      >
                        {a.predictedMedal}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">{a.form}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoricalChart() {
  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Historical Performance (1992–2024)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64" data-testid="chart-historical">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 20%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(220 8% 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(220 8% 55%)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 25% 12%)",
                  border: "1px solid hsl(222 15% 20%)",
                  borderRadius: "6px",
                  color: "hsl(220 10% 92%)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="gold" name="Gold" stackId="a" fill="#FFD700" radius={[0, 0, 0, 0]} />
              <Bar dataKey="silver" name="Silver" stackId="a" fill="#C0C0C0" />
              <Bar dataKey="bronze" name="Bronze" stackId="a" fill="#CD7F32" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { params } = useAppContext();
  const predicted = useMemo(() => calculateMedals(params), [params]);
  const ci = useMemo(() => calculateConfidenceInterval(predicted), [predicted]);

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold" data-testid="text-page-title">Lithuania 2028 Olympics Medal Simulator</h1>
        <p className="text-sm text-muted-foreground">Powered by MiroFish Swarm Intelligence Engine</p>
      </div>

      {/* Top: Medal Summary */}
      <MedalSummary predicted={predicted} ci={ci} />

      {/* Main content: Parameters + Athlete Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParameterControls />
        <AthleteRankings />
      </div>

      {/* Historical Chart */}
      <HistoricalChart />
    </div>
  );
}
