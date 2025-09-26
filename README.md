# Restaurant Discovery & Analytics Platform

**A voice- & data-aware restaurant discovery platform** that integrates OpenStreetMap (OSM) POI data with user-generated reviews, NLP sentiment analysis, event tracking for product analytics, Redis caching for performance, and spatial queries (PostGIS). Built as a modular backend + React frontend with focus on scalability, observability and product thinking.

---
<img width="600" alt="restaurant_app" src="https://github.com/user-attachments/assets/df09c98a-c7e9-4996-bcae-b5d571d211b8" />

## 🚀 Project Summary

- Users discover real restaurants (fetched from **OpenStreetMap**) by location or search.  
- Admins can add/curate restaurants; users can submit reviews.  
- Reviews are processed with **NLP sentiment analysis**.  
- **Event tracking** logs product usage for funnels and A/B testing.  
- Redis provides **caching** for hot queries and top lists.  
- **Postgres + PostGIS** stores restaurant and review data.

---
<img width="600" alt="localhost_5173_ (4)" src="https://github.com/user-attachments/assets/73075ed8-91e7-4bb2-afb5-74c3e16708e8" />

## ⭐ Key Features

- Real-world restaurant data from **OpenStreetMap**  
- Authentication + RBAC (**User, Owner, Admin**)  
- Reviews with ratings and **sentiment analysis**  
- Spatial search: **nearby restaurants** using PostGIS  
- **Top restaurants leaderboard** (Redis sorted sets)  
- Event tracking & A/B testing  
- Mobile-first **PWA frontend**  
- Modular, microservice-ready architecture  

---
| Owner | User |
|-----------|-----------|
| <img width="500" alt="localhost_5173_ (5)" src="https://github.com/user-attachments/assets/bc9326ed-3999-41c8-a5d5-4211308a1e6d" /> | <img width="500" alt="localhost_5173_ (1)" src="https://github.com/user-attachments/assets/4fc54a86-7baf-4351-8d5f-4a9bd4fa4fde" /> |



## 🧭 Tech Stack

**Frontend**
- Next.js / React, TypeScript  
- Tailwind CSS, React Query  

**Backend**
- Node.js, Express / NestJS  
- Prisma ORM  

**Databases & Cache**
- PostgreSQL + PostGIS  
- Redis (cache, sorted sets, rate limiting)  

**AI / NLP**
- Whisper / Deepgram (transcription, optional)  
- Hugging Face transformers / sentiment model  
- LangChain + OpenAI API (advanced intent parsing)  

---

<img width="600" alt="localhost_5173_ (2)" src="https://github.com/user-attachments/assets/aba748cc-9cf2-40d5-8731-4aa88b105438" />

