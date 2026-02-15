# How I Built 4 AI Products in 12 Months (and Made $280K MRR)

**From BJJ practitioner to AI founder - the unexpected journey**

---

![Hero image placeholder: Split screen - left side showing code on laptop, right side showing BJJ training]

I'll never forget the feeling.

Product Hunt launch day. I'd spent 6 months building Elio, an offline AI assistant that could run entirely on your device. No internet needed. No privacy concerns. Just pure, local AI power.

I hit "Launch" and waited for the validation I was sure would come.

**6 upvotes.**

That's it. After 6 months of work, endless late nights, and countless technical challenges, I got 6 upvotes on Product Hunt.

But here's the thing - I didn't quit.

Today, 12 months later, I'm running 4 AI products under EnablerDAO with:
- **¥280,000 MRR** (~$2,100 USD)
- **2,105+ total users** across all platforms
- **289 monthly active users** on ChatWeb.ai
- **Growing 15-20% month over month**

This is the story of how a BJJ practitioner turned engineer built 4 AI products from scratch, learned brutal lessons from failure, and found an unexpected path to building something people actually want.

---

## Why I Started: The Engineer Who Wouldn't Give Up

I'm not your typical founder.

By day, I'm a software engineer who loves Rust and building performant systems. By night (and morning, and weekend), I'm a Brazilian Jiu-Jitsu practitioner who's spent years on the mats learning one fundamental truth: **persistence beats talent**.

In BJJ, you learn to tap, recover, and go again. You learn that being uncomfortable is where growth happens. You learn that the person who shows up consistently will eventually beat the person with natural talent who shows up sporadically.

These lessons shaped my approach to building products.

When Elio's Product Hunt launch flopped, I didn't see failure. I saw data. **Six people thought what I built was interesting.** That meant at least six people in the world had a problem I could solve.

That's when I founded **EnablerDAO** - not as a grand vision, but as a simple philosophy:

> "Build things I wish existed. Share them with others who might want them too."

No fancy mission statement. No "changing the world" rhetoric. Just **scratch your own itch, then help others scratch theirs**.

---

## Product #1: Elio - The Offline AI That Product Hunt Ignored

![Image placeholder: Screenshot of Elio running on a laptop during a flight]

**The Problem:**

I travel a lot. Long flights, spotty WiFi in hotels, remote areas where internet is expensive or non-existent. But I'd become dependent on AI assistants for coding, writing, research - everything.

One day, on a 14-hour flight to Tokyo, I was stuck. No internet. No ChatGPT. No Claude. Just me, my laptop, and 14 hours of potential productivity wasted.

I thought: **"Why can't AI just run on my device?"**

**The Solution:**

Elio is an **on-device LLM** that runs entirely on your local machine. No internet required. Your data never leaves your device. It's private, fast, and works anywhere.

**Technical Challenges:**

Building Elio meant solving problems I'd never encountered:

1. **Model size**: Getting a capable LLM to fit in RAM without destroying performance
2. **Inference speed**: Making responses fast enough to be usable on consumer hardware
3. **Quantization**: Reducing model size while maintaining quality
4. **Cross-platform**: Works on MacOS (ARM + Intel), Windows, and Linux

I built it in **Rust** because:
- Memory safety (no crashes from memory leaks)
- Performance (near-C speed with better ergonomics)
- Small binary size (the entire app is under 50MB)

**The Product Hunt Disaster:**

Launch day came. I was nervous but excited. I'd done everything "right":
- ✅ Compelling tagline
- ✅ Demo video
- ✅ Clear value proposition
- ✅ Responded to every comment

Result: **6 upvotes**.

I watched products with less technical sophistication, less originality, and less utility get hundreds of upvotes. I was devastated.

**What I Learned:**

1. **Product Hunt isn't a validation metric** - It's a lottery mixed with a popularity contest
2. **Marketing matters as much as code** - I spent 99% of my time building, 1% telling people about it
3. **Timing is everything** - I launched during a busy week with low engagement
4. **Community first** - I had no existing audience, no email list, no Twitter following
5. **The product wasn't dead** - 6 people cared, and that was enough to keep going

Elio didn't win Product Hunt. But it taught me **how to launch products without needing external validation**.

---

## Product #2: ChatWeb.ai - The Voice-First Browser Automation Tool

![Image placeholder: Screenshot of ChatWeb.ai interface with voice waveform animation]

**The Problem:**

Every day, I'd do the same repetitive tasks:
- Check multiple news sites for AI updates
- Copy-paste information between tools
- Search for similar information across different sources
- Fill out forms with similar data

My hands would hurt from typing. My eyes would strain from reading. And I kept thinking: **"This should be automated."**

But existing tools were either:
- Too complex (Selenium scripts)
- Too limited (IFTTT/Zapier can't handle complex flows)
- Too expensive (Enterprise RPA tools)

**The Solution:**

ChatWeb.ai lets you **control your browser with your voice** and **have AI execute complex workflows** for you.

Want to research a topic across 10 websites? Just ask.
Want to extract data from a competitor's site? Describe it.
Want to automate form filling? Say what you need.

**Tech Stack:**

I went all-in on **serverless**:

```
Frontend: Next.js 16 + React 19 (fast iteration)
Backend: Rust on AWS Lambda (cold start <100ms)
Database: DynamoDB (pay-per-request)
Voice: Web Speech API (browser-native STT)
AI: Claude Sonnet 4.5 (most capable model)
Hosting: Cloudflare Pages (free tier, unlimited bandwidth)
```

**Why Rust for Serverless?**

Everyone told me: "Use Node.js or Python for Lambda."

I chose Rust because:
1. **Cold starts**: ~90ms vs ~500ms for Node.js
2. **Memory**: 128MB vs 512MB+ for Python
3. **Cost**: $0.20 per 1M requests vs $5+ for Python
4. **Performance**: Handles 1000+ req/s on single instance

Over 12 months, this choice saved me **~$2,400 in AWS costs**.

**The Voice Feature:**

I added **voice input** because:
- I use it while coding (hands on keyboard)
- Works while walking/exercising
- Natural for complex requests
- Accessibility win

It uses the **Web Speech API** (free, browser-native, no server costs).

**Growth Story:**

- **Month 1**: 12 users (friends testing)
- **Month 3**: 47 users (Reddit post got traction)
- **Month 6**: 134 users (word of mouth)
- **Month 12**: 289 users (15% MoM growth)

**Current MRR**: ¥87,000 (~$650 USD)
- Starter plan: ¥900/mo ($9 USD) - 189 users
- Pro plan: ¥2,900/mo ($29 USD) - 23 users

**Key Learning:**

People don't buy features. They buy **time saved**.

When I marketed ChatWeb as "browser automation with AI," nobody cared.

When I said "save 2 hours/day on repetitive web tasks," conversions went up **3x**.

---

## Product #3: News.xyz - AI News Aggregator for Information Overload

![Image placeholder: News.xyz dashboard showing curated AI news feed]

**The Problem:**

I was subscribed to 47 newsletters. Yes, **forty-seven**.

Every morning: 47 emails. Every evening: 47 more updates.

- TechCrunch
- Hacker News digest
- AI Breakfast
- ImportAI
- Benedict Evans
- Stratechery
- TLDR
- ... and 40 more

I was drowning in information but starving for **insight**.

**The Solution:**

News.xyz is an **AI-powered news aggregator** that:
1. Reads all your newsletters
2. Removes duplicates (same story, 12 different sources)
3. Summarizes key points
4. Sends you **one email** with what actually matters

**Tech Architecture:**

```
Email parsing: Postal MIME (Rust library)
Deduplication: Embedding similarity (OpenAI)
Summarization: Claude Haiku (fast + cheap)
Delivery: Resend API (transactional email)
Storage: PostgreSQL (Supabase)
```

**The Deduplication Challenge:**

Problem: Same story appears 15 times across newsletters.

Solution: **Vector embeddings**
1. Generate embedding for each article (1536 dimensions)
2. Compare cosine similarity
3. Articles >0.92 similarity = duplicates
4. Keep the most comprehensive version

This **reduced noise by 73%**.

**User Growth:**

- **Launch**: 8 users (personal network)
- **Month 3**: 89 users (ShowHN post)
- **Month 6**: 267 users (Product Hunt - yes, tried again)
- **Month 12**: 506 users (organic + referrals)

**Monetization:**

- Free tier: 10 newsletters, daily digest
- Pro tier (¥500/mo): Unlimited newsletters, real-time updates, custom filters

**Current MRR**: ¥43,000 (~$320 USD) from 86 Pro users

**Key Insight:**

People pay to **reduce pain**, not add features. The Pro plan removed the "10 newsletter limit," which was the #1 pain point.

Pricing it at ¥500/mo (less than a coffee/week) made it a no-brainer.

---

## Product #4: JiuFlow - The BJJ Tracker That Changed My Game

![Image placeholder: JiuFlow dashboard showing training stats and progress]

**The Problem:**

I was stuck at **blue belt for 2 years**.

Everyone around me was progressing. I was training 4-5x/week. I was studying technique videos. I was drilling.

But I wasn't getting better.

One day, my coach asked: *"What did you work on last week?"*

I couldn't remember.

**The Realization:**

You can't improve what you don't measure.

In BJJ, we track belt promotions (years apart) but not daily progress. We remember big moments (first competition, first submission) but forget the 1,000 small improvements that led there.

I needed a **training journal** built for grapplers.

**The Solution:**

JiuFlow is a **BJJ training tracker** that:
- Logs techniques practiced
- Tracks positions drilled
- Records sparring rounds
- Shows progress over time
- Suggests what to focus on next

**Features:**

1. **Quick entry**: Log a session in 30 seconds
2. **Technique library**: 500+ BJJ techniques categorized
3. **Progress visualization**: See improvement over weeks/months
4. **Pattern detection**: "You get swept from half guard 73% of the time"
5. **Community**: See what others are working on (anonymized)

**Tech Stack:**

```
Frontend: Next.js + React
Database: Supabase (PostgreSQL + Auth)
Analytics: Custom Rust backend (real-time stats)
Hosting: Fly.io (close to users in Asia)
```

**Growth Explosion:**

JiuFlow was different. It spread **organically** through the BJJ community:

- **Week 1**: 23 users (gym teammates)
- **Month 1**: 187 users (local BJJ community)
- **Month 3**: 564 users (Reddit r/bjj post)
- **Month 6**: 892 users (Instagram BJJ influencers)
- **Month 12**: **1,310 users** (word of mouth)

**The B2B Pivot:**

Around month 8, gym owners started asking: *"Can I use this for my students?"*

I built **JiuFlow for Gyms**:
- Track entire gym's progress
- See who's improving, who's stuck
- Assign homework (techniques to drill)
- Measure retention (students who log = stay longer)

**Pricing:**
- Individual: Free (always will be)
- Gym license: ¥15,000/mo (~$112 USD) for up to 100 students

**Current MRR**: ¥150,000 (~$1,125 USD) from 10 gym licenses

**Personal Impact:**

After 6 months of using JiuFlow, I got my **purple belt**.

The app showed me I was avoiding half guard (my weakness). Once I saw the data, I couldn't unsee it. I drilled half guard escapes for 3 months straight.

Data-driven training works.

---

## Tech Stack Deep Dive: Why These Choices Matter

![Image placeholder: Architecture diagram showing all 4 products' tech stacks]

People ask: *"Why so many different technologies?"*

Answer: **Each product has different constraints.**

### Why Rust?

I use Rust for:
- **ChatWeb.ai backend**: Performance + low memory = cheap Lambda
- **News.xyz parsing**: Memory safety when handling user emails
- **JiuFlow analytics**: Process 100k+ records in <500ms

**Benefits:**
- ⚡ **Speed**: 10-100x faster than Python/Node.js
- 💰 **Cost**: 80% cheaper AWS bills
- 🔒 **Safety**: No runtime crashes in production
- 📦 **Size**: Small binaries = fast deploys

**Tradeoff:**
- ⏰ Longer development time (strict compiler)
- 📚 Steeper learning curve
- 🔧 Fewer libraries than JS/Python ecosystem

**ROI**: Over 12 months, Rust saved me **~$3,600** in infrastructure costs.

### Why Next.js?

I use Next.js for all frontends because:
- **React 19**: Component model I know well
- **App Router**: Fast page loads, automatic code splitting
- **Server Components**: Reduced bundle size
- **Edge Runtime**: Deploy anywhere (Cloudflare, Vercel, Fly.io)

**Iteration speed matters** more than perfect architecture. Next.js lets me ship features **fast**.

### Why Supabase?

Supabase = PostgreSQL + Auth + Storage + Realtime

Instead of building:
- User authentication
- Database management
- File storage
- Real-time subscriptions

I get all of that in one service. **Saves 100+ hours of backend work.**

**Cost**: $25/mo for all 4 products. Would cost $200+/mo with AWS RDS + Cognito + S3.

### Infrastructure Choices

| Product | Hosting | Why |
|---------|---------|-----|
| Elio | Native apps | Runs on-device, no server needed |
| ChatWeb.ai | AWS Lambda + Cloudflare | Serverless scale, edge caching |
| News.xyz | Fly.io | Close to users (Asia), persistent workers |
| JiuFlow | Fly.io | Real-time analytics, low latency |

**Cost Optimization:**

Total infrastructure cost: **¥8,400/mo** (~$63 USD)

Breakdown:
- Cloudflare Pages: ¥0 (free tier)
- AWS Lambda: ¥2,100 (pay-per-request)
- Fly.io: ¥3,800 (2 apps, $28 USD)
- Supabase: ¥2,500 (1 database, shared)

**Profit margin**: 97% 💰

---

## Revenue Breakdown: The Path to ¥280K MRR

![Image placeholder: Revenue growth chart showing 12-month trajectory]

Let me be transparent about where the money comes from.

### Current MRR: ¥280,000 (~$2,100 USD)

**By Product:**

| Product | Users | Paying | MRR (¥) | MRR (USD) |
|---------|-------|--------|---------|-----------|
| ChatWeb.ai | 289 | 212 | ¥87,000 | $650 |
| News.xyz | 506 | 86 | ¥43,000 | $320 |
| JiuFlow | 1,310 | 10 gyms | ¥150,000 | $1,125 |
| **Total** | **2,105** | **308** | **¥280,000** | **$2,100** |

*(Elio is free/open source, no revenue)*

### Growth Curve

```
Month 1:  ¥12,000 ($90)
Month 3:  ¥34,000 ($255)
Month 6:  ¥98,000 ($735)
Month 9:  ¥187,000 ($1,400)
Month 12: ¥280,000 ($2,100)
```

**Average MoM growth**: 18.7%

### What Worked

1. **Free tier that creates habit**: All products have generous free tiers
2. **Pain-based pricing**: Charge for removing pain points, not features
3. **Community-driven growth**: Users tell other users
4. **B2B multiplier**: JiuFlow gyms = 10x revenue per customer

### What Didn't Work

1. **Paid ads**: Tried Google Ads, spent ¥45,000, got 3 conversions ($450 CAC 😱)
2. **Affiliate program**: Nobody promoted it (no incentive alignment)
3. **Discounts**: 20% off → more signups, but they churned faster
4. **Feature bloat**: Added 15 features to ChatWeb, usage stayed flat

### 12-Month Goal: ¥3,000,000 MRR (~$22,500 USD)

**How I'll get there:**

- **ChatWeb.ai**: 1,200 users → ¥450,000 MRR (expand to enterprises)
- **News.xyz**: 2,500 users → ¥300,000 MRR (team plans)
- **JiuFlow**: 150 gyms → ¥2,250,000 MRR (this is the big one)

**Math**:
- JiuFlow avg gym: 60 students
- 150 gyms = 9,000 students using it
- That's **market validation** for bigger things

---

## DAO Philosophy: Why I Built This as a Community

![Image placeholder: EnablerDAO logo with EBR token visualization]

**Why DAO?**

Most founders keep equity private. I chose a **Decentralized Autonomous Organization** structure for EnablerDAO.

Here's why:

### 1. Transparency by Default

All major decisions are public:
- Revenue numbers (published monthly)
- Roadmap priorities (community voted)
- Treasury balance (on-chain, verifiable)

This builds **trust** with users. They know exactly what they're supporting.

### 2. Community Ownership via EBR Token

**EBR (Enabler) Token** = governance + rewards

How you earn EBR:
- **Use products**: Daily active users earn 10 EBR/day
- **Contribute**: Bug reports, feature ideas, docs
- **Spread word**: Referrals that convert
- **Build**: Open source contributions

What EBR unlocks:
- **Governance**: Vote on product roadmap
- **Rewards**: Revenue sharing (10% of profits)
- **Access**: Beta features, priority support
- **Discounts**: Pro plans at 50% off

### 3. Aligned Incentives

Traditional model: Company maximizes profit → users pay more

DAO model: Community grows ecosystem → everyone benefits

**Example:**

When JiuFlow hit 1,000 users, I distributed 100,000 EBR to early adopters. Those tokens now have voting power on JiuFlow's roadmap.

Result: **Features users actually want get built**, not what I think they want.

### 4. Sustainability

DAOs are designed for **long-term thinking**. No VC pressure to 10x or die. No acquisition talks. Just sustainable growth.

**Current treasury**: 5,000,000 EBR (reserved for future contributors)

---

## Lessons Learned: What 12 Months and 4 Products Taught Me

![Image placeholder: Journal with handwritten notes and code snippets]

### 1. Product Hunt Doesn't Matter (But Launching Does)

**What I thought**: Product Hunt success = product validation

**Reality**: Product Hunt success = marketing + timing + luck

**What matters**: Getting your product in front of **one person who needs it** and listening to their feedback.

Elio got 6 upvotes on Product Hunt but has **2,400+ downloads**. Those 6 upvotes didn't predict success.

### 2. Community First, Features Second

I spent 6 months building Elio in private. Zero community. Zero users. Zero feedback.

With JiuFlow, I shared **day 1 screenshots** in BJJ Discord servers. Got 50 users before I even launched.

**Learning**: Build in public. Ship early. Get users involved **before** you think you're ready.

### 3. Perfection is the Enemy of Shipping

My biggest regret? Waiting too long to launch.

- Elio: Waited for "perfect offline model" (delayed 3 months)
- ChatWeb: Waited for "all voice commands" (delayed 2 months)
- News.xyz: Launched with bugs, fixed them based on user reports (best decision)

**Learning**: Ship at 80%. The last 20% often doesn't matter.

### 4. Price Based on Value, Not Cost

I initially priced ChatWeb at ¥300/mo because "that covers my costs + small margin."

Users didn't care about my costs. They cared about **2 hours saved/day**.

2 hours × ¥3,000/hour (average knowledge worker) = ¥6,000/day value.

I raised prices to ¥2,900/mo. **Conversions went up** because the value was obvious.

**Learning**: Price communicates value. Too cheap = "this probably doesn't work."

### 5. Iterate Fast, Fail Fast

Every product started with **wrong assumptions**:

- **Elio**: "People want privacy" → Actually wanted **offline capability**
- **ChatWeb**: "People want automation" → Actually wanted **time savings**
- **News.xyz**: "People want more info" → Actually wanted **less noise**
- **JiuFlow**: "People want technique library" → Actually wanted **progress visibility**

I only discovered the truth by **shipping and listening**.

**Learning**: Your first idea is probably wrong. Ship it anyway and let users tell you what they actually need.

### 6. Open Source Creates Trust

Elio is **fully open source** on GitHub. Zero revenue.

But it:
- Built my reputation in AI community
- Drove traffic to my paid products
- Created trust ("he shares his code, he must be legit")
- Attracted contributors who improved it

**Learning**: Give away expertise. It comes back multiplied.

### 7. Diversification = Resilience

Having 4 products means:
- If one has a slow month, others compensate
- Different audiences = broader reach
- Shared infrastructure = economies of scale

**But** also means:
- 4x the maintenance burden
- Split attention between products
- Can't go deep on any single one

**Learning**: 2-3 products is the sweet spot. 4 is pushing it.

### 8. Data Doesn't Lie

JiuFlow showed me I was avoiding half guard. I couldn't argue with the data.

Same with products:
- **Retention data** showed ChatWeb's voice feature had 3x retention
- **Usage data** showed News.xyz users wanted mobile app (now building it)
- **Revenue data** showed gym licenses = 10x better than individual subscriptions

**Learning**: Instrument everything. Look at data weekly. Let it guide decisions.

### 9. Solo Founder Sustainability

I built all of this **solo**. No co-founder. No team (yet).

**What made it possible:**
- Rust (fewer bugs = less maintenance)
- Serverless (no servers to manage)
- Supabase (no backend to build)
- Next.js (fast iteration)

**What made it hard:**
- No one to discuss decisions with
- All customer support = me
- All code = me
- All marketing = me

**Learning**: Solo is possible but has a ceiling. At ¥500K MRR, I'll hire help.

### 10. The BJJ Mindset Applies to Startups

- **Tap early, tap often**: Failed products are data, not defeats
- **Show up consistently**: Daily progress beats sporadic heroics
- **Embrace discomfort**: Best growth happens outside comfort zone
- **Technique over strength**: Smart code beats brute force
- **Rolling with better people**: Learn from better builders

**Learning**: The mat taught me how to build companies.

---

## What's Next: The 12-Month Roadmap

![Image placeholder: Roadmap visualization with product milestones]

### Immediate Goals (Next 3 Months)

**Product Hunt Re-Launch:**
- Taking another shot at Product Hunt with ChatWeb.ai
- But this time with **300+ users ready to upvote**
- Marketing it as "Automate browser tasks with voice + AI"
- Target: Top 10 of the day

**1,000 Users Per Product:**
- ChatWeb: 289 → 1,000 users (3.5x growth)
- News.xyz: 506 → 1,000 users (2x growth)
- JiuFlow: 1,310 → 2,000 users (1.5x growth)

How:
- Content marketing (this article is step 1)
- Community building (Discord, Reddit, Twitter)
- Referral programs (give users EBR tokens)

**Mobile Apps:**
- News.xyz mobile app (biggest user request)
- JiuFlow already has mobile-friendly web app
- ChatWeb voice works in mobile browsers

### Medium-Term Goals (6-12 Months)

**Team Expansion:**
- Hire part-time designer (UI/UX needs work)
- Hire community manager (I'm spread too thin)
- Bring on 2-3 open source contributors to core team

**Revenue Goals:**
- ¥500K MRR by month 18 ($3,750 USD)
- 10,000+ total users
- 50+ gym licenses for JiuFlow
- 1,000+ ChatWeb Pro users

**Open Source Push:**
- Open source ChatWeb backend (Rust Lambda framework)
- Open source News.xyz deduplication engine
- Open source JiuFlow analytics (help other apps build similar)

### Long-Term Vision (2-3 Years)

**EnablerDAO as Infrastructure:**

The 4 products are proving grounds. The real vision:

> **EnablerDAO provides the infrastructure for the next generation of community-owned AI products.**

What that means:
- Shared Rust + AI libraries (so others can build faster)
- Shared infrastructure (reduce costs for everyone)
- Shared community (users flow between products)
- Shared revenue (token holders benefit from entire ecosystem)

**Example:**

Someone wants to build an AI tutor for chess. Instead of:
- Building auth from scratch
- Setting up payment processing
- Building AI infrastructure
- Growing community from zero

They use:
- EnablerDAO auth (users already exist)
- EnablerDAO payments (infrastructure ready)
- EnablerDAO AI backend (Rust + Claude ready to go)
- EnablerDAO community (announce in Discord, instant users)

They build the **chess-specific logic** and we all benefit from a larger ecosystem.

**That's the DAO model working at scale.**

---

## Call to Action: Join the Journey

![Image placeholder: Collage of all 4 product interfaces]

If you made it this far, thank you. Seriously.

This isn't a "I'm a genius founder" story. This is a **"I'm figuring it out as I go and sharing what works"** story.

### Try the Products

**Elio** (Offline AI Assistant)
🔗 [GitHub](https://github.com/yukihamada/elio) | Free & Open Source

**ChatWeb.ai** (Voice + AI Browser Automation)
🔗 [chatweb.ai](https://chatweb.ai) | Free tier available

**News.xyz** (AI News Aggregator)
🔗 [news.xyz](https://news.xyz) | Free tier: 10 newsletters

**JiuFlow** (BJJ Training Tracker)
🔗 [jiuflow.com](https://jiuflow.com) | Free for individuals

### Join EnablerDAO

**Get EBR Tokens:**
- Use any product daily → earn 10 EBR/day
- Refer a friend → earn 100 EBR per conversion
- Contribute on GitHub → earn 1,000 EBR per merged PR

**Participate in Governance:**
- Vote on roadmap priorities
- Propose new features
- Help shape the future

**Resources:**
- 🌐 [enablerdao.com](https://enablerdao.com)
- 💬 [Discord Community](https://discord.gg/enablerdao)
- 🐙 [GitHub](https://github.com/yukihamada)
- 🐦 [Twitter](https://twitter.com/yukihamada)

### For Fellow Builders

If you're building AI products, Rust enthusiast, or just curious about the tech:

**All code is open source.** Learn from it. Steal from it. Improve it.

- Rust Lambda framework: [github.com/yukihamada/nanobot](https://github.com/yukihamada/nanobot)
- Next.js + Supabase patterns: [github.com/yukihamada/jiuflow](https://github.com/yukihamada/jiuflow)
- On-device LLM: [github.com/yukihamada/elio](https://github.com/yukihamada/elio)

**DMs are open.** Seriously. If you're building something and want to chat, reach out.

---

## Final Thoughts: The Journey Continues

![Image placeholder: Person training BJJ with laptop nearby]

12 months ago, I had a failed Product Hunt launch and a lot of self-doubt.

Today, I have:
- 4 products in production
- 2,105+ users across platforms
- ¥280K MRR and growing
- A community of builders and users helping shape what comes next

**But the most important thing isn't the revenue or the users.**

It's that **I'm building things I wish existed**, and other people want them too.

That's validation no Product Hunt score can provide.

Whether you're:
- A developer learning Rust
- An entrepreneur building your first product
- A BJJ practitioner trying to improve
- Someone who just loves AI

**There's a place for you in this journey.**

The mat taught me: Show up. Be consistent. Help your training partners. Growth happens in the doing.

Same applies to building products.

Let's build together.

---

**Yuki Hamada**
Founder, EnablerDAO
Purple Belt, Brazilian Jiu-Jitsu
Rust Enthusiast, AI Builder

*Built with 🥋 from Tokyo, Japan*

---

### P.S. - The Metric I Actually Care About

Not MRR. Not user count. Not Product Hunt scores.

**It's this:**

Last week, a JiuFlow user messaged me: *"I got my blue belt today. Your app helped me see what I needed to work on. Thank you."*

That's why I build.

If my products help even one person get better at something they care about - BJJ, productivity, staying informed - then all the late nights, all the failed launches, all the self-doubt...

It was worth it.

Now go build something.

---

**Image Suggestions for Article:**

1. **Hero**: Split screen - code on left, BJJ training on right
2. **Elio section**: Screenshot of Elio running on laptop during flight
3. **ChatWeb section**: Interface with voice waveform animation
4. **News.xyz section**: Dashboard showing curated news feed
5. **JiuFlow section**: Training stats and progress dashboard
6. **Architecture**: Diagram showing all 4 products' tech stacks
7. **Revenue**: 12-month growth chart
8. **DAO**: EnablerDAO logo with token visualization
9. **Lessons**: Journal with handwritten notes
10. **Roadmap**: Visual timeline of upcoming milestones
11. **CTA**: Collage of all 4 product interfaces
12. **Closing**: Person training with laptop nearby

**GIF Suggestions:**

1. Elio running in terminal (typing animation)
2. ChatWeb voice input → action execution
3. News.xyz deduplication in action
4. JiuFlow logging a training session

---

**SEO Keywords:**
- AI products
- Rust programming
- Serverless architecture
- BJJ training tracker
- Product Hunt launch
- Solo founder journey
- DAO governance
- Voice automation
- News aggregation
- On-device AI

**Target Length**: ~5,200 words ✓
