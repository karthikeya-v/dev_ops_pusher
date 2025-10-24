# DevOps Pusher

A modern, real-time DevOps dashboard for monitoring deployments, tracking builds, and managing environments. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Real-time Deployment Tracking**: Monitor active deployments across multiple environments
- **Environment Status Dashboard**: Track health, uptime, and versions of all environments
- **Deployment History**: View detailed deployment history with success/failure rates
- **Quick Actions**: One-click deployment triggers and rollback capabilities
- **Repository Statistics**: Track commits, branches, and contributor activity
- **Beautiful UI**: Modern, responsive design with dark mode and smooth animations
- **API Routes**: RESTful API endpoints for integration with CI/CD pipelines

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## API Endpoints

- `GET /api/deployments` - Fetch deployment history
- `POST /api/deployments` - Trigger new deployment
- `GET /api/stats` - Get deployment statistics
- `GET /api/environments` - Get environment status

## Project Structure

```
dev_ops_pusher/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   └── components/        # React components
│       ├── DeploymentCard.tsx
│       ├── EnvironmentStatus.tsx
│       ├── QuickAction.tsx
│       └── RepoStats.tsx
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features in Detail

### Deployment Tracking
- Real-time status updates
- Branch and commit information
- Duration and timestamp tracking
- Success/failure indicators

### Environment Management
- Multi-environment support (Production, Staging, Preview)
- Health status monitoring
- Version tracking
- Uptime statistics

### Quick Actions
- Deploy to Production
- Create Preview Deployments
- Rollback to Previous Version

### Analytics
- Deployment success rates
- Average deployment times
- Active environment counts
- Repository activity metrics

## Customization

### Adding New Environments

Edit `src/app/page.tsx` to add new environments to the dashboard.

### Styling

Modify `tailwind.config.ts` to customize colors and themes.

### API Integration

Connect to your CI/CD pipeline by updating the API routes in `src/app/api/`.

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
