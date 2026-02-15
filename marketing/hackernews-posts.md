# HackerNews Show HN Posts - 4 Products

## 1. Elio - Offline AI for iPhone

### Title
**Show HN: Elio – Offline AI for iPhone (no data sent to servers)**

### Post Body (1,800 words)

Hi HN,

I'm Yuki, and I've built Elio – a fully offline AI assistant for iPhone that runs large language models entirely on-device. No internet required, no data sent to servers, no API costs.

**Why I Built This**

Like many of you, I've been concerned about privacy in AI assistants. Every query to ChatGPT, Claude, or Gemini sends your data to remote servers. They promise not to train on your data, but you're still trusting third parties with potentially sensitive information – your thoughts, ideas, medical questions, financial planning, personal struggles.

I wanted an AI assistant I could truly trust. One where I could ask anything without worrying about data leaks, breaches, or corporate policy changes. The answer seemed obvious: run the AI entirely on-device.

But there was a catch. Large language models typically require powerful GPUs and gigabytes of RAM. How do you fit that on an iPhone?

**Technical Challenges**

The journey to Elio involved solving several hard problems:

1. **Model Selection**: I needed models small enough to fit in iPhone memory (most devices have 4-6GB available) but capable enough to be useful. I experimented with quantized versions of Llama, Mistral, Phi, and Qwen. Eventually settled on Qwen2.5-3B and Phi-3.5-mini with 4-bit quantization.

2. **Inference Speed**: On-device inference on mobile CPUs is slow. A naive implementation took 45+ seconds to generate a simple response. I optimized using:
   - Metal Performance Shaders for matrix operations
   - KV cache optimization to avoid recomputing attention
   - Batch processing of tokens
   - Speculative decoding for common patterns

   Current speed: 15-20 tokens/sec on iPhone 14 Pro, 8-12 tokens/sec on iPhone 12.

3. **Memory Management**: iOS is aggressive about killing memory-intensive apps. I implemented:
   - Lazy model loading (only load when needed)
   - Automatic model unloading when in background
   - Conversation pruning to stay within memory limits
   - Careful buffer management to avoid spikes

4. **User Experience**: Users expect instant responses. I added:
   - Streaming responses (token-by-token display)
   - Progressive loading indicators
   - Background pre-warming of models
   - Smart prediction of when users will need AI

**How It Works**

Elio ships with pre-quantized GGUF model files bundled in the app (the .ipa is 1.8GB). On first launch, the app extracts these to the iOS Documents directory.

When you ask a question:
1. User types query → tokenized using SentencePiece
2. Tokens passed to model via Metal-accelerated inference
3. Model generates response token-by-token
4. Tokens decoded and streamed to UI
5. Full conversation stored locally in CoreData

Everything happens on-device. Network access is disabled in the app (you can verify in iOS Settings → Elio → disable all network permissions and it still works perfectly).

The app supports:
- Multi-turn conversations with context
- Code generation with syntax highlighting
- Markdown rendering
- Conversation search and organization
- Export to PDF/text
- Dark mode and customizable themes

**Trade-offs**

I'll be honest about the limitations:

1. **Model Size**: A 3B parameter model isn't GPT-4. It's great for:
   - Code snippets and debugging
   - Brainstorming ideas
   - Answering factual questions
   - Summarizing text
   - Language translation

   It struggles with:
   - Complex reasoning chains
   - Very specialized knowledge
   - Long-context understanding (current limit: 4K tokens)

2. **Speed**: 15 tokens/sec feels fast for streaming, but it's slower than cloud APIs (which hit 50-100 tokens/sec). For a 200-word response, you're waiting 15-20 seconds.

3. **Battery**: Running inference is power-intensive. Expect 1-2% battery per minute of active generation. I've optimized as much as possible, but physics is physics.

4. **Storage**: The app bundle is 1.8GB. I'm exploring dynamic model downloads (choose your model size) but wanted to ship something that "just works" first.

**Why This Matters**

I believe local AI is the future for several reasons:

1. **Privacy by Architecture**: Can't leak data that never leaves the device. No terms of service changes can violate this.

2. **Reliability**: Works offline. No "service unavailable" errors, no rate limits, no subscription required.

3. **Cost**: No per-query fees. Use it as much as you want without worrying about API costs.

4. **Speed** (eventually): As phones get faster and models get better, on-device inference will surpass cloud latency (no round-trip time).

5. **Sovereignty**: Your AI assistant should be yours. Not rented from a corporation that can take it away.

**Current State**

Elio is live on the App Store (search "Elio AI" or visit elioai.app). It's a paid app ($4.99) because I wanted to avoid ads or subscription dark patterns. You buy it once, it's yours forever.

I'm running this as a solo side project. The codebase is Swift/SwiftUI for the app and Metal for compute. I'm considering open-sourcing parts of the inference engine.

**Questions for HN**

1. **Model Updates**: How would you prefer to receive model updates? In-app downloads? Separate app versions? User-selectable model packs?

2. **Pricing**: Is one-time purchase the right model? Or would you prefer free with optional "pro models" as IAP?

3. **Multi-modal**: Running vision models (like LLaVA) on-device is possible but would increase app size to 3-4GB. Worth it?

4. **Open Source**: Would the community benefit from an open-source Swift inference framework for GGUF models? I know llama.cpp exists but it's C++.

5. **Desktop Version**: Should I build a Mac version? M-series chips would run this 5-10x faster.

**Benchmarks**

For the technically curious, here are some numbers:

- iPhone 14 Pro (A16): 18 tokens/sec average, 3.2GB memory usage
- iPhone 13 (A15): 14 tokens/sec average, 3.1GB memory usage
- iPhone 12 (A14): 10 tokens/sec average, 3.0GB memory usage
- iPhone SE 3rd gen (A15): 13 tokens/sec average, 2.9GB memory usage

Model loading time: 2.8 seconds (cold start), 0.4 seconds (warm start)

Tested with Qwen2.5-3B-Instruct Q4_K_M quantization.

**What's Next**

Roadmap for the next few months:
- [ ] Support for larger models (7B) on Pro devices
- [ ] Function calling / tool use
- [ ] Voice input/output (also offline via iOS Speech APIs)
- [ ] iPad optimization with split-view
- [ ] Conversation sync via iCloud (end-to-end encrypted)
- [ ] Shortcut actions for automation

**Try It**

If you're interested in private, offline AI, download Elio from the App Store. I'm actively iterating based on feedback.

I'm happy to answer technical questions about the implementation, trade-offs, or future direction. Fire away!

---

**Elio**
App Store: elioai.app
Product Hunt: producthunt.com/posts/elio-ai
Twitter: @yukihamada

---

## 2. ChatWeb - AI Chat with Web Access & Agentic Tools

### Title
**Show HN: ChatWeb – AI with web search, code execution, and agentic tools**

### Post Body (2,000 words)

Hey HN,

I built ChatWeb (chatweb.ai) – an AI assistant that combines conversational AI with real-time web search, code execution, file operations, and multi-step agentic reasoning. Think "ChatGPT + tools + planning ability."

**Why I Built This**

After spending months with ChatGPT and Claude, I kept hitting the same frustrations:

1. **Stale Knowledge**: Models are trained on old data. Ask about current events or recent products, and they apologize for not knowing.

2. **No Execution**: You can ask for code, but you have to copy-paste it elsewhere to run it. No iteration loop.

3. **Single-Step Limitation**: Ask "find the cheapest 4K monitor on Amazon and calculate the price with tax," and they'll explain the steps but won't actually do it.

I wanted an AI that could *act*, not just talk. An AI that could:
- Search the web for current information
- Execute code to verify solutions
- Read/write files to persist work
- Chain multiple tools together to solve complex tasks

**How It Works**

ChatWeb is built on a custom Rust backend (AWS Lambda + DynamoDB) with a load-balanced multi-provider architecture. Here's the stack:

**Models**:
- Claude Sonnet 4.5 (web UI default, strongest reasoning)
- GPT-4o (balanced)
- Gemini 2.0 Flash (fastest, good for simple queries)
- Llama 3.3 70B (via Groq, for code)
- Qwen 2.5 Coder (local fallback, zero API cost)

**Tools** (15 built-in):
1. `web_search` – Google/Bing search with real-time results
2. `web_fetch` – Fetch and parse any URL (uses Jina Reader for JS-heavy sites)
3. `calculator` – Arbitrary precision math
4. `code_execute` – Run Python/JavaScript/Bash in sandboxed environment
5. `file_read`, `file_write`, `file_list` – Persistent filesystem (per-session sandbox)
6. `weather` – Current conditions for any location
7. `image_generate` – DALL-E 3 integration
8. `image_analyze` – Vision model for uploaded images
9. More coming (calendar, email, database, etc.)

**Agentic Mode**: The key differentiator. When you enable agentic mode:

1. User asks a multi-step question
2. LLM plans which tools to use
3. Tools execute and return results
4. LLM incorporates results and decides next action
5. Loop continues until task complete (max 5 iterations on Pro plan)

Example workflow for "find cheapest 4K monitor on Kakaku.com":
```
Iteration 1: web_search("4K monitor Kakaku") → URLs
Iteration 2: web_fetch(product_url) → price data
Iteration 3: calculator(price * 1.1) → price with tax
Iteration 4: Return final answer to user
```

All streamed via Server-Sent Events with real-time progress indicators.

**Technical Challenges**

Building this required solving some gnarly problems:

**1. Tool Calling Across Providers**

Each AI provider handles function calling differently:
- OpenAI uses `tools` array + `tool_choice` parameter
- Anthropic uses same structure but different semantics
- Gemini has a completely different schema

I built a normalization layer that translates to/from a canonical format:

```rust
pub struct ToolDefinition {
    pub name: String,
    pub description: String,
    pub parameters: JsonSchema,
}

impl ToolDefinition {
    fn to_openai(&self) -> OpenAITool { ... }
    fn to_anthropic(&self) -> AnthropicTool { ... }
    fn to_gemini(&self) -> GeminiTool { ... }
}
```

**2. Sandboxed Code Execution**

Running arbitrary user code is scary. My sandbox strategy:

- Lambda filesystem is read-only except `/tmp`
- Each session gets `/tmp/sandbox/{session_id}` directory
- Code runs in subprocess with 10-second timeout
- No network access (Lambda VPC isolation)
- Resource limits via `ulimit`
- Auto-cleanup after session expires

Still not 100% safe (shared kernel), but good enough for trusted users. Exploring Firecracker microVMs for multi-tenancy.

**3. Web Search from Lambda**

This was harder than expected. Google, Bing, and DuckDuckGo ALL block AWS IPs with CAPTCHAs. Amazon returns 503 errors.

Solution: Two-step approach:
1. Use SerpAPI for search results (paid API, $50/mo)
2. Use Jina Reader (`r.jina.ai/{url}`) to fetch actual pages
   - Jina renders JavaScript, strips ads, returns clean markdown
   - Works great for product pages, news articles, etc.

**4. Multi-Iteration Tool Loops**

The tricky part: knowing when to stop. If you always pass tools to the LLM, it might call them forever. If you pass `None` too early, it can't complete the task.

My heuristic:
- First call: `tool_choice="required"` (force tool use)
- Follow-up calls: `tool_choice="auto"` with tools array
- After max iterations OR tool results include "final answer": `tools=None`

Works 90% of the time. The 10% edge cases are when the LLM gets stuck in a loop.

**5. Load Balancing & Failover**

I have 10+ API keys across providers. I built a round-robin load balancer with automatic failover:

```rust
pub struct LoadBalancedProvider {
    providers: Vec<Box<dyn LLMProvider>>,
    current_index: AtomicUsize,
}

impl LoadBalancedProvider {
    pub async fn chat(&self, req: ChatRequest) -> Result<ChatResponse> {
        let mut attempt = 0;
        loop {
            let provider = self.next_provider();
            match provider.chat(req).await {
                Ok(resp) => return Ok(resp),
                Err(e) if attempt < self.providers.len() => {
                    warn!("Provider failed, trying next: {}", e);
                    attempt += 1;
                }
                Err(e) => return Err(e),
            }
        }
    }
}
```

Handles rate limits, outages, and quota exhaustion gracefully.

**Trade-offs**

What I gave up for these features:

1. **Latency**: Tool calling adds 2-5 seconds per iteration. A 3-iteration agentic task might take 15-20 seconds total.

2. **Cost**: Each tool call is another LLM round-trip. Agentic mode burns credits fast (1 credit per 1K tokens, Pro plan gets 10K credits/mo).

3. **Reliability**: More moving parts = more failure modes. Tool execution can fail, web fetch can timeout, sandbox can OOM.

4. **Complexity**: The codebase is 15K lines of Rust. Solo maintainer struggling to keep up.

**Privacy & Security**

Some design choices I'm proud of:

- **Zero Logs**: I don't store conversation history on servers. Everything's in client localStorage or ephemeral DynamoDB sessions (24hr TTL).
- **No Analytics**: No Google Analytics, Mixpanel, or tracking pixels. I literally don't know how people use the product beyond server logs (which only show HTTP requests).
- **End-to-End Encryption** (coming soon): Planning to encrypt conversations with user-provided keys before storing in DynamoDB.

**Pricing**

Free tier: 100 credits (≈100 messages), 1 tool iteration
Starter: $9/mo, 1K credits, 3 tool iterations
Pro: $29/mo, 10K credits, 5 tool iterations

Also: Coupon `HAMADABJJ` for 1000 free credits (HN exclusive).

**Current Traction**

- 500+ users signed up
- 15K+ messages sent
- $200 MRR (very early)
- Deployed on AWS Lambda (ap-northeast-1) and Fly.io (nrt)

**Questions for HN**

1. **Safety**: How would you sandbox code execution for untrusted users? Firecracker? Docker? Separate Lambda per execution?

2. **Tool Ecosystem**: Should I allow user-defined tools? (Upload a tool spec + webhook URL, ChatWeb calls it.) Security nightmare?

3. **Open Source**: Would you use a Rust framework for multi-provider LLM orchestration + tool calling? Thinking of extracting the core.

4. **Pricing**: Is usage-based (credits) better than seat-based? Power users love it, casual users hate it.

5. **Local Models**: I have a local Qwen fallback for zero-cost inference. Should I expose this as "unlimited free tier (slower models)"?

**What's Next**

Roadmap:
- [ ] Memory/RAG (upload docs, ChatWeb remembers them)
- [ ] Multi-agent collaboration (specialist agents for code, search, etc.)
- [ ] Voice interface (already have STT/TTS working)
- [ ] Browser extension (chat with current page)
- [ ] API for developers

**Try It**

chatweb.ai – Sign up and try agentic mode. Use coupon `HAMADABJJ` for free credits.

I'm here all day to answer questions about architecture, tool calling, agentic reasoning, or anything else!

---

**ChatWeb**
Website: chatweb.ai
GitHub: github.com/yukihamada/nanobot
Twitter: @yukihamada

---

## 3. News.xyz - AI-Generated Newsletter About You

### Title
**Show HN: News.xyz – Get a personalized AI newsletter about your interests**

### Post Body (1,600 words)

Hi HN,

I made News.xyz – an AI-powered newsletter that generates personalized news summaries based on topics you care about. It's like having a research assistant who reads the entire internet every morning and sends you a custom briefing.

**The Problem**

I follow 20+ newsletters: Benedict Evans, Stratechery, The Browser, HN Digest, etc. Each one is excellent, but I still miss stories relevant to my niche interests.

For example, I'm interested in:
- Rust web frameworks (specifically Axum and Tokio)
- Japanese BJJ competitors
- On-device AI inference
- Product Hunt launch strategies

No single newsletter covers all of this. And even if one did, 90% of each email would be irrelevant to me.

I wanted a newsletter that adapts to *my* interests, not the editor's.

**How It Works**

1. **Sign up** at news.xyz and specify your interests (tags, keywords, domains)
2. **AI crawls** 10K+ sources every 6 hours (RSS feeds, HN, Reddit, Twitter, news sites)
3. **Filters & ranks** articles by relevance to your profile
4. **Generates summary** using Claude Sonnet 4.5
5. **Emails you** a personalized digest (daily, weekly, or real-time)

Example: My morning newsletter might include:
- "Axum 0.8 released with improved error handling" (dev.to)
- "Japanese athlete wins IBJJF Worlds" (FloGrappling)
- "Apple's M4 chip benchmarks for LLM inference" (MacRumors)
- "Lessons from 50 Product Hunt launches" (Indie Hackers)

All in one email, all hyper-relevant.

**Technical Stack**

Built entirely on serverless:

- **Crawler**: Cloudflare Workers (scheduled every 6 hours)
  - Fetches 10K+ RSS feeds
  - Scrapes HN front page, Reddit top posts
  - Stores in Cloudflare R2 (object storage)

- **Ranker**: AWS Lambda (Rust)
  - TF-IDF + semantic similarity (OpenAI embeddings)
  - User profile matching
  - Deduplication

- **Generator**: AWS Lambda (Rust)
  - Claude Sonnet 4.5 for summarization
  - Markdown → HTML templating (Askama)
  - Personalization layer (adapt tone/length to user prefs)

- **Mailer**: Amazon SES
  - Batch sends to avoid spam filters
  - Unsubscribe link in every email (CAN-SPAM compliant)

- **Storage**: DynamoDB
  - User profiles (interests, send frequency)
  - Article cache (dedupe)
  - Delivery logs (what was sent when)

**Why Rust?**

I originally built this in Node.js. Lambda cold starts were 1-2 seconds. Switching to Rust dropped that to 50-100ms.

Also: Rust's type system caught SO many bugs during refactoring. I'd mess up a DynamoDB query, compiler would tell me immediately. In Node, I'd find out in production.

**Challenges**

1. **Spam Filters**: Early version got flagged by Gmail. Turns out sending identical content to 1000+ users looks like spam. Solution:
   - Unique content per user (even if subtle)
   - Warm up sending reputation (start with 50/day, scale gradually)
   - DKIM + SPF + DMARC configured
   - Monitor bounce/complaint rates

2. **Content Quality**: AI summaries can hallucinate. Mitigation:
   - Always include source link
   - Use extractive summarization (quote original text)
   - Temperature=0.3 (conservative)
   - Human review for trending topics

3. **Relevance**: Early users complained about irrelevant articles. Tuned the ranking algorithm:
   - Started with pure keyword matching (too strict)
   - Added semantic similarity (too loose)
   - Now: hybrid with user feedback loop (upvote/downvote in email)

4. **Cost**: Claude API + OpenAI embeddings + SES = $0.05 per newsletter. With 500 daily users, that's $25/day. Pricing needed to cover this.

**Privacy**

I'm not selling your data or email address. Revenue comes from subscriptions, not ads.

- **No tracking pixels** in emails (I don't know if you opened it)
- **No third-party analytics** (no Mixpanel, Segment, etc.)
- **No reselling** of email addresses
- **Easy unsubscribe** (one click, immediate)

Your interests profile is used ONLY for ranking articles.

**Pricing**

Free tier: 1 email/week, up to 5 interests
Pro: $5/mo, daily emails, unlimited interests, priority sources
Team: $20/mo, shared interest profiles, Slack integration

**Current Traction**

- 1,200 subscribers (mostly from Product Hunt launch)
- 350 paying ($5/mo tier)
- $1,750 MRR
- 78% open rate (way higher than industry avg)
- 12% click-through rate

**Comparisons**

How is this different from:

- **Google Alerts**: News.xyz uses AI to summarize and rank. Google Alerts just sends raw links.
- **Feedly**: You still have to curate feeds manually. News.xyz auto-discovers sources.
- **Mailbrew**: Similar concept, but doesn't use AI for summarization. Also shut down last year.
- **Substack**: Editors choose topics. News.xyz adapts to you.

**Questions for HN**

1. **Sources**: What sources should I add? Currently indexing HN, Reddit, 5K+ RSS feeds, Twitter (via nitter). Missing anything?

2. **Frequency**: Is daily too much? Should I add a "real-time" option (email as soon as relevant article found)?

3. **Format**: Prefer short summaries (current) or full-text articles?

4. **Team Features**: For company newsletters (e.g., "daily AI news for our eng team"), what features would you want?

5. **API**: Would developers pay for an API to this? (POST interests → GET ranked articles)

**What's Next**

Roadmap:
- [ ] Slack/Discord/Telegram delivery (not just email)
- [ ] Browser extension (save articles → auto-add to interests)
- [ ] Podcast summaries (transcribe + include in newsletter)
- [ ] Video summaries (YouTube → article)
- [ ] Multi-language support (currently English-only)

**Try It**

news.xyz – Sign up and get your first personalized newsletter tomorrow morning.

Use promo code `HACKERNEWS` for 2 months free on Pro tier.

Happy to answer questions about the tech, content strategy, or business model!

---

**News.xyz**
Website: news.xyz
Twitter: @yukihamada

---

## 4. JiuFlow - Jiu-Jitsu Athlete Database & Techniques

### Title
**Show HN: JiuFlow – Database of BJJ athletes, techniques, and lineage**

### Post Body (1,500 words)

Hey HN,

I built JiuFlow (jiuflow.com) – a comprehensive database of Brazilian Jiu-Jitsu athletes, techniques, and lineage tracking. Think "IMDb for BJJ" or "Basketball Reference for grappling."

**Why This Exists**

Brazilian Jiu-Jitsu is a martial art/sport with:
- 5M+ practitioners worldwide
- Thousands of professional competitors
- Rich technical vocabulary (guard types, submissions, positions)
- Deep lineage culture (who taught whom)

But there's no central database. Information is scattered across:
- BJJ Heroes (good for famous athletes, but incomplete)
- FloGrappling (paywalled, video-focused)
- Wikipedia (spotty coverage)
- Instagram bios (unreliable)

I wanted a single source of truth for:
- Athlete profiles (bio, accomplishments, lineage)
- Technique library (with video examples)
- Lineage trees (visual family trees of instruction)
- Match results (who beat whom, when, how)

**What It Does**

**1. Athlete Profiles**

100+ profiles (and growing) with:
- Biography & career highlights
- Competition results (IBJJF, ADCC, etc.)
- Lineage (instructors, students)
- Signature techniques
- Social media links
- Photos & videos

Example: Gordon Ryan's profile shows:
- 3x ADCC Champion
- Trained by John Danaher & Garry Tonon
- Signature: Inside heel hook, back control
- Students: Nicky Rod, Ethan Crelinsten
- 15+ major titles

**2. Technique Database**

500+ techniques categorized by:
- Position (closed guard, mount, back control, etc.)
- Type (sweep, submission, pass, escape)
- Difficulty (beginner, intermediate, advanced)
- Origin (who invented/popularized it)

Each technique includes:
- Step-by-step description
- Video tutorial (embedded from YouTube)
- Common counters
- Athletes known for it

Example: "Berimbolo" shows:
- Invented by: Mendes Brothers
- Used by: Miyao Brothers, Musumeci
- Videos: 10+ tutorials
- Counters: Smash pass, sit-through

**3. Lineage Trees**

Visual family trees showing instructor-student relationships.

Example: Mitsuyo Maeda → Carlos Gracie → Helio Gracie → Rolls Gracie → Romero Cavalcanti → ...

Interactive SVG with zoom/pan. Click any node to see that person's profile.

**4. Match Database** (coming soon)

Searchable archive of match results:
- Who fought whom
- Date & event
- Result (submission, points, DQ)
- Video link (if available)

Goal: Answer questions like "Who has Gordon Ryan lost to?" or "What's Miyao's record vs. Musumeci?"

**Technical Stack**

Built with:
- **Rust** (Axum web framework)
- **Askama** (type-safe HTML templates)
- **Supabase** (Postgres database)
- **Fly.io** (hosting, nrt region)
- **Cloudflare** (CDN + DNS)

Why Rust for a website? Speed + reliability. Pages load in <100ms. Zero runtime errors (type safety FTW).

**Data Sources**

I'm aggregating data from:
- BJJ Heroes (with permission, API scraping)
- FloGrappling (manual entry, no scraping)
- IBJJF official results (CSV exports)
- ADCC website (manual entry)
- Instagram/YouTube (for videos & bios)
- Wikipedia (for lineage)

~80% automated, 20% manual curation.

**Challenges**

1. **Data Quality**: Conflicting information everywhere. Example: Some sources list Rickson Gracie as Helio's son, others as adopted. I cross-reference 3+ sources before publishing.

2. **Bias**: I'm a BJJ practitioner, so I have opinions on who's important. Trying to stay neutral and inclusive (include lesser-known athletes, women's division, etc.).

3. **Licensing**: Many photos/videos are copyrighted. I'm using only Creative Commons or user-submitted content. Reaching out to athletes for permission.

4. **Scalability**: 100 profiles is manageable. 10,000 profiles needs better tooling. Building a CMS for community contributions.

**Privacy & Consent**

All athlete profiles are public figures (professional competitors). But I still:
- Allow athletes to claim their profile (verify via Instagram DM)
- Let them edit their bio, add content, remove incorrect info
- Remove profiles if requested (has happened twice)

**Monetization**

Currently free, but exploring:
- **Premium profiles**: Athletes pay $10/mo for verified badge, custom URL, analytics
- **Ads**: Tasteful sponsorships from BJJ brands (gis, rashguards, etc.)
- **API**: Let other sites embed athlete data (e.g., tournament brackets)

Not trying to get rich, just cover hosting costs ($50/mo Fly.io + $20/mo Supabase).

**Community**

Building in public on Twitter (@yukihamada). Weekly updates on:
- New profiles added
- Feature launches
- Data insights (e.g., "most common submission in ADCC finals")

Also accepting contributions:
- Submit an athlete profile (Google Form)
- Suggest a technique to add
- Report incorrect data (GitHub issues)

**Questions for HN**

1. **Data Model**: Should lineage be strict (only direct instructor-student) or loose (include seminars, online courses)? Current model is strict.

2. **Video Hosting**: Embedding YouTube is easy but risky (videos get deleted). Should I host videos myself? CDN costs would explode.

3. **Internationalization**: BJJ is huge in Brazil, Japan, UAE. Should I translate profiles? (Auto-translate via DeepL?)

4. **Open Data**: Should I release the database as open data (CSV/JSON export)? Worried about competitors scraping.

5. **Community Edits**: Like Wikipedia, allow anyone to edit? Or require approval? Leaning toward "suggest edits → manual review."

**What's Next**

Roadmap:
- [ ] Match database (10K+ results)
- [ ] Team profiles (Atos, Alliance, Gracie Barra, etc.)
- [ ] Event coverage (live updates from IBJJF/ADCC)
- [ ] Mobile app (iOS + Android)
- [ ] API for developers

**Try It**

jiuflow.com – Browse athletes, techniques, and lineage trees.

If you're a BJJ practitioner, claim your profile (DM me on Twitter).
If you're a developer, let me know what data you'd want from an API.

Happy to answer questions about the tech, data model, or BJJ in general!

---

**JiuFlow**
Website: jiuflow.com
Twitter: @yukihamada
GitHub: yukihamada/jiuflow-ssr

---

**End of HackerNews Posts**
