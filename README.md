# DevOps AI Pusher

An AI-powered tool to generate and push work items to Azure DevOps in bulk. Use natural language to describe your project needs and let AI create structured work items (User Stories, Tasks, Bugs, Features, Epics) with acceptance criteria, tags, and estimates. Built with Next.js 14, TypeScript, and OpenRouter AI.

## Features

- **AI-Powered Generation**: Use OpenRouter AI (Claude, GPT-4, etc.) to generate work items from natural language prompts
- **Bulk Work Item Creation**: Generate multiple work items at once with a single prompt
- **Azure DevOps Integration**: Automatically push generated work items to your Azure DevOps project
- **Quick Templates**: Pre-built templates for common scenarios (E-Commerce, API Development, Bug Fixes, etc.)
- **Smart Structuring**: AI creates detailed descriptions, acceptance criteria, tags, and estimates
- **Edit Before Push**: Review and edit all generated work items before pushing to Azure DevOps
- **Import/Export**: Import work items from JSON or export for later use
- **Beautiful UI**: Modern, responsive design with dark mode and smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Provider**: OpenRouter (supports Claude, GPT-4, and more)
- **DevOps Integration**: Azure DevOps REST API
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/karthikeya-v/dev_ops_pusher.git
cd dev_ops_pusher
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your API keys in `.env.local`:
```env
# OpenRouter API Key (get from https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-your-key-here

# Azure DevOps Configuration
AZURE_DEVOPS_ORG=your-organization-name
AZURE_DEVOPS_PROJECT=your-project-name
AZURE_DEVOPS_PAT=your-personal-access-token
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure and deploy

### Option 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/karthikeya-v/dev_ops_pusher)

## Setup Guides

### Getting OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Add credits to your account (pay-as-you-go)
5. Copy the key and add to `.env.local`

### Getting Azure DevOps Personal Access Token

1. Go to your Azure DevOps organization
2. Click on **User Settings** → **Personal Access Tokens**
3. Click **New Token**
4. Set the following scopes:
   - **Work Items**: Read, Write, & Manage
5. Copy the generated token (you won't see it again!)
6. Add to `.env.local`

## API Endpoints

- `POST /api/generate` - Generate work items using AI
- `POST /api/azure-push` - Push work items to Azure DevOps

## Project Structure

```
dev_ops_pusher/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/      # AI work item generation
│   │   │   └── azure-push/    # Azure DevOps integration
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main application page
│   └── components/
│       ├── WorkItemCard.tsx   # Work item display/edit
│       ├── PromptBuilder.tsx  # Quick prompt templates
│       └── ConfigPanel.tsx    # API configuration
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Usage Guide

### 1. Using Quick Templates

Click on any template card to automatically generate work items for common scenarios:
- **E-Commerce**: Shopping cart and checkout flow
- **API Development**: REST API endpoints and documentation
- **Bug Fixes**: Common application issues
- **MVP Features**: Product launch essentials
- **Documentation**: Technical documentation tasks
- **Performance**: Optimization and improvement tasks

### 2. Custom Prompts

Write your own prompt describing what you need:

**Example prompts:**
- "Create 5 user stories for a social media feed with likes, comments, and sharing"
- "Generate 10 tasks for setting up a CI/CD pipeline with GitHub Actions"
- "Create bug reports for login authentication issues with detailed steps to reproduce"
- "Generate an epic with 15 user stories for a complete project management system"

### 3. Review and Edit

- All generated work items appear in the list below
- Click the **Edit** button to modify any work item
- Click the **Delete** button to remove unwanted items
- Work items include:
  - Title and description
  - Type (User Story, Task, Bug, Feature, Epic)
  - Priority (Critical, High, Medium, Low)
  - Acceptance criteria
  - Tags and estimates

### 4. Push to Azure DevOps

- Click **Push to Azure DevOps** to create all work items in your project
- Items are created with all metadata (descriptions, acceptance criteria, tags, estimates)
- You'll receive a success message with the count of created items

### 5. Import/Export

- **Export JSON**: Download work items for backup or sharing
- **Import JSON**: Upload previously exported work items

## Work Item Types

The AI can generate the following work item types:

- **User Story**: End-user features with acceptance criteria
- **Task**: Technical implementation tasks
- **Bug**: Issues and defects with reproduction steps
- **Feature**: High-level capabilities
- **Epic**: Large initiatives containing multiple stories

## Customization

### Using Different AI Models

Edit `src/app/api/generate/route.ts` to change the AI model:

```typescript
model: 'anthropic/claude-3.5-sonnet'  // Claude (recommended)
model: 'openai/gpt-4-turbo'           // GPT-4
model: 'openai/gpt-3.5-turbo'         // GPT-3.5 (cheaper)
```

### Customizing Work Item Fields

Edit `src/app/api/azure-push/route.ts` to add custom Azure DevOps fields.

### Adding More Templates

Edit `src/components/PromptBuilder.tsx` to add your own prompt templates.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on GitHub.

## Author

Created by [karthikeya-v](https://github.com/karthikeya-v)

---

Built with ❤️ using Next.js and Vercel
