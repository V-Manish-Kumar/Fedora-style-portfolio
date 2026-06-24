export interface VFSNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  appId?: string; // Optional: specific app override (like 'resume' for PDF)
  url?: string;   // Optional: URL to open in BrowserApp
  children?: VFSNode[];
}

export const vfs: VFSNode = {
  name: 'Home',
  type: 'folder',
  children: [
    {
      name: 'projects',
      type: 'folder',
      children: [
        {
          name: 'team-connect.md',
          type: 'file',
          appId: 'projects',
          content: `![Team Connect Screenshot](/team-connect-screenshot.png)

# Team Connect

A comprehensive team collaboration platform designed to streamline team communication and project management.

## Features

### Authentication & Authorization
- User registration and login system
- Secure password hashing with Werkzeug
- Admin dashboard with advanced user management
- Role-based access control

### Task Management
- Create, update, and delete tasks
- Set deadlines with real-time countdowns
- Track task status (Pending, In Progress, Completed)
- Visual task overview with deadline alerts

### Real-Time Messaging
- Multi-room chat functionality
- Real-time communication using Socket.IO
- Create and join custom chat rooms
- Instant message delivery

### File Sharing
- Secure file upload and download
- Track file metadata (size, upload date)
- Download counter for each file
- Easy file management interface

### Video Conferencing
- Built-in meeting room functionality
- Join or create video meetings
- Room-based organization

### AI Chatbot
- Google Generative AI integration (Gemini Pro)
- Context-aware conversations
- Session management
- Instant AI-powered assistance

### Admin Features
- User management dashboard
- Add, edit, and delete users
- Error logging and monitoring
- System-wide oversight

## Tech Stack
- **Backend Framework:** Python, Flask, Flask-Login, Flask-SocketIO, Gunicorn
- **Frontend Framework:** HTML5, CSS3, JavaScript, Socket.IO Client
- **Database Engine:** MySQL (Hosted via Aiven Cloud)
- **AI Integration:** Google Generative AI (Gemini Pro)

## How to Use / Install
1. Clone the repository:
   \`git clone https://github.com/V-Manish-Kumar/Team-connect\`
2. Install dependencies:
   \`pip install -r requirements.txt\`
3. Set up environment variables in \`.env\` (MySQL credentials, Google Gemini API Key).
4. Run the app:
   \`python app.py\`
5. Open \`http://localhost:5000\` in your browser.`
        },
        {
          name: 'mcp-server.md',
          type: 'file',
          appId: 'projects',
          content: `![Unified MCP Server Screenshot](/mcp-server-screenshot.png)

# Unified Model Context Protocol (MCP) Server

An intelligent Model Context Protocol (MCP) Server that unifies database management, AI-powered analytics, and workflow automation into a single platform.

## Features

### Database Orchestration
- Exposes tools to create databases and manage tables (create/modify/drop)
- Execute custom SQL queries securely
- View database schemas and metadata
- Database health monitoring and server checks

### Zapier Integration
- Trigger automated workflows from MCP tools
- Connect with external applications (GitHub, Gmail, Zoom)
- Event-driven actions and notifications

### MindsDB Integration
- AI-powered predictions and predictive analytics
- Machine learning model integration directly within SQL workflows
- Intelligent query processing

### Real-Time SSE Streaming
- Server-Sent Events (SSE) for real-time streaming and tool execution responses
- Scalable, modular architecture for extensible tools

## Tech Stack
- **Languages & Frameworks:** Python, FastMCP
- **Databases:** MySQL, MindsDB (AI predictions)
- **Workflow Automation:** Zapier Integration
- **Infrastructure:** Docker
- **Protocols:** Server-Sent Events (SSE) for real-time streaming`
        },
        {
          name: 'drug-discovery.md',
          type: 'file',
          appId: 'projects',
          content: `![Drug Discovery Screenshot](/drug-discovery-screenshot.png)

# Drug Discovery AI

An AI-accelerated cheminformatics and molecule screening platform designed to predict molecular properties and analyze chemical structures.

## Features

### Cheminformatics Modeling
- Calculate molecular weight, LogP (octanol-water partition coefficient)
- Assess structural properties: Hydrogen Bond Donors, Hydrogen Bond Acceptors, Rotatable Bonds
- Determine Topological Polar Surface Area (TPSA)
- Verify Lipinski's Rule of Five compliance and assess potential toxicity risk

### Structure Visualization
- Render 2D structural representations of chemical molecules from SMILES string inputs using RDKit

### Gemini Property Profiling
- Integrates Google Generative AI (Gemini Pro) to generate a comprehensive analysis of medicine:
  - Therapeutic Class
  - Potential Molecular Mechanisms
  - Predicted Pharmacokinetic Properties
  - Potential Side Effects & Drug Interactions
  - Estimated Efficacy Markers

### Database Storage
- Flask-SQLAlchemy and MySQL database integration to log screened molecules and predictive property profiles

## Tech Stack
- **Languages & Frameworks:** Python, Flask, Flask-SQLAlchemy
- **Cheminformatics:** RDKit
- **AI Integration:** Google Generative AI (Gemini Pro)
- **Database Engine:** MySQL`
        },
        {
          name: 'insta-ad-ai.md',
          type: 'file',
          appId: 'projects',
          content: `![InstaAD AI Screenshot](/insta-ad-ai-screenshot.png)

# InstaAD AI - Marketing Ad Generator

A modern full-stack SaaS application that helps small businesses generate professional marketing ads (posters, copy, and videos) in minutes using advanced AI generation.

## Features

### AI Ad Content Generation
- Generate headlines, copy, CTAs, and hashtags instantly using Google Gemini 3 Pro
- Quick pre-built templates customized for different industries

### AI Media Generation
- Create professional video ads with audio overlays using Google Veo 3 Fast Audio
- Generate marketing images using Google Veo 3

### AI Chat Assistant
- Interactive marketing chat advisor powered by Google Gemini 3 Pro via Puter.js for real-time tips

### Visual Poster Editor
- Custom poster editor canvas with editable templates, color schemes, and canvas downloads (export as PNG and videos as MP4)

## Tech Stack
- **Frontend Framework:** React 18, Vite, Tailwind CSS, Lucide React, html2canvas, Puter.js
- **Backend Framework:** Node.js, Express, Multer
- **AI Models:** Google Gemini 3 Pro, Google Veo 3`
        },
        {
          name: 'rag-system.md',
          type: 'file',
          appId: 'projects',
          content: `![RAG System Screenshot](/rag-system-screenshot.png)

# Mini RAG Application

A production-ready Retrieval-Augmented Generation (RAG) system that allows semantic search and grounded question-answering over custom uploaded documents.

## Features

### Text Chunking
- Intelligent text chunking using LangChain (1000 token chunk size with 15% overlap) to maintain contextual coherence

### Vector Embeddings
- Embed document chunks using Google Gemini \`text-embedding-004\` (768 dimensions)

### Vector Database
- Semantic search and retrieval using Qdrant vector database (Cosine similarity with 0.3 threshold and Top-10 chunks)

### Intelligent Reranking
- Cross-Encoder reranking using Jina AI (\`jina-reranker-v2-base-multilingual\`) to select the top 5 most relevant context chunks

### Grounded Answers
- LLM generation using Google Gemini (\`gemini-3-flash-preview\`) via Puter.js to receive accurate, context-grounded answers with inline citations

## Tech Stack
- **Frontend Framework:** React
- **Backend Framework:** FastAPI, LangChain
- **Vector DB:** Qdrant Cloud
- **Reranker:** Jina AI
- **LLM / Embedding:** Google Gemini, Puter.js`
        }
      ]
    },
    {
      name: 'skills',
      type: 'folder',
      children: [
        {
          name: 'skills.txt',
          type: 'file',
          appId: 'skills',
          content: `Programming Languages:
- Python (95%)
- Java (90%)
- C# (85%)
- C (80%)
- JavaScript (85%)
- Apex (Salesforce) (80%)

Frameworks & Libraries:
- Flask (90%)
- React (85%)
- Spring Boot (80%)
- Node.js (75%)
- Bootstrap (85%)
- TensorFlow (75%)
- Lightning Web Components (80%)

Database & Tools:
- MySQL (85%)
- Git (85%)
- Postman API (80%)
- Unity (70%)
- Pandas (75%)
- Salesforce CRM (85%)

Cloud & Platforms:
- Google Cloud Platform (75%)
- Salesforce Platform (85%)
- MLOps (70%)
- Process Automation (80%)

Core Concepts:
- Data Structures & Algorithms (90%)
- Object-Oriented Programming (95%)
- Computer Networks (80%)
- RESTful APIs (85%)
- MCP Server (75%)
- WebSocket (80%)`
        }
      ]
    },
    {
      name: 'certificate',
      type: 'folder',
      children: [
        {
          name: 'csharp-w3schools.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://www.coursera.org/account/accomplishments/verify/MBPJRHFZQ4AU',
          content: 'W3Schools: Certified in C# Programming\nLink: https://www.coursera.org/account/accomplishments/verify/MBPJRHFZQ4AU\nDescription: Certified in C# programming language. Demonstrated proficiency in object-oriented programming concepts.'
        },
        {
          name: 'unity-essentials.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://www.credly.com/badges/e8e68424-b685-4ecd-9320-cdedc893237a/linked_in_profile',
          content: 'Unity Essentials Badge\nLink: https://www.credly.com/badges/e8e68424-b685-4ecd-9320-cdedc893237a/linked_in_profile\nDescription: Verified Credly badge for completion of the Unity Essentials pathway.'
        },
        {
          name: 'mlops-google.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://www.cloudskillsboost.google/public_profiles/4a1472cd-92c3-42cb-982c-ada09de4e668/badges/16065226',
          content: 'Google: Machine Learning Operations (MLOps) for Generative AI\nLink: https://www.cloudskillsboost.google/public_profiles/4a1472cd-92c3-42cb-982c-ada09de4e668/badges/16065226\nDescription: Completed comprehensive certification in MLOps for Generative AI on Google Cloud Skills Boost.'
        },
        {
          name: 'ai-fundamentals-ibm.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://www.credly.com/badges/159d748c-1491-430c-85dc-b030e039c545/linked_in_profile',
          content: 'IBM: Artificial Intelligence Fundamentals\nLink: https://www.credly.com/badges/159d748c-1491-430c-85dc-b030e039c545/linked_in_profile\nDescription: Credly badge for IBM AI Fundamentals certification.'
        },
        {
          name: 'salesforce-agentblazer.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://drive.google.com/file/d/1fsq9x69JitZWlUYocxJ-wdmQv__y4QnZ/view',
          content: 'SmartBridge & Salesforce: Salesforce Developer with Agentblazer Champion Program\nLink: https://drive.google.com/file/d/1fsq9x69JitZWlUYocxJ-wdmQv__y4QnZ/view\nDescription: Completed 8-week virtual internship program and achieved champion status in Agentblazer.'
        },
        {
          name: 'github-copilot-microsoft.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://learn.microsoft.com/en-us/users/manish-3030/credentials/5432446d57c0275a',
          content: 'Microsoft: GitHub Copilot\nLink: https://learn.microsoft.com/en-us/users/manish-3030/credentials/5432446d57c0275a\nDescription: Microsoft Certified Specialist credential in GitHub Copilot.'
        },
        {
          name: 'oracle-ai-foundations.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=322808110OCI25AICFA',
          content: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=322808110OCI25AICFA\nDescription: Validates fundamental understanding of Artificial Intelligence and Machine Learning concepts and OCI AI features.'
        },
        {
          name: 'redhat-openshift.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://www.credly.com/badges/ee9e258e-fdb0-4e09-a42a-028b0e5864e6',
          content: 'Red Hat OpenShift Development I: Introduction to Containers with Podman\nLink: https://www.credly.com/badges/ee9e258e-fdb0-4e09-a42a-028b0e5864e6\nDescription: Demonstrates skills in containerizing applications and running them on Red Hat OpenShift.'
        },
        {
          name: 'oracle-devops.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED36C1DEA1B8E5DD7C98CC3FFB3DB5BF3F',
          content: 'Oracle Cloud Infrastructure 2025 Certified DevOps Professional\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED36C1DEA1B8E5DD7C98CC3FFB3DB5BF3F\nDescription: Equips you with essential skills to thrive in dynamic DevOps environments and leverage Oracle Cloud Infrastructure (OCI) to streamline workflows effectively.'
        },
        {
          name: 'oracle-datascience.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED67937320B849FD463D9563BE0724C73B',
          content: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED67937320B849FD463D9563BE0724C73B\nDescription: For data scientists responsible for building data science solutions and managing the complete lifecycle of machine learning models on OCI.'
        },
        {
          name: 'oracle-multicloud.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=874DE1256B1E74975C92A9DB6DF686881F1496CAB463AC112327A36FD12F992C',
          content: 'Oracle Cloud Infrastructure 2025 Certified Multicloud Architect Professional\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=874DE1256B1E74975C92A9DB6DF686881F1496CAB463AC112327A36FD12F992C\nDescription: Evaluates expertise in designing and implementing Oracle Cloud Infrastructure (OCI) multicloud solutions.'
        },
        {
          name: 'oracle-vectorsearch.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=03B9B8853EDC7FB8ACD75B913E009FA7F2E2A5D3FB50756E46DCBF3A2630A9C0',
          content: 'Oracle AI Vector Search Certified Professional\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=03B9B8853EDC7FB8ACD75B913E009FA7F2E2A5D3FB50756E46DCBF3A2630A9C0\nDescription: For DBAs and AI engineers to build AI-driven applications using vector data storage, indexing, and Retrieval-Augmented Generation (RAG) using PL/SQL and Python.'
        },
        {
          name: 'oracle-generativeai.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=9D2354E114690816B73579DD1AD32E8862CC7E3174CC67A2181F91117829A614',
          content: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional\nLink: https://catalog-education.oracle.com/ords/certview/sharebadge?id=9D2354E114690816B73579DD1AD32E8862CC7E3174CC67A2181F91117829A614\nDescription: Designed for ML/AI engineers to build, trace, evaluate, and deploy Large Language Model (LLM) applications using OCI Generative AI Service.'
        },
        {
          name: 'machine-learning-columbia.txt',
          type: 'file',
          appId: 'certificate',
          url: 'https://badges.plus.columbia.edu/8681f608-8b78-4e22-b6ff-7bd126b2857b#acc.WQmAhVl5',
          content: 'Columbia University: Machine Learning I\nLink: https://badges.plus.columbia.edu/8681f608-8b78-4e22-b6ff-7bd126b2857b#acc.WQmAhVl5\nDescription: Certification showing proficiency in regression analysis and classification techniques.'
        }
      ]
    },
    {
      name: 'about',
      type: 'folder',
      children: [
        {
          name: 'about.txt',
          type: 'file',
          appId: 'about',
          content: `Manish Kumar Vodlamodi - Computer Science & AI/ML Student

I'm a Computer Science Engineering student at Malla Reddy College of Engineering and Technology, specializing in AI/ML with a CGPA of 8.3. I'm passionate about developing innovative solutions that combine web development with artificial intelligence.

Interests:
- AI & Machine Learning
- Web Development
- Software Engineering
- Generative AI
- Real-time Systems
- Healthcare Technology
- MLOps
- Game Development`
        }
      ]
    },
    {
      name: 'contact',
      type: 'folder',
      children: [
        {
          name: 'resume1.pdf',
          type: 'file',
          appId: 'resume' // Opens PDF Viewer
        }
      ]
    }
  ]
};
