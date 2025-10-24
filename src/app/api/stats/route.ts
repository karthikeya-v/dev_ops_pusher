import { NextResponse } from 'next/server'

export async function GET() {
  // Mock statistics - in production, this would calculate from real data
  const stats = {
    totalDeployments: 127,
    successRate: 94.5,
    avgDeployTime: '2m 15s',
    activeEnvironments: 3,
    deploymentsToday: 8,
    deploymentsThisWeek: 47,
    failureRate: 5.5,
    topContributor: 'john.doe@example.com',
    metrics: {
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        deployments: Math.floor(Math.random() * 10)
      })),
      daily: Array.from({ length: 7 }, (_, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        deployments: Math.floor(Math.random() * 20) + 5
      }))
    }
  }

  return NextResponse.json({ stats })
}
