/**
 * Agent System Types
 * Core type definitions for the portable agent system
 */

export interface AgentManifest {
  id: string
  name: string
  version: string
  category: 'job-seeker-agents' | 'recruiter-agents' | 'admin-agents'
  description: string
  author: string
  tags: string[]
  
  api: {
    basePath: string
    endpoints: Array<{
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      path: string
      description: string
    }>
  }
  
  routes: {
    landing: string
    workspace: string
  }
  
  database?: {
    tables: string[]
    migrations?: string
  }
  
  dependencies: {
    required: string[]
    optional: string[]
  }
  
  permissions: string[]
  
  ui: {
    icon: string
    color: string
    navigation: {
      category: string
      order: number
    }
  }
  
  export: {
    component: string
    api: string
    pages: {
      landing: string
      workspace: string
    }
  }
}

export interface AgentRoute {
  path: string
  component: string
  type: 'page' | 'api'
}

export interface AgentDatabase {
  tables: Record<string, any>
  migrations: string
}

export interface AgentRegistryConfig {
  agents: AgentManifest[]
  autoDiscovery: boolean
  enableHotReload: boolean
}

export type AgentCategory = 'job-seeker-agents' | 'recruiter-agents' | 'admin-agents'

export interface AgentApiEndpoint {
  method: string
  path: string
  handler: string
  middleware?: string[]
}