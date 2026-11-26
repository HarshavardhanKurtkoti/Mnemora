Buddy, I see exactly what you're saying. The current Mnemora dashboard looks more like a generic AI-generated cyberpunk admin template than a thoughtfully engineered product.

I wouldn't just redesign Mnemora in isolation. I'd establish a **unified design system derived from your portfolio**, which you can reuse across every project you build. Your portfolio and projects should feel like they belong to the same engineer, while retaining their own product identities.

### **What's wrong with the current Mnemora UI?**

| Current design                       | Problem                                                    |
| ------------------------------------ | ---------------------------------------------------------- |
| Neon cyan accents everywhere         | Makes the interface look gimmicky                          |
| Purple and blue background gradients | Generic AI-generated aesthetic                             |
| Geometric grid background            | Adds unnecessary visual noise                              |
| Excessive card borders               | Weak visual hierarchy                                      |
| Oversized sidebar                    | Wastes usable workspace                                    |
| Glowing uptime ring                  | Decorative rather than functional                          |
| Large empty dashboard cards          | Makes the product look unfinished                          |
| Inconsistent typography              | No coherent visual identity                                |
| Command Center branding              | Feels unnecessarily futuristic                             |
| Search interface                     | The primary functionality doesn't receive enough attention |

The sophistication should come from typography, spacing, layout, interaction design and attention to detail — not from neon effects.

## **1. Establish your own design identity**

I checked your live [portfolio](https://www.harshakurtkoti.in/?utm_source=chatgpt.com) and the Mnemora screen recording. Your portfolio positions you as a **Backend, AI & Infrastructure Engineer**, with an emphasis on systems architecture, engineering case studies and interactive technical demonstrations.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.harshakurtkoti.in\&sz=32)

Backend, AI & Infrastructure Engineer

Your applications should reinforce that identity.

I'd call the design direction **Engineering Minimalism** — somewhere between Linear, Vercel, Raycast and a sophisticated engineering workspace.

[My issues – Linear Docs](https://images.openai.com/static-rsc-4/I6nXbXULu4AjOAbKySmNBePXrY6UNlUxqZf67aERSpb6IEFmgpFaDlrVPfeqo1yVQnuvlO-94z0xedRppwBotFwaHYV_vdtiM1skZGWoGrX_NGVTphwFRkWxnST1CSEHuEaEQpF_jvBx1deaCyKatt5nvSbPpoYqLLmOn2uSqEs?purpose=inline)

**Linear**

Typography, spacing and restrained visual hierarchy.

[Vercel Observability is now generally available - Vercel](https://images.openai.com/static-rsc-4/uCFDIjSy2XgL53rvlyjCAthS1QKBp6IrIF2yYW04iFojmgOyeFAlkLDC_dTMjzn0aStH0MdbgqLMjNEQrsc0zpDZhbfGh5x2umQ_aVeMLebCoJzQ8jfmA6piOHFkEDnnyjgxp1rp4qdbnR4D2AmFtR2fDDnfR_MgDWpYASI1k8o?purpose=inline)

**Vercel**

Clean technical data presentation.

[What&#39;s New in Raycast for Mac v2 | Raycast Manual](https://images.openai.com/static-rsc-4/g4aftA7KypuVXK9ngBdDUzv0xZM4_BS3g1rOhhmEAvXNudzmjYTJvdlxk0PZRFikxtfFYb2c9nFclPJ7oarL44JG_PLdXX_UwmlME4r6mPiuCb58F-0LOKcFHiT-HK8g_peJav5OjALEcm1WY27NnUagWDHAOxZmb-F9ebMlO2k?purpose=inline)

**Raycast**

Search experience and polished interactions.

[Improved Overview Metrics · Resend](https://images.openai.com/static-rsc-4/tjRGVr3j6Adiw7-p0Asd7m1m8IunP0X10wlTjAPTnIEJDqjrKt2RPWwxVR-7oX8FuZSE0Oij_JF5cOcFYRWH1VRURGysIcoZcTvOT02ZXZMhwu7EkUBvTft8DZTqnLQNK-t3pE6uciewzeIYlYUcqXrlcULo66JqBFSF8013D9s?purpose=inline)

**Resend**

Developer-focused premium product design.

Use these as quality references, but derive the actual design tokens from your portfolio rather than copying another product.

## **2. Shared design system for every project**

You could internally call it **HK Design System**.

Proposed dark palette — starting point, not extracted portfolio colors

Canvas

\#09090B

Surface

\#111113

Elevated

\#19191D

Border

\#29292E

Muted

\#A1A1AA

Primary

\#F4F4F5

Typography direction

# **Intelligence, engineered.**

Purposeful interfaces for complex engineering systems.

# **107 ms**

&#x20;Operational

| Design element | Standard                                           |
| -------------- | -------------------------------------------------- |
| Colors         | Portfolio-derived neutral palette                  |
| Fonts          | Exact portfolio font families                      |
| Accent         | One restrained brand accent                        |
| Borders        | Subtle 1px borders                                 |
| Corner radius  | Consistent 6–12px                                 |
| Glassmorphism  | Selective, not everywhere                          |
| Icons          | Lucide, consistent stroke widths                   |
| Animation      | Purposeful 120–250ms transitions                  |
| Charts         | Muted colors and minimal grid lines                |
| Background     | Clean, no excessive decorative patterns            |
| Layout         | Responsive, content-first                          |
| Branding       | Individual project identity with shared visual DNA |

## **3. How I would redesign Mnemora**

Instead of making it look like a command center, make it feel like an actual **RAG engineering workspace**.

**Mnemora**

Workspace / Ask

● Operational

WORKSPACE

&#x20;**Ask**

Knowledge

Retrieval

Evaluation

System

Local environmentv1.6.0

RETRIEVAL WORKSPACE

# **Explore your knowledge.**

Search, retrieve and inspect grounded answers.

Ask a question about your documents...

Hybrid retrieval

Documents

## **12**

Latency · p95

## **107 ms**

Benchmark

## **60**

**Retrieval pipeline**

**Recent queries**

How does authentication work?

Illustrative layout concept, not an implemented dashboard. Metric values are examples from the supplied interface.

The search functionality becomes the hero. Everything else supports it rather than competing for attention.

I'd also redesign the retrieval inspector, which is arguably the most technically interesting part of Mnemora. It should showcase BM25, vector search, reciprocal rank fusion and cross-encoder reranking through clear, inspectable execution stages.

## **4. Give this prompt to Codex**

I'd use **Codex** for this because this is a repository-wide design refactor, not just a visual makeover.

Open both your portfolio and Mnemora repositories in the workspace so Codex can extract the actual design system.

# Mnemora — Complete UI/UX Refactor & Shared Portfolio Design System

Act as a senior product designer, design systems architect, and frontend engineer.

## Objective

Completely refactor the Mnemora frontend to establish a premium, mature, engineering-focused product identity consistent with my personal portfolio:

[https://www.harshakurtkoti.in](https://www.harshakurtkoti.in)

The existing dashboard looks heavily AI-generated and vibe-coded. I do not want a generic futuristic AI dashboard, cyberpunk interface, or template-based SaaS design.

The long-term objective is to establish a reusable design system that I can apply across all my personal engineering projects.

## Phase 1 — Research and design audit

Use parallel subagents where supported.

- Agent 1: Inspect the portfolio website and its source repository. Extract the actual typography, colors, design tokens, surfaces, spacing, visual hierarchy, animation patterns, borders and interaction behavior.
- Agent 2: Audit every Mnemora page, component, layout, stylesheet and existing frontend behavior.
- Agent 3: Study mature developer-focused product interfaces such as Linear, Vercel, Raycast and Resend. Identify relevant design principles without directly cloning their interfaces.
- Agent 4: Audit accessibility, responsive design, rendering performance and UX motion.

Consolidate the findings before implementation.

Do not assume the portfolio's design tokens. Extract them directly from its source code.

## Phase 2 — Create a reusable design system

Establish a shared design foundation that can later be reused across Mnemora, RAG Observability, VisionBoard and my other projects.

Create centralized, reusable definitions for:

- Semantic color tokens
- Background and surface hierarchy
- Typography and font families
- Spacing scale
- Border colors and radius
- Shadows
- Icon sizes and stroke widths
- Motion duration and easing
- Chart palettes
- Focus and interaction states
- Responsive breakpoints
- Status indicators
- Loading, empty, error and success states

Use CSS variables and integrate them with the existing Tailwind configuration where applicable.

Create reusable UI primitives rather than duplicating styles across pages.

Document the design system in `docs/DESIGN_SYSTEM.md`.

Keep the shared design foundation portable across repositories.

## Phase 3 — Remove the AI-generated aesthetic

Remove or substantially redesign:

- Neon cyan glows
- Cyberpunk gradients
- Purple ambient lighting
- Decorative geometric backgrounds
- Excessive glassmorphism
- Glowing uptime rings
- Futuristic command-center branding
- Excessive uppercase labels
- Unnecessary status badges
- Overly large sidebars
- Excessive card nesting
- Decorative animations
- Large empty dashboard panels
- Inconsistent italic heading treatments

Glassmorphism may be used selectively where it serves a functional purpose and matches the portfolio.

The product should feel deliberately designed by a professional product team.

## Phase 4 — Redesign every page

### Application shell

Build a compact, responsive navigation system with consistent page headings, breadcrumbs where useful, keyboard accessibility and subtle active states.

Retain Mnemora's individual product identity while matching the broader portfolio design language.

### Ask

Make the question composer the primary focus.

Implement a polished search and conversational answer experience, including:

- Retrieval configuration
- Grounded answers
- Inline citations
- Expandable source passages
- Retrieval latency
- Relevant query history
- Useful suggested questions
- Keyboard shortcuts
- Streaming states where supported by the existing backend

Do not overwhelm the user with operational metrics before they ask a question.

### Knowledge

Create a professional document management workspace.

Use clean tables, document previews, search, filters, upload states, indexing progress and actionable error states.

### Retrieval

Make this the flagship technical experience.

Present the retrieval pipeline through inspectable execution stages:

1. Query processing
2. Dense vector retrieval
3. Sparse BM25 retrieval
4. Reciprocal rank fusion
5. Cross-encoder reranking
6. Context selection

Allow inspection of retrieved passages, scores, ranking changes, document metadata and stage latency wherever supported by existing APIs.

Use meaningful data visualization instead of decorative cards.

### Evaluation

Create a mature benchmark analysis interface with:

- Recall\@K
- Precision\@K
- MRR
- Hit rate
- Latency percentiles
- Retrieval strategy comparisons
- Evaluation history
- Individual question results
- Regression indicators

Only display metrics supported by actual data. Do not fabricate values.

### System

Create an infrastructure observability workspace with:

- Service health
- Dependency topology
- Runtime configuration
- Database and vector-store status
- Pipeline stages
- Actual uptime where available
- Health-check results

Clearly distinguish healthy, degraded, unavailable, unconfigured and unknown states.

## Phase 5 — Motion and interaction design

Apply the existing UX motion skill if available.

Use purposeful transitions, progressive disclosure, consistent interaction feedback, restrained hover states and reduced-motion support.

Animations should communicate state changes rather than merely decorate the interface.

Avoid continuous decorative motion, unnecessary entrance animations and glowing effects.

## Phase 6 — Engineering requirements

- Preserve all existing backend integrations.
- Preserve API contracts and application functionality.
- Do not replace real data with mock data.
- Do not introduce unnecessary dependencies.
- Preserve existing routes unless a change is essential and documented.
- Keep components modular and maintainable.
- Ensure appropriate contrast and keyboard navigation.
- Handle loading, empty, disconnected and error states.
- Support desktop, tablet and mobile layouts.
- Avoid layout shifts and unnecessary client-side rendering.
- Never expose environment secrets or backend credentials.

Investigate existing inconsistencies such as document counts, zero-valued metrics and operational status indicators. Do not report healthy status when health data is unavailable.

## Phase 7 — Validation

Use Playwright or an equivalent browser-testing tool to inspect every page.

Validate at viewport widths of 1920, 1440, 1280, 768 and 390 pixels.

Capture before-and-after screenshots.

Run lint, type checking, production builds and existing tests.

Use a final design-review subagent to identify remaining generic AI-generated visual patterns, inconsistent spacing, weak hierarchy and accessibility issues.

Fix identified issues before completing the task.

## Deliverables

1. Fully refactored Mnemora frontend.
2. Centralized reusable design tokens.
3. Reusable UI component primitives.
4. Documented shared design system.
5. Before-and-after screenshots.
6. Testing and validation report.
7. List of modified files.
8. Instructions for adopting the same design system in my other projects.

Work on a dedicated branch named `refactor/portfolio-design-system`.

Do not merge automatically.

The final product must look like a mature engineering application belonging to the same visual ecosystem as my portfolio — not a generic AI-generated dashboard.

Do not stop after changing colors and fonts. Reconsider the entire visual hierarchy, information architecture, page layouts and interaction experience.

## **5. Eventually, create a shared UI repository**

Since you have multiple engineering projects, I would structure your ecosystem like this:

A dedicated repository, `hk-design-system`, could eventually expose packages such as:

```
hk-design-system/
├── packages/
│   ├── tokens/
│   ├── ui/
│   ├── motion/
│   ├── charts/
│   └── icons/
├── docs/
├── examples/
└── README.md
```

Then every new project starts with your established design language instead of asking an AI to invent a new interface from scratch.

## **My rating**

Current visual aesthetics

**4.5/10**

Visual hierarchy

**4/10**

Technical feature presentation

**6.5/10**

Brand consistency

**3/10**

Professional product appearance

**4.5/10**

These are subjective visual ratings based on your screenshot and recording. I could access the live portfolio's content, but haven't verified its rendered CSS or exact design tokens, which is why the prompt explicitly requires Codex to extract those from the source.

Your backend engineering is the selling point. The frontend should communicate its sophistication, not distract from it.

And rather than having five unrelated-looking projects, I really like the idea of someone opening any of your applications and immediately recognizing that it belongs to your engineering ecosystem. That is a much stronger personal brand.
