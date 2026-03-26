# Product & Blog Platform

A full-stack web application for managing products, brands, and SEO-focused blog content.
Designed to support scalable content management and improve search engine visibility.

## 🚀 Features

* Blog management system (SEO-friendly)
* Brand & category management
* Custom rich text editor built with Slate.js
* Grid-based content editor (12-column system) for responsive layouts
* Dynamic content rendering (Next.js SSR/CSR)
* State management using Zustand

## 🧩 Editor Capabilities

* Grid-based layout system (12-column)
* TailwindCSS-compatible grid structure (grid-cols-*, col-span-*)
* Responsive layout control across breakpoints (sm, md, lg, xl)
* Dynamic column management (add/remove/reorder)
* Support nested content blocks within grid layout

## 🧱 Tech Stack

* Frontend: Next.js (React + TypeScript)
* UI: TailwindCSS v3
* State Management: Zustand
* Editor: Slate.js (custom rich text editor)
* Database: MySQL

## 🏗️ Architecture

* Next.js handles both SSR and CSR for SEO optimization
* Content is managed via a custom editor (Slate.js) and stored as structured data
* Zustand is used for lightweight global state management
* API layer connects frontend with database (MySQL)

## ⚙️ Installation

```bash
git clone https://github.com/HOCKIIE/ibs-machinex.git
cd ibs-machinex
npm install
```

## ▶️ Run

```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
```

## 📊 Highlights

* Built a custom rich text editor using Slate.js
* Optimized for SEO using Next.js SSR
* Structured content system for blogs, brands, and categories

## 👨‍💻 Author

Suphawat Kongson (HOCKY)
