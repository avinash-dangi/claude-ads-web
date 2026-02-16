# Project Overview: Claude Ads Web

## Mission
To democratize enterprise-grade advertising audits by providing a comprehensive, automated analysis tool for major advertising platforms (Google, Meta, LinkedIn, etc.). The goal is to help businesses optimize their ad spend, improve performance, and gain actionable insights without the high cost of manual agency audits.

## Core Value Proposition
- **Automated Expertise**: Encodes the knowledge of expert media buyers into 190+ automated checks.
- **Holistic Analysis**: Evaluates not just settings, but strategy, creative, tracking, and structure.
- **Actionable Scoring**: Provides a clear "Health Score" (0-100) and letter grade, moving beyond vanity metrics.
- **Privacy-First**: Designed to run locally or as a static web app, minimizing data exposure.

## Key Features

### 1. Comprehensive Audit System
A multi-platform auditing engine that evaluates ad accounts against best practices.
- **Google Ads**: 74 checks (Conversion Tracking, Wasted Spend, Structure, etc.)
- **Meta Ads**: 46 checks (Pixel Health, Creative Diversity, Audience, etc.)
- **Weighted Scoring**: Algorithms that prioritize critical issues (5.0x severity) over minor ones.

### 2. Strategy Planner
An interactive tool to generate industry-specific advertising strategies.
- **Templates**: Pre-configured strategies for SaaS, E-commerce, Local Services, and B2B.
- **Recommendations**: Budget allocation, platform mix, and KPI targets based on business type.

### 3. Results Dashboard
A visual analytics suite to present audit findings.
- **Health Score**: High-level performance metric.
- **Prioritized Action Plan**: Ranked list of tasks based on impact and effort.
- **Quick Wins**: Low-effort, high-impact fixes identified automatically.

## Architecture & Tech Stack

The project is a modern, static-first web application designed for performance and developer experience.

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1 (with v4 `@theme` configuration)
- **State Management**: Zustand 5.0 (Client-side store)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

### Design Decisions
- **Client-Side Logic**: Scoring and analysis happen in the browser for speed and privacy.
- **Modular Scoring Engine**: Separation of concerns between data collection (Questionnaire) and analysis (Scoring Algorithms).
- **Component-First**: Built with reusable, accessible UI components for consistency.

## Target Platforms
- **Google Ads** (Search, PMax, YouTube, Display)
- **Meta Ads** (Facebook, Instagram)
- **LinkedIn Ads** (Planned)
- **TikTok Ads** (Planned)
- **Microsoft Ads** (Planned)
