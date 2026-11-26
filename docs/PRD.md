Yes, buddy. I went through the new 65-second recording. It's definitely better than yesterday's neon cyberpunk dashboard, but I still wouldn't call this the finished design.

It feels like the previous interface has been recolored rather than genuinely redesigned.

I've also checked [harshakurtkoti.in](https://www.harshakurtkoti.in/?utm_source=chatgpt.com) again. Your portfolio's engineering-first presentation, architectural walkthroughs and interactive system demonstrations are exactly what Mnemora should inherit.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.harshakurtkoti.in\&sz=32)

Backend, AI & Infrastructure Engineer

**Let's finalize the entire frontend experience first, freeze the design system, and then move to backend functionality.**

## **1. What still needs fixing**

[Triage – Linear Docs](https://images.openai.com/static-rsc-4/7JYJylc6qBTqvXklzjqVWgxeHgrcyctNqB8J8cMHhtDqbG9AL9CnQzlItdv1VAQmdEoHtV7X0kwaWMsxecR2TXs9ClFBu35QGiXX7lpgNmEpzsC7IZ-_mlmMZl1A1GBxFQY9f3-o2TNU4z6aiRsGc-ipinjIw5tBpCJ1Z3MmHY0?purpose=inline)

**Navigation and application shell**

The sidebar feels empty, the branding is understated to the point of being forgettable, and the navigation text is too small. It needs better proportions and clearer active states.

[The New Raycast - Raycast Blog](https://images.openai.com/static-rsc-4/d77RCSIl-9CaXAG47qdbQozFkx95QXgWBp6Z_fmJ8moqxIG8UHRFQO1bK1OVLulFRIU79_hY3tUl0LdmwAecY0LDF4D_fG5946ucCLfr0bmmTnxNyqNexSvOG5d5DCszbIXzSBrnqSWbGUzSMj2nmX_HmyWWgWacZibk1LWM0Bw?purpose=inline)

**Ask page**

There is too much unused space. The query input should be the centerpiece, with suggested questions, query history and a polished answer experience.

[Managing Edge Configs with the Dashboard](https://images.openai.com/static-rsc-4/yK-RQB4pp4dOd6WZPY7b7h541Wp9VOcNRRlNxc0jRL1VAZ1qrqySJVcPyfmOBk61lTfIG5tg9JBVnJiKa0YzSwTVJAD0BNc3VNJrNJxrVQ1Hzc28z_3RVaBt-qzbIhO44q02kdaP3YkrWcS0Cby6WUhnGX6MoGroGmQdFJ2exI8?purpose=inline)

**Knowledge base**

The table is a reasonable starting point, but the typography, row spacing, document preview and filtering experience need refinement.

[LLM Observability with LangSmith: Log Observations Beyond Just UI | by Shubham Shardul | Mar, 2026 | Medium](https://images.openai.com/static-rsc-4/1im4oV4AIApQC3o8M3bQYSBYUpSqtmW_c6yFVQw22kbthyhTMQRGoP7iEPkgQq1mameUkHaueZDIAqowD9Il-BqbRs72JepVswYyJzKcfSrLIyEuU4JuhRwr_XiPkZhiebNsZGHV-aZ4XAWU3u6yfO3IwtcJkWuIMd2j0iEWfoc?purpose=inline)

**Retrieval inspector**

This should be the flagship feature. Currently, the four columns of retrieved documents look cramped. The retrieval process needs an interactive architecture visualization.

[Vercel Observability is now generally available - Vercel](https://images.openai.com/static-rsc-4/uCFDIjSy2XgL53rvlyjCAthS1QKBp6IrIF2yYW04iFojmgOyeFAlkLDC_dTMjzn0aStH0MdbgqLMjNEQrsc0zpDZhbfGh5x2umQ_aVeMLebCoJzQ8jfmA6piOHFkEDnnyjgxp1rp4qdbnR4D2AmFtR2fDDnfR_MgDWpYASI1k8o?purpose=inline)

**Evaluation and system pages**

Too many similar rectangular cards. Introduce meaningful visualizations, better metric hierarchy, service topology and structured performance analysis.

## **2. What we should inherit from your portfolio**

Not just the colors. The entire visual language.

| Element       | Direction                                                     |
| ------------- | ------------------------------------------------------------- |
| Typography    | Exact portfolio font families                                 |
| Background    | Same portfolio canvas color                                   |
| Accent        | Same restrained mint/green treatment, verified against source |
| Headings      | Editorial typography with selective italic emphasis           |
| Cards         | Subtle borders and surface separation                         |
| Glassmorphism | Selective and purposeful                                      |
| Icons         | Consistent Lucide icons                                       |
| Animations    | Smooth, intentional micro-interactions                        |
| Architecture  | Portfolio-style interactive system traces                     |
| Data          | Monospace typography for technical values                     |
| Spacing       | Generous but not wasteful                                     |
| Branding      | Distinct product, consistent personal identity                |

### **Proposed visual direction**

## **Mnemora.**

Retrieval workspace

01 / KNOWLEDGE INTELLIGENCE

# **Knowledge, *retrieved.***

Explore your documents. Understand how answers are retrieved, ranked and grounded.

Ask anything about your knowledge base...

Hybrid retrieval

EXPLORE THE PIPELINE

Documents

# **12**

Indexed chunks

# **423**

p95 latency

# **107ms**

Illustrative design concept using values visible in your recording. The exact colors and fonts should come from your portfolio source.

## **3. Give this prompt to Codex**

Use Codex with high reasoning effort. Open the Mnemora and portfolio repositories in the same workspace if possible.

This time, we're explicitly restricting it to frontend development.

# Mnemora — Final Premium UI/UX Refactor

Act as a principal product designer, senior frontend engineer, design systems architect and UX specialist.

## Primary objective

Completely refine the Mnemora frontend to match the visual identity of my personal portfolio:

[https://www.harshakurtkoti.in](https://www.harshakurtkoti.in)

The current frontend is an improvement over the previous cyberpunk design, but it still looks generic, excessively template-driven and AI-generated.

I want a deliberate, recognizable, premium engineering product.

**This phase is strictly frontend and UI/UX. Backend development will be handled separately after the frontend is finalized.**

## 1. Non-negotiable scope restrictions

- Do not modify backend code.
- Do not modify database schemas.
- Do not modify retrieval algorithms.
- Do not change API contracts.
- Do not change authentication logic.
- Do not modify backend infrastructure or deployment configuration.
- Do not introduce new backend dependencies.
- Preserve every existing functional frontend integration.
- Do not silently hide existing API errors.
- Do not fabricate metrics or pretend that disconnected services are operational.

If functionality is unavailable because of a backend issue, implement an appropriate frontend error, loading or unavailable state and document the backend issue separately.

## 2. Portfolio design system extraction

Inspect the live portfolio and its source repository.

Extract the actual:

- CSS variables
- Tailwind design configuration
- Font families and font weights
- Background colors
- Surface colors
- Primary and secondary text colors
- Accent colors
- Border treatments
- Button styles
- Spacing conventions
- Heading treatments
- Glassmorphism patterns
- Motion curves and durations
- Architecture visualization patterns
- Responsive behavior

Do not approximate the portfolio's design if its source is available.

Create a centralized, portable design system that can later be adopted by my other personal projects.

The portfolio is the primary design authority.

Linear, Vercel, Raycast and LangSmith may be used as interaction-quality references, but do not clone their visual identities.

## 3. Use parallel subagents where available

Assign independent responsibilities:

- Design system agent: Extract and document the portfolio's design language.
- UI audit agent: Inspect all Mnemora routes and components.
- Product design agent: Redesign page layouts and information hierarchy.
- Motion agent: Apply the existing UX motion skill and improve interactions.
- Accessibility agent: Audit typography, contrast, keyboard accessibility and responsive behavior.
- QA agent: Validate the completed frontend through actual browser testing.

Coordinate shared component ownership to prevent conflicting edits.

## 4. Global application shell

Redesign the complete application shell.

Requirements:

- Compact, elegant navigation sidebar.
- Collapsible navigation where appropriate.
- Clear branding and product identity.
- Readable navigation labels.
- Subtle active states.
- Consistent page headers and breadcrumbs.
- Well-designed environment indicators.
- Global command palette using existing frontend functionality.
- Consistent tooltips, dropdowns and popovers.
- Proper mobile navigation.
- No unnecessary empty space.
- No excessive borders.
- No decorative glow effects.

The interface should feel like a professional developer tool, not an admin dashboard template.

## 5. Ask page

Completely redesign the user journey.

Before a query:

- Strong editorial heading consistent with the portfolio.
- Prominent question composer.
- Suggested questions based on available knowledge.
- Retrieval configuration controls.
- Recent query history.
- Compact knowledge statistics.
- An interactive explanation of the retrieval pipeline.

After a query:

- Clearly structured answer.
- Readable Markdown rendering.
- Citation indicators.
- Expandable source passages.
- Source document information.
- Retrieval trace access.
- Execution duration where available.
- Retry and copy actions.
- Clear loading and error states.
- Follow-up questions where supported.

Avoid displaying a raw red error banner followed by an entirely empty page.

For failed requests, present a polished error state with an explanation, retry action and expandable technical details.

Preserve the existing API behavior.

## 6. Knowledge base

Create a professional document-management interface.

Improve:

- Document table typography.
- Column alignment and row spacing.
- Search and filtering.
- Sorting.
- File type indicators.
- Document status.
- Upload dialog.
- Drag-and-drop interaction where already supported.
- Indexing progress.
- Document preview.
- Metadata inspection.
- Empty states.
- Error states.

Replace raw JSON-first document previews with a human-readable metadata presentation and an optional expandable raw JSON inspector.

Use existing document data only.

## 7. Retrieval inspector — flagship feature

This is the most important technical showcase.

Use the Systems in Motion section of my portfolio as the design reference.

Create an interactive retrieval pipeline visualization:

Query input → Query processing → Dense and sparse retrieval in parallel → Reciprocal Rank Fusion → Cross-encoder reranking → Final selected context.

Use actual pipeline behavior from the existing implementation.

Requirements:

- Clearly connected architecture nodes.
- Meaningful stage selection.
- Stage descriptions.
- Execution durations where available.
- Candidate counts.
- Document ranking.
- Retrieval scores.
- Ranking changes.
- Selected context.
- Expandable document passages.
- Clear distinction between execution stages.

Do not simply present four cramped columns of cards.

Use an architecture overview followed by a detailed stage inspection workspace.

Consider an adjustable split-pane layout, with results on one side and selected document details on the other.

Animations should communicate actual execution progress. If the backend does not expose live stage events, present the available completed trace or explicitly label any educational animation as illustrative.

## 8. Evaluation page

Transform this into a professional RAG evaluation workbench.

Improve:

- Metric hierarchy.
- Benchmark summaries.
- Retrieval strategy comparison charts.
- Recall metrics.
- Precision metrics where available.
- Mean reciprocal rank.
- Hit rate.
- RAGAS quality metrics.
- Latency distributions where available.
- Individual benchmark question results.
- Comparison tables.
- Evaluation status.
- Metric explanations through tooltips.

Use consistent chart styles derived from the portfolio.

Avoid unnecessary gradients, oversized KPI cards and excessive chart grid lines.

Never invent missing evaluation data.

## 9. System page

Redesign this as an engineering observability workspace.

Include existing available information for:

- Service health.
- Dependency topology.
- Runtime configuration.
- API server.
- Vector store.
- BM25 index.
- Embedding provider.
- Reranking service.
- LLM provider.
- Database.
- Uptime.
- Pipeline configuration.

Visualize service relationships instead of displaying every service as an isolated card.

Use the same architecture visualization language as the portfolio.

Distinguish between healthy, degraded, disconnected, unavailable, unconfigured and unknown states.

## 10. Visual quality requirements

Remove generic AI-generated UI patterns, including:

- Excessive uppercase micro-labels.
- Tiny and difficult-to-read text.
- Repeated identical cards.
- Unnecessary card nesting.
- Excessively dark low-contrast surfaces.
- Random gradients.
- Neon glows.
- Excessive green tinting.
- Large unused areas.
- Excessively dense technical panels.
- Decorative icons without purpose.
- Unnecessary rounded pills.
- Inconsistent spacing.
- Generic dashboard compositions.

Prioritize editorial typography, intentional whitespace, subtle surface hierarchy, strong alignment and polished interaction design.

The product should feel premium even without animations.

## 11. Motion and interaction

Read and apply my existing ux-motion SKILL.md if available.

Implement purposeful:

- Hover transitions.
- Button press feedback.
- Sidebar transitions.
- Modal transitions.
- Expandable inspector panels.
- Tab transitions.
- Loading skeletons.
- Toast notifications.
- Architecture execution transitions.
- Chart interactions.
- Keyboard focus states.

Respect prefers-reduced-motion.

Avoid constant decorative animation.

## 12. Reusable frontend foundation

Create or consolidate reusable components for:

- Application shell
- Page headers
- Buttons
- Inputs
- Search composers
- Data tables
- Metric displays
- Status indicators
- Architecture diagrams
- Charts
- Dialogs
- Inspectors
- Empty states
- Error states
- Loading skeletons
- Tooltips
- Tabs
- Toasts

Centralize all design tokens.

Document the reusable foundation in docs/DESIGN_SYSTEM.md.

Make it straightforward to adopt this same visual system in RAG Observability, VisionBoard and my future applications.

Do not introduce an external package or monorepo migration in this phase unless essential.

## 13. Browser validation

Do not consider the task complete simply because the build succeeds.

Open the actual application using Playwright or equivalent browser tooling.

Inspect all five primary pages:

1. Ask
2. Knowledge
3. Retrieval
4. Evaluation
5. System

Test at 1920, 1440, 1280, 768 and 390 pixels.

Capture before-and-after screenshots.

Test normal, loading, error, empty and disconnected states.

Perform a second visual refinement pass after reviewing the screenshots.

Check for:

- Readability.
- Contrast.
- Alignment.
- Spacing.
- Overflow.
- Layout shifts.
- Consistent typography.
- Keyboard accessibility.
- Mobile responsiveness.
- Broken frontend interactions.

Run lint, type checking and production build validation.

## 14. Final deliverables

Provide:

- Fully refined frontend.
- Before-and-after screenshots of all five pages.
- Shared design tokens.
- Reusable component foundation.
- Design system documentation.
- Frontend validation report.
- List of changed files.
- Separate backend issue backlog for the next development phase.
- Confirmation that backend code and API contracts remain unchanged.

Work on the existing UI refactor branch if appropriate. Otherwise create a dedicated frontend refactor branch.

Do not merge automatically.

The final result should look like Mnemora was deliberately designed as part of the harshakurtkoti.in engineering ecosystem.

Do not stop at a theme change. Redesign the actual experience.

## **4. Order of development**

**Phase 1 — UI/UX**

Current focus

Design system, layouts, components, interactions and responsiveness.

**Phase 2 — Backend**

Failed API requests, retrieval execution, indexing, database and actual evaluation metrics.

**Phase 3 — Production readiness**

Testing, performance, security, deployment and observability.

**Phase 4 — Portfolio ecosystem**

Adopt the finalized design system across your other engineering projects.

## **5. My current rating**

Original neon UI

**4/10**

Current redesigned UI

**6.5/10**

Target design quality

**9.5/10**

I also noticed the **Failed to fetch** error on the Ask page in your recording. Leave the underlying backend issue for phase two, but make sure the frontend handles it gracefully.

I reviewed the recording and live portfolio content, not the complete frontend source or rendered portfolio CSS. No repository changes have been made here; the prompt is designed to have Codex perform those changes and verify the exact design tokens.

Most importantly, don't settle for another recoloring exercise. I want Mnemora to be something a recruiter can open, explore for five minutes, and understand both your engineering capabilities and your attention to product quality.

```

```
