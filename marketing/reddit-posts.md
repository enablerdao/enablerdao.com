# Reddit Marketing Templates

Complete posting templates for Elio, ChatWeb.ai, News.xyz, and JiuFlow.

---

## 1. Elio (Offline AI)

### r/privacy (1.2M members)

**Title:** "Built an offline AI that never sends your data to the cloud"

**Body:**
I got tired of AI tools that require internet and upload everything to someone else's servers. Privacy shouldn't be a trade-off for using AI.

So I built Elio - a completely offline AI that runs locally on your Mac. No internet required, no data leaves your device, ever.

Key features:
- 100% offline, works on planes/cafes without WiFi
- Your conversations never leave your Mac
- Uses local models (Llama, Mistral, etc.)
- No subscriptions, no API costs

I've been using it for sensitive work docs and personal notes for 6 months. The peace of mind is worth it.

Currently Mac-only (Apple Silicon optimized), but considering Windows/Linux if there's interest.

Happy to answer questions about the tech stack or privacy architecture.

**Posting time:** Tuesday or Thursday, 9-11 AM PST

**Notes:**
- r/privacy values substance over hype
- Focus on privacy benefits, not sales
- Be ready to discuss technical details
- Mention open roadmap or transparency

---

### r/apple (4M members)

**Title:** "Made a native macOS AI app that feels like it belongs on Mac"

**Body:**
Fellow Mac users - I spent the last year building an AI assistant that actually feels native to macOS.

Most AI tools are Electron apps or web wrappers. I wanted something that respects Mac conventions: keyboard shortcuts, system integration, and that snappy M-series performance.

Elio is a 100% native Swift app:
- Optimized for Apple Silicon (insanely fast)
- Runs completely offline (no internet needed)
- Integrates with macOS (Shortcuts, Spotlight, etc.)
- Respects your battery life

It's what I wished ChatGPT's Mac app was - a real Mac app, not a glorified browser.

I'm a solo dev, so feedback is super valuable. What Mac features would you want in an AI assistant?

**Posting time:** Monday or Wednesday, 10 AM - 12 PM PST

**Notes:**
- r/apple appreciates design and native experiences
- Show screenshots if allowed
- Mention Apple Silicon optimization
- Avoid directly bashing other products

---

### r/LocalLLaMA (300K members)

**Title:** "Optimized local inference on M3 Max - 40 tokens/sec with Llama 3.1 70B"

**Body:**
I've been working on a macOS-native LLM runner and wanted to share some performance numbers.

Running Llama 3.1 70B (Q4 quantization) on M3 Max:
- 40-45 tokens/sec sustained
- 64GB unified memory fully utilized
- Metal acceleration (no CUDA needed)
- Cold start < 3 seconds

The app (Elio) focuses on making local models accessible:
- One-click model downloads from HuggingFace
- Automatic quantization selection based on RAM
- Context window management
- System-wide integration

For those running local models on Mac, I'm curious:
- What models do you run?
- What's your typical use case?
- Any pain points with existing tools (Ollama, LM Studio)?

Tech stack: Swift, Metal Performance Shaders, llama.cpp bindings.

Code snippets and benchmarks: [link to detailed blog post]

**Posting time:** Wednesday or Saturday, 8-10 AM PST

**Notes:**
- r/LocalLLaMA is highly technical
- Share actual benchmarks and code
- Engage with technical questions
- Mention llama.cpp compatibility
- Be humble, community knows their stuff

---

## 2. ChatWeb.ai (Web Automation)

### r/nocode (150K members)

**Title:** "Built a no-code AI that automates web tasks by just chatting"

**Body:**
I love the no-code movement, but felt like web automation still required too much setup (Zapier flows, API configs, etc.).

So I built ChatWeb - you literally just tell it what to do in plain English, and it does it.

Examples:
- "Find the top 5 BJJ gyms in Tokyo and save to spreadsheet"
- "Monitor this product page and alert me when price drops below $50"
- "Summarize today's tech news from HackerNews"

Behind the scenes:
- AI plans the steps (search, extract, transform)
- Executes tools (web search, scraping, file operations)
- Shows you what it's doing in real-time

It's like having a virtual assistant who can actually use the web.

Currently in beta - offering 100 free credits with code HAMADABJJ to early users.

What repetitive web tasks would you automate if you could just describe them?

**Posting time:** Tuesday or Thursday, 11 AM - 1 PM PST

**Notes:**
- r/nocode loves automation stories
- Share specific use cases
- Emphasize zero-code setup
- Offer beta access generously
- Ask for feedback on use cases

---

### r/Entrepreneur (3M members)

**Title:** "Automated my competitor research with AI - now takes 5 minutes instead of 2 hours"

**Body:**
As a solo founder, competitor research was eating up my mornings. Manually checking 10+ websites, copying into spreadsheets, looking for price changes...

I built ChatWeb to automate this. Now I just tell it:

"Check these 10 competitors, extract their pricing, features, and latest blog post. Put it in a spreadsheet."

It does everything:
- Searches the web
- Extracts the data
- Organizes into tables
- Sends me a daily summary

Other things I've automated:
- Lead research (LinkedIn + company website → CRM)
- Content ideas (scan Reddit/Twitter for trending topics)
- Supplier price monitoring

The AI plans the workflow, executes it, and shows its thinking. No coding required.

For other entrepreneurs: what manual research tasks slow you down?

Free beta access: [link] (code HAMADABJJ for 1000 credits)

**Posting time:** Monday or Wednesday, 7-9 AM PST (catch morning routine)

**Notes:**
- r/Entrepreneur wants ROI stories
- Lead with time/money saved
- Share specific workflows
- Avoid jargon, speak business value
- Engage with "how did you..." questions

---

### r/SideProject (200K members)

**Title:** "Show r/SideProject: ChatWeb - AI that automates boring web tasks"

**Body:**
Hey r/SideProject! Built this over nights/weekends for the past year.

**What it does:**
You chat with an AI, it automates web tasks. No code, no complex setup.

"Find the cheapest flight to Tokyo next month"
"Scrape this list of websites and compare prices"
"Send me a digest of r/SideProject top posts every morning"

**Tech stack:**
- Rust backend on AWS Lambda
- Multiple LLM providers (OpenAI, Anthropic, Gemini)
- Custom web scraping + tool execution engine
- LINE + Telegram integrations

**Learnings:**
- Tool calling is hard to get right (spent 3 months on reliability)
- Users want to SEE the AI thinking (added real-time SSE logs)
- Credit system needed careful design (ceiling division for fairness)

**Current state:**
- 500+ beta users
- 100K+ tool executions
- Revenue: ~$200 MRR (Stripe integrated)

**Ask me anything** about building agentic AI, monetization, or the tech choices.

Free credits for r/SideProject: code HAMADABJJ

[Link to demo video]

**Posting time:** Friday or Sunday, 2-4 PM PST (weekend browsing)

**Notes:**
- r/SideProject wants transparency
- Share metrics, tech stack, learnings
- Use "Show r/SideProject:" prefix
- Engage deeply with technical questions
- Offer feedback trades with other builders

---

## 3. News.xyz (AI News)

### r/productivity (1.5M members)

**Title:** "Replaced my morning news routine with AI summaries - save 45 min/day"

**Body:**
I used to spend an hour every morning scrolling through news sites, newsletters, Twitter...

Most of it was noise. I just wanted the signal.

So I built News.xyz - an AI that:
1. Scans 100+ sources (news sites, Reddit, HackerNews, Twitter)
2. Filters for topics I care about (tech, AI, startups)
3. Summarizes everything into a 5-minute read
4. Delivers it at 7 AM

Now my morning routine:
- 7:00 AM: Check News.xyz digest
- 7:05 AM: Actually informed about what matters
- Save 45 minutes for deep work

You can customize:
- Topics/keywords to track
- Sources to include/exclude
- Delivery time
- Summary length

It's free to try. Anyone else trying to optimize their news consumption?

**Posting time:** Sunday or Monday, 6-8 AM PST (morning routine planning)

**Notes:**
- r/productivity loves time-saving hacks
- Lead with concrete time saved
- Share your routine
- Focus on signal-to-noise improvement
- Avoid "yet another news app" vibe

---

### r/Futurology (20M members)

**Title:** "AI is now better at summarizing the news than human editors"

**Body:**
Hot take: The traditional news editor role is becoming obsolete.

I've been running an experiment for 6 months - AI-curated news vs. human-curated news.

**What I found:**
- AI coverage is 10x broader (can scan 100+ sources vs. 10)
- AI has no editorial bias (doesn't push an agenda)
- AI personalizes to each reader (everyone gets different summaries)
- AI updates in real-time (no daily edition cutoff)

**What AI still lacks:**
- Investigative journalism (reporting, not summarizing)
- Contextual nuance (why X matters beyond the facts)
- Ethical judgment (what to cover vs. sensationalize)

News.xyz is my implementation of AI-first news:
- Scans everything (Reddit, Twitter, official news, blogs)
- Filters for your interests
- Delivers personalized daily digests

The future of news is AI curators + human investigators. Not one or the other.

What do you think - will AI replace news editors, or augment them?

**Posting time:** Tuesday or Thursday, 12-2 PM PST (lunch break browsing)

**Notes:**
- r/Futurology wants big ideas and debate
- Take a strong (but defensible) position
- Acknowledge limitations
- Invite disagreement
- Link to product subtly, focus on discussion

---

### r/technology (15M members)

**Title:** "Built an AI that reads all of HackerNews, Reddit, and tech news so I don't have to"

**Body:**
Information overload is real. HackerNews front page, 50 tech newsletters, Reddit tech subs, Twitter...

I wanted the opposite of a news feed - give me the insights, skip the scroll.

Built News.xyz:
- AI reads 100+ sources every hour
- Identifies trending topics (weighted by source credibility)
- Summarizes key points
- Sends you a digest (daily or weekly)

Example digest:
- "Anthropic released Claude Opus 4.6 - 25% better coding, 40% cheaper"
- "Meta's Llama 4 leaked - multimodal, 400B params"
- "GitHub Copilot now has agentic mode - writes full features"

Each item = 2 sentences + source links for deep dive.

It's like having a research assistant who reads everything and briefs you.

Open to feedback - what would make this more useful for you?

**Posting time:** Wednesday or Friday, 3-5 PM PST (afternoon break)

**Notes:**
- r/technology is massive and competitive
- Hook needs to be strong (information overload is relatable)
- Show actual value (example digest)
- Engage with criticism constructively
- Avoid overpromising

---

## 4. JiuFlow (BJJ App)

### r/bjj (500K members)

**Title:** "Made an app to track my BJJ journey - now 100+ athletes are using it"

**Body:**
OSS r/bjj!

I was tracking training in Notes app - messy, no structure, couldn't see progress.

Built JiuFlow to fix this:
- Log techniques learned (categorized by position/submission)
- Track training sessions (who, what, notes)
- Set goals (compete in 6 months, get blue belt, master triangle)
- Browse athlete profiles (Mikey Musumeci, Gordon Ryan, etc.)

Favorite feature: "Technique catalog" - search any move (e.g., "kimura from closed guard") and see:
- Step-by-step breakdown
- Video references
- Which athletes are known for it

We have 100+ pro athlete profiles with bios, titles, and notable techniques.

It's free, no ads. Built because I needed it.

Fellow grapplers - what do you use to track your training?

**Posting time:** Tuesday or Thursday, 6-8 PM PST (post-training)

**Notes:**
- r/bjj is friendly but hates sales-y posts
- Lead with personal story (fellow practitioner)
- Use BJJ terms naturally (OSS, blue belt, etc.)
- Focus on training value, not tech
- Share it as a tool you'd recommend to training partners

---

### r/martialarts (300K members)

**Title:** "Tracking progress in martial arts - built an app, looking for feedback"

**Body:**
I train BJJ and was frustrated with tracking my progress. Tried spreadsheets, notes apps, even paper journals.

Nothing worked well for martial arts because:
- Techniques are complex (position → transition → submission)
- Progress is non-linear (some days you get crushed)
- Goals are specific (master X guard, compete at Y level)

Built JiuFlow (starting with BJJ, expanding to other arts):
- Technique library (categorized by position/style)
- Training log (sessions, sparring notes, what worked/didn't)
- Goal tracking (with progress visualization)
- Athlete database (study your favorite fighters)

Question for r/martialarts:
- What art do you train?
- How do you track progress?
- What features would make this useful for your discipline?

Plan is to expand to Muay Thai, Judo, Wrestling, etc. if there's interest.

App is free, just want to make something useful for the community.

**Posting time:** Monday or Saturday, 10 AM - 12 PM PST (morning/weekend)

**Notes:**
- r/martialarts covers many styles
- Emphasize BJJ is just the start
- Ask for feedback on other disciplines
- Position as community tool, not product
- Engage with users of other martial arts

---

## Common Q&A Response Templates

### "How much does it cost?"

**For freemium products (ChatWeb, News.xyz):**
"Free tier gives you [X credits/features]. Paid plans start at $9/month. Honestly, most people stay on free tier unless they're heavy users. Try it first - code HAMADABJJ gives you 1000 credits to start."

**For Elio:**
"One-time purchase, $[X] (still finalizing pricing). No subscription, no usage limits. Wanted to avoid the 'pay forever' model."

**For JiuFlow:**
"100% free, no ads. Built it for the BJJ community. Might add premium features later (video hosting, 1-on-1 coaching marketplace) but core tracking will always be free."

---

### "Is it open source?"

**If not open source:**
"Not currently, but I'm considering it. Main concern is API keys and infrastructure costs if it gets forked everywhere. What would you want to self-host?"

**If considering open source:**
"Planning to open-source the core engine once I clean up the code. Right now it's a mess of prototypes and hard-coded API keys. Want to do it right. GitHub: [link to roadmap issue]"

**If open source:**
"Yes! MIT licensed. Contributions welcome: [GitHub link]. I respond to issues within 24 hours usually."

---

### "How is this different from [existing tool]?"

**For ChatWeb vs. Zapier/Make:**
"Zapier is great for predefined workflows. ChatWeb is for ad-hoc tasks - you describe what you want right now, it figures it out. No workflow building. More like a junior employee than an automation platform."

**For Elio vs. Ollama/LM Studio:**
"Ollama and LM Studio are fantastic runners. Elio is a complete app - think of it as the ChatGPT interface, but for local models. Keyboard shortcuts, system integration, conversation management. Different use case."

**For News.xyz vs. newsletters:**
"Newsletters are human-curated (slower, narrower coverage). News.xyz is AI-curated (real-time, broader, personalized). Best use: News.xyz for daily breadth, newsletters for deep analysis."

**For JiuFlow vs. training logs:**
"Most tracking is generic (reps/sets) or diary-style. JiuFlow is martial arts-specific - understands positions, techniques, goals like 'get better at guard retention'. Structure makes progress visible."

---

### "What about privacy/data?"

**For Elio:**
"Everything is 100% local. No internet connection required, no telemetry, no data sent anywhere. I literally can't see your data even if I wanted to. That's the whole point."

**For ChatWeb/News.xyz (cloud-based):**
"Your data is stored in AWS (encrypted at rest and in transit). We use it only to provide the service - no selling, no training AI on your data, no sharing. Happy to share detailed privacy policy: [link]"

**For JiuFlow:**
"Data is stored in Supabase (PostgreSQL). Used only for app functionality. No tracking, no analytics beyond basic usage metrics (which pages are popular). You can export/delete anytime."

---

### "Can I try before buying?"

**Always:**
"Yes! [Free tier details / beta access link / trial code]. No credit card required to start. I built this for myself first, so I want you to actually use it before deciding."

---

### "When is [feature X] coming?"

**If planned:**
"It's on the roadmap for [timeframe]. You can track progress here: [GitHub issue/public roadmap]. If it's important to you, upvote it - I prioritize based on user requests."

**If not planned:**
"Hadn't considered that, but it's interesting. Can you share your use case? If enough people want it, I'll bump it up the roadmap. [Link to feature request form]"

**If out of scope:**
"That's a bit outside the core use case I'm solving. But [suggest alternative tool/workaround]. Happy to chat about integrations if there's a good fit."

---

## Posting Best Practices

### Timing (all times PST)

**Best days:**
- Tuesday, Wednesday, Thursday (mid-week engagement)
- Sunday (weekend project browsing)

**Avoid:**
- Monday mornings (inbox hell)
- Friday afternoons (weekend mode)
- Saturdays (lower Reddit traffic)

**Best times:**
- **Morning:** 8-11 AM (catching up on feeds)
- **Lunch:** 12-1 PM (break browsing)
- **Afternoon:** 3-5 PM (procrastination hours)
- **Evening:** 6-8 PM (post-work relaxation)

### Engagement Strategy

**First 2 hours are critical:**
- Respond to EVERY comment (builds momentum)
- Upvote questions (encourages more engagement)
- Give detailed, helpful answers
- Don't be defensive to criticism

**After initial wave:**
- Check back every 4-6 hours
- Continue engaging for 24-48 hours
- Thank people for feedback
- Update post with "Edit:" for common questions

### Red Flags to Avoid

**Don't:**
- Post the same content to multiple subreddits same day (looks spammy)
- Ignore negative comments (makes you look sketchy)
- Over-promote (max 10% of your Reddit activity should be self-promo)
- Use URL shorteners (often auto-removed)
- Post and ghost (engagement is required)

**Do:**
- Participate in the community beyond your posts
- Comment on others' projects
- Share knowledge freely
- Admit limitations honestly
- Thank critics and users equally

### Subreddit-Specific Rules

**Before posting, check:**
- Allowed post types (some require "Show HN" or "[Project]" tags)
- Self-promotion rules (some limit frequency)
- Flair requirements (tag your post correctly)
- Karma/account age minimums

**Common requirements:**
- r/Entrepreneur: Flair your post + engage in comments
- r/SideProject: Use "Show r/SideProject:" prefix
- r/privacy: No direct links in post body (put in comments)
- r/bjj: Use "OSS" or respectful tone
- r/LocalLLaMA: Technical depth expected

---

## Post-Posting Checklist

**Within 1 hour:**
- [ ] Responded to first 3 comments
- [ ] Fixed any typos/broken links
- [ ] Upvoted all questions
- [ ] Shared post to Twitter/other channels

**Within 24 hours:**
- [ ] Responded to all comments
- [ ] Updated post with "Edit:" for FAQs
- [ ] Noted feedback for product improvements
- [ ] Thanked top commenters

**Within 1 week:**
- [ ] Messaged interested users with beta access
- [ ] Incorporated feedback into roadmap
- [ ] Followed up with anyone who requested updates
- [ ] Analyzed what worked/didn't work for next post

---

## Coupon Code Strategy

**Universal code:** HAMADABJJ
- ChatWeb: 1000 credits (vs. 100 default)
- News.xyz: 1 month Pro free
- Elio: 20% off (if paid)
- JiuFlow: Early access to premium features

**Reddit-specific codes (track which subreddits convert):**
- REDDIT_PRIVACY (r/privacy)
- REDDIT_LOCALLLAMA (r/LocalLLaMA)
- REDDIT_BJJ (r/bjj)
- REDDIT_ENTREPRENEUR (r/Entrepreneur)

**Tracking:**
Use UTM parameters: `?utm_source=reddit&utm_medium=post&utm_campaign=[subreddit]`

---

## Success Metrics

**Engagement:**
- Target: 50+ upvotes, 20+ comments
- Great: 200+ upvotes, 50+ comments
- Viral: 1000+ upvotes, 100+ comments

**Conversion:**
- 5-10% of commenters try the product
- 1-2% convert to paid (from free trial)

**Community value:**
- Positive sentiment in comments
- Users sharing with others
- Requests for AMAs or follow-ups
- Other devs asking technical questions

---

*Last updated: 2026-02-14*
*Adjust based on performance data and community feedback*
