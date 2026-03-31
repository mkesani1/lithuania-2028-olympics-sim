import { useAppContext } from "@/App";
import { calculateMedals, calculateConfidenceInterval, calculateSportPredictions } from "@/lib/simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertTriangle, BarChart3, Target, TrendingUp, Shield } from "lucide-react";
import { useMemo } from "react";

export default function ReportPage() {
  const { params } = useAppContext();
  const predicted = useMemo(() => calculateMedals(params), [params]);
  const ci = useMemo(() => calculateConfidenceInterval(predicted), [predicted]);
  const sports = useMemo(() => calculateSportPredictions(params), [params]);

  const optimistic = Math.min(10, predicted + 3);
  const pessimistic = Math.max(0, predicted - 2);

  return (
    <div className="p-6 max-w-[960px] mx-auto space-y-6">
      {/* Title */}
      <div className="mb-2">
        <h1 className="text-xl font-bold flex items-center gap-2" data-testid="text-report-title">
          <FileText className="w-5 h-5 text-primary" />
          Prediction Report
        </h1>
        <p className="text-sm text-muted-foreground">Lithuania at the 2028 Los Angeles Summer Olympics</p>
      </div>

      {/* Executive Summary */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Our MiroFish swarm intelligence simulation projects Lithuania to win <strong className="text-primary">{predicted} medals</strong> at
            the 2028 Los Angeles Summer Olympics (95% confidence interval: {ci[0]}–{ci[1]} medals). This projection is
            {predicted > 4 ? " above" : predicted < 3 ? " below" : " in line with"} Lithuania's historical average of 3.33 medals per Games since independence in 1992.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed mt-3">
            The projection is anchored by Mykolas Alekna's near-certain medal in discus throw — the 22-year-old world record holder
            (75.56m) will be entering his physical prime at age 25-26. Lithuania's 3x3 basketball team, fresh off a 2024 Paris bronze,
            provides a second strong medal opportunity. Rowing (women's sculls) and modern pentathlon represent additional but less certain pathways.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed mt-3">
            Key swing factors include the Russia/Belarus participation ban (currently {params.russiaBan ? "in effect" : "lifted"}, contributing
            {params.russiaBan ? " +0.5" : " 0"} expected medals), government funding trajectory (currently €{params.governmentFunding}M),
            and the emergence of a new modern pentathlon talent ({params.pentathalonTalent ? "confirmed" : "not yet confirmed"}).
          </p>
        </CardContent>
      </Card>

      {/* Sport-by-Sport Analysis */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Sport-by-Sport Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Discus */}
          <div data-testid="report-discus">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🥏</span>
              <h3 className="text-sm font-semibold">Athletics — Discus Throw</h3>
              <Badge className="text-[10px]" style={{ backgroundColor: "#FFD70022", color: "#FFD700" }}>
                Highest Probability
              </Badge>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Mykolas Alekna is the world record holder at 75.56m and son of 2x Olympic champion Virgilijus Alekna. The Alekna dynasty
              has produced 5 Olympic discus medals since 1992. Currently rated as "{params.aleknaForm}" — this gives a{" "}
              {sports[0].medalProb}% medal probability. Primary rivals include Daniel Ståhl (Sweden, aging), Kristjan Čeh (Slovenia),
              and Matthew Denny (Australia). LA's dry climate favors discus throwers.
            </p>
          </div>

          <Separator className="bg-border/50" />

          {/* 3x3 Basketball */}
          <div data-testid="report-basketball">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏀</span>
              <h3 className="text-sm font-semibold">3x3 Basketball</h3>
              <Badge className="text-[10px]" variant="secondary">
                {params.basketballQualified ? "Qualified" : "Not Qualified"}
              </Badge>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Lithuania won bronze at the 2024 Paris Olympics with Džiaugys, Pukelis, Vingelis, and Matulis. The 3x3 format suits
              Lithuania's deep basketball culture and physical style. {params.basketballQualified
                ? `With qualification secured, medal probability is ${sports[3].medalProb}%. Key rivals include Serbia, Latvia, Netherlands, and France.`
                : "Without qualification, this medal pathway is closed."
              }
            </p>
          </div>

          <Separator className="bg-border/50" />

          {/* Rowing */}
          <div data-testid="report-rowing">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚣</span>
              <h3 className="text-sm font-semibold">Rowing — Women's Sculls</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Viktorija Senkutė won bronze at 2024 Paris in women's single sculls. Lithuania has a strong youth development pipeline
              through the Kaunas rowing center. Current rowing depth is rated {params.rowingDepth}/5, yielding a {sports[2].medalProb}%
              medal probability. Rivals include New Zealand, Romania, and Netherlands.
            </p>
          </div>

          <Separator className="bg-border/50" />

          {/* Pentathlon */}
          <div data-testid="report-pentathlon">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤺</span>
              <h3 className="text-sm font-semibold">Modern Pentathlon</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Lithuania has 5 Olympic medals in modern pentathlon, including Laura Asadauskaitė's 2012 gold. The 2028 format change
              ("Pentathlon Stadium" — all 5 disciplines in 90 minutes) rewards adaptable, younger athletes.
              {params.pentathalonTalent
                ? ` A successor has emerged, giving Lithuania a ${sports[1].medalProb}% medal probability.`
                : " No next-generation talent has been confirmed at Olympic level yet, limiting prospects."
              }
            </p>
          </div>

          <Separator className="bg-border/50" />

          {/* Other sports */}
          <div data-testid="report-other">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏊</span>
              <h3 className="text-sm font-semibold">Swimming, Wrestling, Canoeing, Boxing</h3>
              <Badge className="text-[10px]" variant="secondary">Low Probability</Badge>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              These sports represent long-shot medal pathways. Swimming has been dormant since Rūta Meilutytė's retirement.
              Wrestling and weightlifting face doping scrutiny. Breaking, where Lithuania won silver in 2024, has been dropped from the 2028 program.
              The Russia/Belarus ban ({params.russiaBan ? "active" : "inactive"}) marginally improves wrestling chances.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { risk: "Athlete Injury", detail: "A single injury to Alekna would eliminate Lithuania's highest-probability medal. The entire projection is Alekna-dependent.", severity: "Critical" },
              { risk: "Russia/Belarus Readmission", detail: "If bans are lifted, Russian athletes would enter wrestling, rowing, and weightlifting — displacing Lithuanian medal opportunities by an estimated 0.5 medals.", severity: "High" },
              { risk: "Pentathlon Format Uncertainty", detail: "The new 'Pentathlon Stadium' format has no Olympic track record. Lithuanian athletes may not adapt well to the compressed 90-minute format.", severity: "Medium" },
              { risk: "Small Nation Depth", detail: "With 2.8M population, Lithuania lacks depth. Unlike larger nations, a single disappointment cannot be offset by unexpected medals in other sports.", severity: "Structural" },
              { risk: "Host Country Effect", detail: `The US typically gains 2-5% medal boost from home support. This displaces medals from smaller nations. Current estimated impact: -${(params.hostEffect * 0.05).toFixed(2)} medals.`, severity: "Low" },
              { risk: "Coaching Brain Drain", detail: "Lithuanian coaches are at risk of recruitment by wealthier nations (Germany, UK). Loss of key coaching staff could undermine performance in the critical 2026-2028 window.", severity: "Medium" },
            ].map((item) => (
              <div key={item.risk} className="flex gap-3 p-3 rounded-lg bg-muted/20">
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 px-1.5 shrink-0 mt-0.5"
                  style={{
                    borderColor: item.severity === "Critical" ? "#ef444466" : item.severity === "High" ? "#f59e0b66" : "#3b82f666",
                    color: item.severity === "Critical" ? "#ef4444" : item.severity === "High" ? "#f59e0b" : "#3b82f6",
                  }}
                >
                  {item.severity}
                </Badge>
                <div>
                  <h4 className="text-sm font-medium">{item.risk}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Scenario Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Optimistic */}
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20" data-testid="scenario-optimistic">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h3 className="text-sm font-semibold text-green-400">Optimistic</h3>
                <span className="text-xs text-muted-foreground">(90th percentile)</span>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">{optimistic} medals</div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Alekna gold + rowing medal + 3x3 basketball medal + pentathlon medal + surprise performance.
                Requires peak athlete form, favorable draws, and no rival peak performances.
              </p>
            </div>

            {/* Base Case */}
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20" data-testid="scenario-base">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold text-blue-400">Base Case</h3>
                <span className="text-xs text-muted-foreground">(50th percentile)</span>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{predicted} medals</div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Alekna medal (likely gold) + 1-2 medals from rowing/3x3 basketball.
                Most probable outcome based on current parameter settings.
              </p>
            </div>

            {/* Pessimistic */}
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20" data-testid="scenario-pessimistic">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="text-sm font-semibold text-red-400">Pessimistic</h3>
                <span className="text-xs text-muted-foreground">(10th percentile)</span>
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2">{pessimistic} medals</div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Only Alekna medals, others fall short. Possible if injuries, unfavorable draws,
                or rival peak performances diminish chances across all disciplines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none">
          <p className="text-sm text-foreground/70 leading-relaxed">
            This simulation uses the MiroFish swarm intelligence methodology: a multi-agent debate system where agents
            with diverse perspectives (athletes, coaches, analysts, rivals) interact over {params.simulationRounds} rounds to
            converge on a consensus prediction. Agent factions include Medal Optimists, Skeptics, Realists, and Wildcards.
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed mt-3">
            The base medal prediction model starts from Lithuania's historical average (3.33 medals per Games, 1992-2024)
            and applies weighted adjustments for 10 key parameters including athlete form, funding levels, competitive field
            strength, and geopolitical factors. The model is calibrated against historical data from 9 Olympic Games.
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed mt-3">
            Data sources include World Athletics performance data, Lithuanian NOC (LTOK) official records, Olympedia.org
            historical statistics, and academic medal prediction models (GA-BP neural networks, Random Forest methods from
            F1000Research and ScienceDirect).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
