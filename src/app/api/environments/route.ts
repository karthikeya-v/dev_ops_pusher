import { NextResponse } from 'next/server'

export async function GET() {
  // Mock environment data
  const environments = [
    {
      id: 1,
      name: 'Production',
      status: 'healthy',
      version: 'v1.2.5',
      url: 'app.example.com',
      uptime: '99.98%',
      lastDeploy: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      instances: 3,
      region: 'us-east-1'
    },
    {
      id: 2,
      name: 'Staging',
      status: 'deploying',
      version: 'v1.3.0-beta',
      url: 'staging.example.com',
      uptime: '99.95%',
      lastDeploy: new Date().toISOString(),
      instances: 2,
      region: 'us-west-2'
    },
    {
      id: 3,
      name: 'Preview',
      status: 'error',
      version: 'v1.3.0-rc',
      url: 'preview.example.com',
      uptime: '98.50%',
      lastDeploy: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      instances: 1,
      region: 'eu-west-1'
    }
  ]

  return NextResponse.json({ environments })
}
