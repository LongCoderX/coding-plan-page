# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI Coding Plan comparison tool that displays pricing and features across Chinese AI platform providers (智谱AI, Kimi, MiniMax, 小米·MiMo, 字节·方舟, 阿里·百炼, 百度·千帆, 腾讯云, 京东云, etc.). It's a static single-page application with no build tools required.

## Architecture

- **`index.html`** - Main application containing embedded CSS and JavaScript. Loads `config.json` and `plans.json` via fetch at runtime. All rendering (filtering, sorting, table display) is client-side.
- **`config.json`** - UI configuration: header text, platform recommendations with star ratings, rating methodology, and i18n strings for filters/table columns.
- **`plans.json`** - The pricing data array. Each entry contains vendor, plan name, pricing tiers, supported models, request limits, benefits, and notes.
- **`scripts/generate-readme.js`** - Node.js script that reads `config.json` and `plans.json` and outputs a formatted Markdown README.
- **`styles/main.css`** - Empty placeholder file (styles are embedded in `index.html`).

## Commands

**Generate README.md from data files:**
```bash
node scripts/generate-readme.js
```

**Serve locally (any static server works):**
```bash
npx serve
# or
python -m http.server 8080
```

## Data Flow

1. `config.json` and `plans.json` are the source of truth
2. `scripts/generate-readme.js` reads both to generate `README.md`
3. `index.html` fetches both files at runtime to render the interactive UI
4. When updating data, edit `config.json` and/or `plans.json`, then regenerate README if needed

## Adding New Plans

Add new entries to `plans.json`. Each plan object should have:
- `vendor`, `plan`, `action` (affiliate link)
- `firstMonthPrice`, `monthlyPrice`, `quarterlyPrice`, `yearlyPrice` (use `-` for unavailable)
- `models` array
- `fiveHoursRequests`, `weeklyRequests`, `monthlyRequests` (use numbers, `"无限制"`, or `"未公开"`)
- `benefits` array
- `note` string (use `\n` for line breaks)
