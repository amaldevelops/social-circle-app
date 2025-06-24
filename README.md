# social-circle-app

"Social Circle" is a social networking web app designed to help you stay connected with your closest friends.

## 📘 Project Introduction

This project is designed to strengthen technical proficiency in building a secure web based social networking app using standard web technologies.

- Front End : React/Javascript/HTML/CSS Web interface to interact with your closest friends.
- Backend : Node.js/Express for application Logic and PostgreSQL database for storing data

> ⚠️ **Note**: As the front end is hosted on GitHub Pages using React Router, directly accessing nested routes (e.g., `/send`) may lead to a 404 error. Please use the navigation within the site.

## 🚀 Live Demo

- **Front End (GitHub Pages):** [https://www.amalk.au/social-circle-app](https://www.amalk.au/social-circle-app)
- **Backend API (Render.com):** [https://social-circle-app.onrender.com/social-circle-api/v1/status](https://social-circle-app.onrender.com/social-circle-api/v1/status)
  > Note: As the apps are hosted on free hosting tiers, providers may cause delays of up to two minutes on first load.

---

## 💻 Source Code

- **Main GitHub Repository:** [Main GitHub Repository](https://github.com/amaldevelops/social-circle-app)
- **Front End Code:** [Front End Source Code](https://github.com/amaldevelops/social-circle-app/tree/main/frontend)
- **Back End Code:** [Back End Source Code](https://github.com/amaldevelops/social-circle-app/tree/main/backend)

---

## 🧱 Tech Stack

### Front End

- JavaScript, React, Vite, HTML, CSS

### Back End

- Node.js, Express, PostgreSQL, Prisma, Postman
- REST API with JWT auth
- Database interaction via Prisma

## ⚙️ Deployment Guide

### Local Setup

```bash
git git@github.com:amaldevelops/social-circle-app.git

# Front End
cd frontend
npm install

# Back End
cd ../backend
npm install
npx prisma generate
npx prisma db push
npm run seed  # (Optional)
```
