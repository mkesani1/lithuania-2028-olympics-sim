# Lithuania 2028 Olympics Medal Simulator

A sandboxed fork of [MiroFish](https://github.com/666ghj/MiroFish) — the open-source swarm intelligence prediction engine — configured specifically to simulate Lithuania's medal outcomes at the 2028 Los Angeles Summer Olympics.

## What This Does

Uses MiroFish's multi-agent simulation architecture to model the complex, multi-stakeholder dynamics that determine how many medals Lithuania will win at LA 2028:

- **Thousands of AI agents** simulate athletes, coaches, officials, analysts, rival competitors, and fans
- **Dual-platform simulation** (Twitter-like + Reddit-like) models public discourse and opinion formation
- **Custom seed data** encodes Lithuania's Olympic history, current athlete pipeline, funding levels, and geopolitical factors
- **Interactive UI** lets you manipulate simulation parameters and watch outcomes change in real-time

## Architecture

```
├── backend/          # MiroFish Python backend (OASIS simulation engine)
├── frontend/         # MiroFish Vue.js frontend (original)
├── simulation-ui/    # Custom React dashboard for parameter manipulation
├── seeds/            # Lithuania-specific seed documents
└── docker-compose.yml
```

## Quick Start

### Custom Simulation UI (Parameter Dashboard)
```bash
cd simulation-ui
npm install
npm run dev
```

### Full MiroFish Backend (requires API keys)
```bash
cp .env.example .env
# Edit .env with your LLM_API_KEY and ZEP_API_KEY
npm run setup:all
npm run dev
```

## Key Simulation Parameters

| Parameter | Range | Default | Impact |
|-----------|-------|---------|--------|
| Athlete Readiness | 0-100 | 75 | Overall squad fitness |
| Government Funding | €5-50M | €18M | Infrastructure investment |
| Coaching Quality | 1-10 | 7 | Technical staff caliber |
| Russia/Belarus Ban | On/Off | On | Opens medal slots |
| Mykolas Alekna Form | 4 levels | Strong | Discus medal probability |
| 3x3 Basketball | Qualified/Not | Yes | Additional medal pathway |
| Modern Pentathlon Talent | Yes/No | No | New format wildcard |
| Simulation Rounds | 10-500 | 100 | Agent interaction depth |

## Lithuania's Medal Profile

- **30 Summer Olympic medals** since 1992 (6 Gold, 9 Silver, 15 Bronze)
- **Strongest sports**: Athletics/Discus (7 medals), Modern Pentathlon (5), Basketball (4), Rowing (4)
- **Star athlete**: Mykolas Alekna — discus world record holder (75.56m), following father Virgilijus (2x Olympic champion)
- **Historical average**: 3.3 medals per Games

## Upstream

This is a sandbox fork. The original MiroFish repo: [github.com/666ghj/MiroFish](https://github.com/666ghj/MiroFish)

## License

AGPL-3.0 (inherited from MiroFish)
