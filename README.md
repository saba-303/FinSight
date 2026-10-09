# FinSight Insights

generrate me A complewte detailed website based on the given info :
FinSight — AI-Powered Financial Intelligence & Document Analysis Platform

1. PRODUCT OVERVIEW

Build a modern, premium financial intelligence web application called FinSight.

FinSight is an AI-powered financial analysis platform designed to help investors, financial analysts, MBA students, researchers, and business professionals understand complex financial documents and company performance without manually reading hundreds of pages of annual reports.

The platform should combine:

Company financial analysis

Annual report analysis

PDF/document upload

AI-powered question answering

Financial trend visualization

Risk analysis

Management commentary analysis

Company comparison

Document-grounded insights

Page-level source citations

Support for both listed and document-based/unlisted companies

The product should NOT look like a generic chatbot.

It should look like a professional financial intelligence and research platform.

The primary experience should be a structured analytical dashboard, with AI integrated into the workflow.

2. CORE PROBLEM

Annual reports and financial documents can contain hundreds of pages of:

Financial statements

Notes to accounts

Management discussion

Risk factors

Business segments

Strategic commentary

ESG information

Cash-flow information

Auditor reports

Shareholder information

Manually extracting useful information is time-consuming.

Existing stock-analysis platforms are excellent at structured financial metrics, screening and market information, but users may still need to manually inspect long reports and documents to answer document-specific questions.

FinSight aims to bridge this gap by combining structured company analysis with AI-powered document intelligence.

3. TARGET USERS

Primary users:

Retail Investors

Users who want to understand a company before researching or investing.

Financial Analysts

Users who need to quickly extract information from annual reports and financial filings.

MBA / Finance Students

Students who need company analysis for assignments, case studies and research.

Researchers

Users comparing companies, industries and historical financial documents.

Business Professionals

Users who need quick access to financial and strategic information.

4. KEY DIFFERENTIATOR

FinSight should not position itself as simply another stock screener.

Its central differentiator is:

Structured company intelligence + user-provided financial document intelligence in one platform.

A user can either:

A. Select a supported company

OR

B. Upload their own financial document

OR

C. Upload documents for a company that does not have structured data available on the platform.

This allows FinSight to analyze not only conventional listed companies but also companies for which the user has financial documents.

For document-based companies, the system should clearly indicate:

"Analysis based on uploaded documents."

Do not fabricate live stock prices, market capitalization, or financial metrics when no structured market data exists.

5. MAIN USER JOURNEY

The homepage should present three primary actions:

Option 1 — Explore a Company

Search:

"Reliance Industries"

"HAL"

"TCS"

etc.

Option 2 — Upload a Financial Report

Upload:

Annual Report PDF

Quarterly Report

Investor Presentation

Financial Statement

Earnings Report

ESG Report

Other financial document

Option 3 — Compare Companies

Select two or more companies and compare their:

Revenue

Profitability

Growth

Margins

Debt

Cash flow

Risks

Management commentary

Strategic outlook

6. HOMEPAGE

Create a premium landing page.

Hero section:

"Turn 500 Pages of Financial Reports into Actionable Intelligence."

Subtitle:

"FinSight uses AI-powered financial document analysis to extract financial performance, risks, trends, management insights and evidence-backed answers from complex company reports."

Primary CTA:

Analyze a Company

Secondary CTA:

Upload a Report

Third CTA:

Compare Companies

Include a subtle animated financial data visualization in the background.

Avoid excessive stock-market clichés.

Use a professional fintech aesthetic.

7. DASHBOARD

After login, show a dashboard.

Top navigation

FinSight logo

Dashboard

Companies

Upload Report

Compare

My Reports

Research

Settings

Dashboard cards

Show:

Companies Analyzed

Reports Uploaded

Insights Generated

Recent Analyses

Saved Companies

8. COMPANY SEARCH

Create a global search bar:

Placeholder:

"Search company, sector or financial document..."

Examples:

Reliance

HAL

Tata Motors

Defence

EV

Banking

Search results should display:

Company name

Industry

Company type:

Listed

Unlisted / Document-based

Available documents

Latest available report

9. COMPANY PROFILE PAGE

When a user selects a company, create a professional financial analysis page.

Example:

Reliance Industries

Industry:
Conglomerate

Company Type:
Listed

Latest Report:
FY 2025-26

COMPANY SNAPSHOT

Cards:

Market Capitalization

Revenue

Net Profit

EPS

ROE

Debt/Equity

Operating Margin

Profit Margin

These values should be mock/sample values in the prototype.

Do not present fabricated values as live market data.

Label mock data clearly if necessary.

10. FINANCIAL PERFORMANCE

Create interactive charts.

Revenue Trend

Line chart:

FY22 → FY23 → FY24 → FY25 → FY26

Net Profit Trend

Bar/line chart.

EBITDA / Operating Profit

Bar chart.

Profit Margin

Line chart.

EPS

Line chart.

Debt vs Equity

Stacked bar chart.

Allow the user to switch:

3 years

5 years

10 years

11. FINANCIAL HEALTH SCORE

Create a visual score.

Example:

Financial Health

78 / 100

Break it into:

Profitability — 82

Liquidity — 74

Solvency — 71

Growth — 86

Efficiency — 79

The score should be presented as an analytical indicator, not investment advice.

Add:

"Score generated from available financial metrics. Not a recommendation to buy or sell."

12. BUSINESS OVERVIEW

AI-generated summary:

What does the company do?

Provide:

Main business segments

Geographic presence

Revenue sources

Major products/services

Key business areas

Example:

"Reliance operates across energy, retail, digital services and new energy initiatives."

Include a "View Source" option wherever the information originates from an uploaded document.

13. MANAGEMENT COMMENTARY

Extract and analyze:

CEO/Chairperson statements

Management Discussion & Analysis

Strategic commentary

Display:

Management Outlook

Positive / Neutral / Cautious

Then show:

Key Themes

Expansion

Capital expenditure

Demand

Technology

Cost management

Risks

Include a trend visualization showing management sentiment over multiple years if enough reports are available.

14. RISK ANALYSIS

Create a dedicated section.

Key Risks

Display risk cards:

Regulatory Risk

High

Market Risk

Medium

Currency Risk

Medium

Operational Risk

Low

Cybersecurity Risk

Medium

Each risk should contain:

Risk description

Evidence

Relevant page

Source document

AI interpretation

Example:

"The company identifies regulatory changes as a material risk to future operations."

Then:

Source: Annual Report FY2025, Page 127

Clicking the citation should open the relevant document/page if technically available.

15. UPLOAD REPORT FEATURE

This is one of the central features.

Create a dedicated page:

Analyze Your Financial Report

Drag and drop PDF here.

Supported examples:

Annual Report

Quarterly Report

Investor Presentation

Earnings Report

ESG Report

Financial Statement

Allow multiple PDF uploads.

Example:

Reliance_Annual_Report_2025.pdf
Reliance_Annual_Report_2024.pdf
Reliance_Investor_Presentation.pdf


Show upload progress:

Uploading

Extracting text

Identifying tables

Indexing document

Generating embeddings

Ready for analysis

16. DOCUMENT PROCESSING

The actual backend architecture should eventually follow:

PDF

↓

Document parser

↓

Text extraction

↓

Table extraction

↓

Page segmentation

↓

Chunking

↓

Metadata:

Company

Year

Page number

Document type

Section

↓

Embedding model

↓

Vector database

↓

Retrieval

↓

LLM

↓

Evidence-backed answer

The prototype website should visually communicate this pipeline.

17. UPLOADED DOCUMENT PAGE

After upload, show:

Reliance Annual Report FY2025

Pages: 438

Processing Status:

✓ Text extracted

✓ Tables detected

✓ Financial sections identified

✓ Document indexed

Then show detected sections:

Company Overview

Financial Statements

MD&A

Risk Factors

Cash Flow

Balance Sheet

ESG

Notes to Accounts

Auditor Report

18. DOCUMENT-SPECIFIC AI QUESTIONS

Provide a query box:

"Ask anything about this report..."

Suggested questions:

"What was the company's revenue in FY2025?"

"What were the biggest risks?"

"What caused the change in profit?"

"What did management say about future growth?"

"What are the company's major business segments?"

"What was the capital expenditure?"

"What are the major liabilities?"

"Summarize the MD&A."

"Compare this report with FY2024."

19. ANSWER FORMAT

Never return just a paragraph.

Use structured answers.

Example:

What were the major risks?

1. Regulatory Risk

The company identifies regulatory changes as a significant risk.

Evidence: Page 127

2. Market Risk

The company is exposed to fluctuations in market conditions.

Evidence: Page 132

3. Supply Chain Risk

The report identifies supply-side disruptions as a potential operational risk.

Evidence: Page 139

At the bottom:

Sources

Annual Report FY2025

Pages 127, 132, 139

Include clickable source references.

20. NATURAL LANGUAGE QUERY ENGINE

Users should be able to ask questions naturally.

Examples:

Financial

"What was the revenue growth between FY2022 and FY2025?"

"Why did profit decline?"

"How has debt changed?"

"Calculate the CAGR of revenue."

"What is the company's operating margin?"

Business

"What are the company's main revenue sources?"

"Which segment grew the fastest?"

"What is management's strategy?"

Risk

"What are the top five risks?"

"Which risks increased compared with last year?"

Management

"Is management optimistic about future growth?"

"What are the major expansion plans?"

Comparison

"Compare this company with TCS."

"Which company has better margins?"

"Compare revenue growth over five years."

21. MULTI-DOCUMENT ANALYSIS

Allow users to upload multiple reports.

Example:

FY2022

FY2023

FY2024

FY2025

The system should analyze trends across documents.

Example query:

"How has the company's debt changed over the last four years?"

Output:

FY2022 → ₹X

FY2023 → ₹Y

FY2024 → ₹Z

FY2025 → ₹A

Then display a line chart.

Below the chart:

AI Interpretation

"Debt increased significantly between FY2023 and FY2024 before stabilizing in FY2025."

Provide source pages for each figure.

22. COMPANY COMPARISON

Create a dedicated comparison page.

Allow users to select:

Company A

Company B

Company C

Example:

TCS vs Infosys

HAL vs BEL

Tata Motors vs Mahindra & Mahindra

Display:

| Metric | Company A | Company B |
| Revenue Growth | | |
| Profit Growth | | |
| Operating Margin | | |
| ROE | | |
| Debt/Equity | | |
| EPS Growth | | |

Then display visual charts.

23. AI COMPARISON

Below the numerical comparison:

AI Comparison Summary

Example:

"Company A demonstrated stronger revenue growth over the selected period, while Company B maintained a stronger operating margin. Company A also reduced its debt ratio more consistently."

Then show:

Strengths

Company A:

Stronger growth

Better cash generation

Company B:

Better margins

Lower leverage

Risks

Company A:

Higher capital expenditure

Company B:

Slower revenue growth

All document-derived claims should include citations.

24. UNLISTED / DOCUMENT-BASED COMPANY MODE

This is an important differentiator.

Allow users to create:

Custom Company

Example:

Company Name:

"ABC Aerospace Pvt Ltd"

Industry:

"Defence"

Company Type:

"Unlisted"

Upload:

Annual Report

Financial statements

Investor presentation

Other documents

FinSight then creates a company analysis workspace from the uploaded documents.

The interface should clearly state:

"This company is being analyzed using user-provided documents. Live market metrics are unavailable."

Do not fabricate market capitalization, stock price or exchange information.

This allows the platform to support companies that may not have complete public structured market data.

25. SECTOR ANALYSIS

Allow users to select a sector.

Examples:

Defence

EV

Banking

IT

Pharma

Aviation

Energy

Display:

Sector Overview

Number of companies

Revenue growth

Average margin

Average ROE

Debt levels

Major risks

Growth themes

26. SECTOR COMPARISON

Example:

Indian Defence Sector

Companies:

HAL

BEL

Mazagon Dock

Bharat Dynamics

Cochin Shipyard

Show:

Revenue growth

Profit growth

Order book

Margins

Debt

ROE

Capex

Management outlook

Then generate:

Sector Insights

"Defence companies in the selected dataset show increasing order-book visibility, while profitability varies significantly across companies."

Again, only use data actually available.

27. GRAPHICAL OUTPUTS

The website should heavily use visual analytics.

Use:

Line charts

For:

Revenue

Profit

EPS

Debt

Margins

Bar charts

For:

Company comparison

Segment revenue

Profitability

Area charts

For:

Revenue composition

Segment contribution

Donut charts

For:

Revenue mix

Business segment contribution

Radar chart

For:

Financial health dimensions

Risk matrix

X-axis:

Likelihood

Y-axis:

Impact

Display:

Low / Medium / High risk.

Timeline

For:

Major strategic events

Management changes

Major announcements derived from uploaded documents

28. INSIGHT CARDS

The dashboard should automatically surface insights.

Examples:

Growth Insight

"Revenue CAGR increased over the last five years."

Profitability Insight

"Operating margin improved despite moderate revenue growth."

Risk Insight

"Debt increased significantly during the latest reporting period."

Management Insight

"Management has increased emphasis on capacity expansion."

Anomaly Insight

"Profit increased despite relatively flat revenue."

Each card should have:

"Why?"

"Source"

"View evidence"

29. FINANCIAL CALCULATIONS

The platform should calculate metrics rather than asking the LLM to invent them.

Examples:

Revenue CAGR

CAGR =

(Ending Revenue / Beginning Revenue)^(1/number of years) - 1

Profit Margin

Net Profit / Revenue × 100

ROE

Net Income / Average Shareholders' Equity

Debt-to-Equity

Total Debt / Shareholders' Equity

YoY Growth

(Current Year - Previous Year) / Previous Year × 100

These calculations should be performed programmatically.

The LLM should explain the results, not be responsible for arithmetic whenever structured numbers are available.

30. AI / RAG ARCHITECTURE

FinSight should eventually use a Retrieval-Augmented Generation architecture.

Pipeline:

User uploads PDF

↓

PDF parser

↓

Text + table extraction

↓

Chunking

↓

Metadata tagging

↓

Embedding generation

↓

Vector database

↓

User query

↓

Semantic retrieval

↓

Relevant document chunks

↓

LLM

↓

Structured answer

↓

Citation generation

The LLM should be instructed:

"Answer only from retrieved evidence. If sufficient evidence is unavailable, state that the information was not found."

This reduces hallucination.

31. LLM OUTPUT RULES

The AI should:

Never invent financial numbers.

Never invent page numbers.

Never fabricate company information.

Distinguish between extracted facts and AI interpretation.

Cite document evidence.

Clearly state when information is unavailable.

Never present analysis as guaranteed investment advice.

Use labels:

Reported Fact

Calculated Metric

AI Interpretation

This distinction is extremely important.

32. REPORT GENERATION

Allow users to click:

Generate Research Report

Generate a downloadable report containing:

Company Overview

Financial Performance

Key Ratios

Growth Trends

Risk Analysis

Management Commentary

Strategic Outlook

Company Comparison

AI Insights

Sources

The report should include charts and citations.

33. EXPORT OPTIONS

Provide:

Download PDF

Download Excel

Export CSV

Save Analysis

Share Report

34. RESEARCH WORKSPACE

Create a "My Research" section.

Users can save:

Companies

Uploaded documents

Questions

AI insights

Comparisons

Reports

Example:

My Research

"Indian Defence Sector Analysis"

Documents:

HAL FY2025

BEL FY2025

Mazagon Dock FY2025

Saved queries:

"What are the major risks?"

"Compare revenue growth."

35. PROTOTYPE DEMO DATA

For the first Lovable prototype, use realistic mock data rather than claiming live financial data.

Include sample companies:

Reliance Industries

Sector: Energy / Conglomerate

TCS

Sector: IT

Infosys

Sector: IT

HAL

Sector: Defence

BEL

Sector: Defence

Tata Motors

Sector: Automobile / EV

Also include:

Custom Company

"Example Aerospace Pvt Ltd"

This demonstrates the document-based company functionality.

36. SAMPLE PROTOTYPE WORKFLOW

The demo should work like this:

Step 1

User opens FinSight.

Step 2

Clicks:

"Upload Annual Report"

Step 3

Uploads:

HAL_Annual_Report_2025.pdf

Step 4

System displays:

"Document processed successfully."

Pages: 312

Tables detected: 47

Financial sections detected: 12

Step 5

System generates:

HAL Financial Intelligence

Revenue

Profit

Margins

Debt

Cash Flow

Risk

Management Outlook

Step 6

User asks:

"What are HAL's biggest risks?"

Step 7

System displays:

Risk 1

Risk 2

Risk 3

with page citations.

Step 8

User asks:

"How has revenue changed over the last five years?"

Step 9

System displays:

Line chart + CAGR + AI interpretation.

Step 10

User selects BEL.

Step 11

Clicks:

"Compare"

Step 12

Dashboard displays:

HAL vs BEL

Revenue Growth

Profit Growth

Margins

ROE

Debt

Risk

Management Outlook

Step 13

AI generates:

"Comparative Analysis"

Step 14

User clicks:

"Generate Research Report"

and downloads the complete analysis.

37. NAVIGATION STRUCTURE

Use this navigation:

Dashboard

Companies

Upload Report

Compare

Sector Intelligence

My Documents

Research Workspace

Reports

Settings

38. DESIGN LANGUAGE

Design should feel like a premium fintech research terminal.

Style:

Dark/light mode

Clean cards

Professional typography

Subtle gradients

Financial charts

Minimal animations

High information density without clutter

Strong visual hierarchy

Avoid:

Cartoon illustrations

Excessive neon

Generic chatbot UI

Overly rounded childish cards

Fake stock-market graphics

The design should communicate:

Trust + Intelligence + Research + Finance

39. CHAT / AI INTERFACE

Do NOT make the homepage look like ChatGPT.

Instead, place AI querying inside:

Ask FinSight

The interface should have:

Query box

"Ask about this company or document..."

Quick prompts:

"Summarize financial performance"

"Find major risks"

"Explain revenue growth"

"Analyze management outlook"

"Compare with another company"

"Find unusual changes"

The answer should appear as structured insight cards rather than a long chatbot conversation.

40. IMPORTANT DIFFERENTIATION

FinSight should be positioned around five capabilities:

1. Document Intelligence

Users can upload financial PDFs.

2. Company Intelligence

Users can analyze supported companies.

3. Custom Company Intelligence

Users can create a company workspace from uploaded documents, including companies without complete structured market coverage.

4. Comparative Intelligence

Users can compare companies and documents.

5. Evidence-Grounded AI

AI answers should be traceable to source pages.

Do NOT claim that any single one of these features is completely unique in the market.

The differentiation is the combination of these capabilities into one research workflow.

41. DISCLAIMER

Display:

"FinSight is an educational and analytical research platform. Information and AI-generated insights are provided for research purposes and should not be considered financial or investment advice."

42. PROTOTYPE BACKEND PLACEHOLDERS

The Lovable prototype should be designed so that real APIs can be connected later.

Create placeholder services for:

Company data API

Financial statements API

PDF parser

Embedding model

Vector database

LLM

Authentication

Report generation

For the prototype, use mock JSON data.

Do not pretend mock data is live.

43. FUTURE TECHNICAL IMPLEMENTATION

Recommended architecture:

Frontend:

React + TypeScript + Tailwind CSS

Backend:

Python + FastAPI

Database:

PostgreSQL

Vector Database:

ChromaDB or pgvector

PDF processing:

PyMuPDF / pdfplumber

Table extraction:

Camelot / specialized table extraction pipeline

Embedding model:

A suitable finance/document embedding model

LLM:

An open-source or API-based LLM during development

Charts:

Recharts / Chart.js

Authentication:

JWT / Supabase Auth

Storage:

Supabase Storage / object storage

44. CORE PRODUCT STATEMENT

The final website should communicate this clearly:

FinSight transforms complex financial documents into structured, visual and evidence-backed financial intelligence.

Instead of asking users to manually read hundreds of pages, FinSight allows them to upload documents, analyze companies, compare financial performance, identify risks, explore trends and ask natural-language questions while maintaining traceability to the original source.

45. MVP PRIORITY

The prototype should prioritize these features first:

Company search

Company dashboard

PDF upload

Document processing UI

Financial extraction

Financial charts

Risk analysis

AI question answering

Page-level citations

Company comparison

Custom/unlisted company workspace

PDF research report export

Do not build every possible feature immediately.

The most important demo flow is:

Upload PDF → Analyze → Ask Question → Get Evidence → View Chart → Compare → Generate Report.

46. FINAL PRODUCT EXPERIENCE

The ideal user experience should be:

"I have a 400-page annual report. I don't want to spend hours reading it."

FinSight:

Upload

↓

Understand

↓

Ask

↓

Verify

↓

Compare

↓

Analyze

↓

Generate Report

The platform should feel like a financial research assistant and analytical workspace, not merely a stock screener and not merely a chatbot.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://alpha-doc-analyst.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b445776a-1ade-45f4-ab88-5a06d012f59d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
