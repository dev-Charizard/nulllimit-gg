# We Built an AI Trading Bot in 2 Weeks — Here's What Actually Happened

**Category:** Builder Playbook
**Published:** April 14, 2026
**Read time:** 8 min
**Author:** Vitoshi · @devCharizard · nulllimit.gg

---

## The Setup

Two weeks ago, I had an idea: What if I could build an AI system that predicts 15-minute price movements of Solana on Kalshi — a prediction market platform?

Not a full trading algorithm. Not a crypto hedge fund. Just: can an automated system, using real technical signals + real-time sentiment analysis, consistently predict whether SOL goes up or down in 15 minutes?

By April 12, 2026, the answer was yes. The system is live. It's trading real money. It's winning **55% of the time overall, and 69% when it focuses on what actually works.**

Here's what actually happened — not the polished version. The real one.

Kalshi runs binary markets. You bet "yes" or "no" on whether something happens. For crypto, they offer `KXSOL15M` — a market that resolves to YES if SOL is higher in 15 minutes, NO if it's lower.

Most retail traders hate binary markets because you're forced to pick a direction. No hedging. No sizing down. You're right or you're wrong. But for an AI system, that's perfect. It's a classification problem: given all available data right now, will the next 15-minute candle close higher?

I sketched out 8 signals: RSI, EMA crossovers, volume spikes, momentum, Bollinger Bands, higher timeframe alignment, order book imbalance, and sentiment analysis via Perplexity + Gemini LLM. Combine them, score directionally, place a bet when confidence is high. That's the engine.

---

## Week 1: Everything Seemed Smart (April 5–7)

I built `pre-check.js` (the signal scorer), `analyze-sentiment.js` (the LLM layer), and `paper-trade.js` to simulate trades without real money.

The first few trades were winners. I was gassed. The signals were working. The sentiment analysis was firing. Everything looked intelligent.

Then I added a hard RSI filter. The logic was airtight: *"If RSI is in a danger zone, skip the trade."*

I paper-traded for a week with that filter active. The result? Out of 11 filtered signals (trades I didn't take because of the RSI gate):

- 10 would have been winners
- 1 would have been a loser

**The filter I was sure would protect us had a 9% accuracy rate.**

It was killing winners to avoid one loser. I deleted it on April 7.

That decision alone taught me more about real trading than a year of reading about it. Your best defense sometimes *is* your worst offense.

---

## The Data Starts Talking (April 8–10)

I ran 69 paper trades. The stats engine broke down performance by session, direction, score bracket, and signal combination. The patterns were obvious.

### Session Breakdown

| Session | Win Rate | Note |
|---|---|---|
| **NY Afterhours** | **68%** | **Golden window** |
| NY Market | 59% | Solid |
| NY Evening | 38% | Disabled |
| NY Overnight | 38% | Disabled |

### Direction Breakdown

| Direction | Win Rate | Decision |
|---|---|---|
| **UP signals** | **69%** | **Keep** |
| DOWN signals | 45% | Disabled |

DOWN was a coin flip. UP was actually profitable. I could've spent months trying to make DOWN work. Instead, the data said: disable it.

### Score Bracket

| Confidence Score | Win Rate |
|---|---|
| 60–64 | 50% |
| 65–69 | 50% |
| 70–74 | 54% |
| 75–79 | 75% |
| **80+** | **80%** |

Higher scores = higher win rates. The system was working.

---

## The Risk Management Layer (April 10)

By April 10, the engine was winning, but compounding was risky. After a 3-trade winning streak, the balance had compounded from $500 → $781. Then a single loss at full size brought it back to $585. I added three risk rules — each one in response to a real near-disaster, not a hypothetical.

**Rule 1: Drawdown Protection**
If balance drops 20% from peak, cap all trades at $50 until recovery. Prevents catastrophic blowout during losing streaks.

**Rule 2: Consecutive Loss Cooldown**
After 2 consecutive losses, pause trading for 30 minutes. Forces the system to step back instead of revenge-trading.

**Rule 3: Consecutive Win Reset**
After 3 consecutive wins, reset the next trade to $50. Locks in compounded gains before re-exposing larger capital.

---

## Going Live (April 12)

By April 12, I was confident. 69 paper trades tested. Risk management solid. The data was clear about what worked: UP in NY Afterhours at high confidence.

I wrote `live-trade.js`, flipped the `LIVE_TRADING_ENABLED` flag, and went live with $500.

The system is now running 24/7 on a Lenovo ThinkCentre M75n running Ubuntu. Every 5 minutes, it:

1. Fetches SOL price data from Binance
2. Calculates all 8 signals
3. If confidence is high, fetches news sentiment via Perplexity
4. If the LLM agrees, places a real order on Kalshi
5. When 15 minutes pass, resolves the trade and updates balance

Total API cost: less than $1/day. Most of that is Perplexity. Gemini Flash is effectively free at this volume.

---

## What This Actually Teaches

Most posts about "building an AI system" skip the ugly parts. They skip the filters that don't work. They skip the directional asymmetry that contradicts your intuition. They skip the moment you realize your best idea was your worst idea.

This isn't specific to trading. This is how you build any autonomous system — whether it's a trading bot, a customer service AI, or a content generation engine.

**The framework:**

1. **Build something that has a theory behind it.** Don't ship random signals. Know why each one should work.
2. **Test it on simulated data.** Paper trading is imperfect but it's not nothing. 69 trades told me what I needed to know.
3. **Look at the breakdowns.** Session, direction, confidence level, signal combinations. The pattern is in the cuts.
4. **Delete everything the data says isn't working.** The RSI filter was logically sound. It had a 9% accuracy rate. Delete it.
5. **Add risk management in response to real near-disasters, not hypotheticals.** Let reality inform your architecture.
6. **Go live small.** $500 on Kalshi teaches me more than 1000 paper trades ever could.

You have an idea. Data tells you what's working. You ruthlessly remove what isn't. You compound what is.

---

## What's Next

The engine is live and running. I'm monitoring it daily. Once we have 30+ live trades with strong performance in NY Afterhours, we'll know if this actually works with real money — psychology, slippage, all the things that change between paper and live.

If it does, the next questions are:

- Can we apply this to other markets on Kalshi? (BTC, ETH, macro events)
- Can we build prediction market bots for other platforms? (Polymarket, Metaculus)
- What happens when we expand the signal set?

But that's future work. Right now, the bot is live. The code is running. The results will tell us if we were right.

---

## For Builders Reading This

If you're building your first autonomous system — whether it's trading, content generation, or anything else — here's what matters:

The barrier to entry isn't capital or education. It's the willingness to build something that might not work, test it ruthlessly, and iterate. That's the actual moat.

---

**Vitoshi | @devCharizard**
Built a BTC trading radar, Mewtwo (ops agent), and now this. The pattern is the same: code a hypothesis, run real data through it, delete what doesn't work, compound what does.

Want to build your own AI system? Start here: **nulllimit.gg/agents** — fully configured AI agent setup for whatever you're building.

Or if you want the full framework for your first autonomous system: **nulllimit.gg/ebooks** — the complete guide.

---

*Tags: AI Agents · Trading Bots · Kalshi · Builder Playbook · Prediction Markets · Autonomous Systems*
