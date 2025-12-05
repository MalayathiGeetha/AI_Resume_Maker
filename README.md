
# 🧠 AI-Based Resume Maker  
**React + Spring Boot + Spring AI + Ollama + DeepSeek**

An AI-powered Resume Builder that dynamically generates ATS-friendly resume data in **JSON format** based on user prompts.  
The backend uses **Spring Boot + Spring AI** integrated with **Ollama (local LLM)** and **DeepSeek API** for advanced resume generation.  
The frontend is built with **React, Tailwind CSS, and DaisyUI** for a clean, modern UI.

---

## 🚀 Features

### 🔥 AI-Powered Resume Generation
- User enters a prompt → Backend generates **structured resume JSON**
- Uses **local Ollama model** (e.g., DeepSeek-R1 / Llama3) + **DeepSeek API**
- Highly optimized for ATS readability

### 📄 Resume Storage & Management
- Save generated resumes in database  
- Fetch/update/delete resume data  
- Supports multiple versions per user

### 🖥️ Clean & Modern Frontend (React)
- Tailwind + DaisyUI-powered UI  
- Prompt editor  
- Live JSON preview  
- Resume template preview (optional future feature)

### 🔐 Secure API Architecture
- Spring Boot REST APIs  
- Validation + error-handling  
- Ready for authentication (JWT) in future

---

## 🏗️ Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS  
- DaisyUI  
- Axios  

### **Backend**
- Spring Boot 3  
- Spring AI  
- Ollama Integration  
- DeepSeek API  
- Spring Data JPA  
- PostgreSQL / MySQL  

---

## 📦 Installation & Setup

### **Backend**
```bash
git clone <your-repo>
cd backend
./mvnw spring-boot:run
