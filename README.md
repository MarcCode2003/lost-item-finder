# 🔍 Lost & Found Hub: AI-Powered Visual Search (JP & PH)

A full-stack application designed to bridge the gap in lost-and-found cultures between Japan and the Philippines. This project uses **Computer Vision** to automate the identification of lost items, moving beyond disorganized social media feeds and manual processes.

## 🚀 Live Production Links
* **Frontend (Next.js):** [https://lost-item-finder-pi.vercel.app](https://lost-item-finder-pi.vercel.app)
* **API Documentation (FastAPI):** [https://lost-item-finder-ch8j.onrender.com/docs](https://lost-item-finder-ch8j.onrender.com/docs)

---

## 🌏 The Mission
In **Japan**, while the *Koban* system is world-class, searching for specific items remains a manual task. In the **Philippines**, lost items often get buried in social media groups. This platform centralizes the process using **AI-driven visual matching**, making it easier for finders and owners to reconnect regardless of language barriers.

## 🛠️ Tech Stack & System Architecture

This project uses a **Decoupled Architecture** to handle high-performance AI tasks separately from the user interface.

* **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS.
* **Backend:** FastAPI (Python), PyTorch, CLIP (Contrastive Language-Image Pre-training).
* **Database:** Supabase (PostgreSQL) with `pgvector` for vector similarity search.
* **Storage:** Cloudinary API for optimized image delivery.
* **Deployment:** Vercel & Render.

---

## 🧠 Technical Highlight: Semantic Visual Search

Instead of relying on keywords (which can be inaccurate), this app uses **Vector Embeddings**:

1.  **Extraction:** The Python backend uses a **CLIP Model** to transform an image into a **512-dimensional vector**.
2.  **Vector Search:** These embeddings represent the visual "DNA" of an item.
3.  **Matching:** I implemented **Cosine Similarity** logic within Supabase to find items that "look" the most similar, even if they are described differently by the user.

---

## 🚧 Engineering Challenges Overcome

* **Deployment & Environments:** Resolved Vercel build-time constraints by optimizing the Next.js build pipeline and managing environment variable injection for Supabase and Cloudinary.
* **CORS & Cross-Cloud Handshakes:** Successfully configured secure Cross-Origin Resource Sharing (CORS) between Vercel (Frontend) and Render (Backend).
* **Memory Management:** Optimized PyTorch model loading to function within the strict 512MB RAM limits of cloud-free tiers.

---

## 👨‍💻 About the Developer
I am **Maaku (Marc)**, my goal is to leverage AI and Full-Stack Engineering to build impactful tools for the Philippine and Japanese tech ecosystems.

**Location:** Philippines
**Target Roles:** Software Engineer / DevOps / Data Engineer / Cloud Engineer (PH & Japan)