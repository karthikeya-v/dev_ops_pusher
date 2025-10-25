import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { workItems } = await request.json()

    if (!workItems || !Array.isArray(workItems) || workItems.length === 0) {
      return NextResponse.json({ error: 'Work items array is required' }, { status: 400 })
    }

    const organization = process.env.AZURE_DEVOPS_ORG
    const project = process.env.AZURE_DEVOPS_PROJECT
    const pat = process.env.AZURE_DEVOPS_PAT

    if (!organization || !project || !pat) {
      return NextResponse.json(
        {
          error: 'Azure DevOps not configured. Please set AZURE_DEVOPS_ORG, AZURE_DEVOPS_PROJECT, and AZURE_DEVOPS_PAT in your environment variables.'
        },
        { status: 500 }
      )
    }

    const results = []
    const errors = []

    // Azure DevOps API endpoint
    const baseUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems`

    // Create authorization header
    const authHeader = {
      Authorization: `Basic ${Buffer.from(`:${pat}`).toString('base64')}`
    }

    for (const item of workItems) {
      try {
        // Map work item type to Azure DevOps work item type
        const azureType = mapWorkItemType(item.type)

        // Build the JSON patch document for creating work items
        const patchDocument = [
          {
            op: 'add',
            path: '/fields/System.Title',
            value: item.title
          },
          {
            op: 'add',
            path: '/fields/System.Description',
            value: item.description
          },
          {
            op: 'add',
            path: '/fields/Microsoft.VSTS.Common.Priority',
            value: mapPriority(item.priority)
          }
        ]

        // Add acceptance criteria if present
        if (item.acceptanceCriteria && item.acceptanceCriteria.length > 0) {
          patchDocument.push({
            op: 'add',
            path: '/fields/Microsoft.VSTS.Common.AcceptanceCriteria',
            value: item.acceptanceCriteria.map((criteria: string, i: number) => `${i + 1}. ${criteria}`).join('\n')
          })
        }

        // Add tags if present
        if (item.tags && item.tags.length > 0) {
          patchDocument.push({
            op: 'add',
            path: '/fields/System.Tags',
            value: item.tags.join('; ')
          })
        }

        // Add estimated hours if present
        if (item.estimatedHours) {
          patchDocument.push({
            op: 'add',
            path: '/fields/Microsoft.VSTS.Scheduling.OriginalEstimate',
            value: item.estimatedHours
          })
        }

        // Add assigned to if present
        if (item.assignedTo) {
          patchDocument.push({
            op: 'add',
            path: '/fields/System.AssignedTo',
            value: item.assignedTo
          })
        }

        // Create the work item
        const response = await axios.post(
          `${baseUrl}/$${azureType}?api-version=7.0`,
          patchDocument,
          {
            headers: {
              ...authHeader,
              'Content-Type': 'application/json-patch+json'
            }
          }
        )

        results.push({
          success: true,
          title: item.title,
          id: response.data.id,
          url: response.data._links.html.href
        })
      } catch (error: any) {
        console.error('Error creating work item:', error.response?.data || error.message)
        errors.push({
          success: false,
          title: item.title,
          error: error.response?.data?.message || error.message
        })
      }
    }

    return NextResponse.json({
      created: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Error pushing to Azure DevOps:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to push work items to Azure DevOps' },
      { status: 500 }
    )
  }
}

function mapWorkItemType(type: string): string {
  // Map our types to Azure DevOps work item types
  const typeMap: Record<string, string> = {
    'User Story': 'User Story',
    'Task': 'Task',
    'Bug': 'Bug',
    'Feature': 'Feature',
    'Epic': 'Epic'
  }
  return typeMap[type] || 'Task'
}

function mapPriority(priority: string): number {
  // Map priority to Azure DevOps priority values (1-4)
  const priorityMap: Record<string, number> = {
    'Critical': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4
  }
  return priorityMap[priority] || 3
}
