import { NextResponse } from 'next/server'

export async function GET() {
  // Mock deployment data - in production, this would fetch from a database or CI/CD service
  const deployments = [
    {
      id: 1,
      name: 'Production Deploy',
      status: 'success',
      branch: 'main',
      commit: 'a1b2c3d',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      duration: '2m 34s',
      environment: 'production',
      author: 'john.doe@example.com'
    },
    {
      id: 2,
      name: 'Staging Deploy',
      status: 'in_progress',
      branch: 'develop',
      commit: 'e4f5g6h',
      timestamp: new Date().toISOString(),
      duration: '1m 12s',
      environment: 'staging',
      author: 'jane.smith@example.com'
    },
    {
      id: 3,
      name: 'Feature Branch',
      status: 'failed',
      branch: 'feature/new-ui',
      commit: 'i7j8k9l',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      duration: '45s',
      environment: 'preview',
      author: 'bob.wilson@example.com'
    },
  ]

  return NextResponse.json({ deployments })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { branch, environment } = body

    // Mock deployment creation
    const newDeployment = {
      id: Math.floor(Math.random() * 10000),
      name: `Deploy ${branch} to ${environment}`,
      status: 'in_progress',
      branch,
      commit: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      duration: '0s',
      environment,
      author: 'api@devops-pusher.com'
    }

    return NextResponse.json({ deployment: newDeployment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deployment' }, { status: 500 })
  }
}
