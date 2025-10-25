/**
 * Agent Registry System
 * Manages registration, discovery, and routing of portable agents
 */

import fs from 'fs'
import path from 'path'
import { AgentManifest, AgentRoute, AgentCategory } from './types'

export class AgentRegistry {
  private agents: Map<string, AgentManifest> = new Map()
  private routes: AgentRoute[] = []
  private apiEndpoints: Map<string, string> = new Map()
  
  constructor() {
    // Auto-discover agents on startup
    this.discoverAgents().catch(console.error)
  }
  
  /**
   * Auto-discover agents from filesystem
   */
  async discoverAgents(): Promise<void> {
    const agentsDir = path.join(process.cwd(), 'agents')
    
    if (!fs.existsSync(agentsDir)) {
      console.warn('No agents directory found')
      return
    }
    
    try {
      const agentDirs = fs.readdirSync(agentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      
      for (const agentDir of agentDirs) {
        await this.loadAgent(agentDir)
      }
      
      console.log(`✅ Discovered ${this.agents.size} agents`)
    } catch (error) {
      console.error('Failed to discover agents:', error)
    }
  }
  
  /**
   * Load and register a single agent
   */
  async loadAgent(agentDir: string): Promise<void> {
    try {
      const manifestPath = path.join(process.cwd(), 'agents', agentDir, 'manifest.json')
      
      if (!fs.existsSync(manifestPath)) {
        console.warn(`No manifest.json found for agent: ${agentDir}`)
        return
      }
      
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
      const manifest: AgentManifest = JSON.parse(manifestContent)
      
      // Validate manifest
      this.validateManifest(manifest)
      
      // Register agent
      this.registerAgent(manifest)
      
      console.log(`✅ Loaded agent: ${manifest.name} (${manifest.id})`)
    } catch (error) {
      console.error(`❌ Failed to load agent ${agentDir}:`, error)
    }
  }
  
  /**
   * Register an agent with the system
   */
  registerAgent(manifest: AgentManifest): void {
    this.agents.set(manifest.id, manifest)
    
    // Register routes
    this.registerAgentRoutes(manifest)
    
    // Register API endpoints
    this.registerAgentAPI(manifest)
  }
  
  /**
   * Register agent routes
   */
  private registerAgentRoutes(manifest: AgentManifest): void {
    // Landing page route
    this.routes.push({
      path: manifest.routes.landing,
      component: path.join('agents', manifest.id, manifest.export.pages.landing),
      type: 'page'
    })
    
    // Workspace route
    this.routes.push({
      path: manifest.routes.workspace,
      component: path.join('agents', manifest.id, manifest.export.pages.workspace),
      type: 'page'
    })
  }
  
  /**
   * Register agent API endpoints
   */
  private registerAgentAPI(manifest: AgentManifest): void {
    const apiPath = manifest.api.basePath
    const handlerPath = path.join('agents', manifest.id, manifest.export.api)
    
    this.apiEndpoints.set(apiPath, handlerPath)
  }
  
  /**
   * Validate agent manifest
   */
  private validateManifest(manifest: AgentManifest): void {
    const required = ['id', 'name', 'version', 'category', 'api', 'routes', 'export']
    
    for (const field of required) {
      if (!manifest[field as keyof AgentManifest]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
    
    if (this.agents.has(manifest.id)) {
      throw new Error(`Agent with ID '${manifest.id}' already registered`)
    }
  }
  
  /**
   * Get all registered agents
   */
  getAllAgents(): AgentManifest[] {
    return Array.from(this.agents.values())
  }
  
  /**
   * Get agents by category
   */
  getAgentsByCategory(category: AgentCategory): AgentManifest[] {
    return Array.from(this.agents.values())
      .filter(agent => agent.category === category)
      .sort((a, b) => a.ui.navigation.order - b.ui.navigation.order)
  }
  
  /**
   * Get agent by ID
   */
  getAgent(id: string): AgentManifest | undefined {
    return this.agents.get(id)
  }
  
  /**
   * Get all routes
   */
  getRoutes(): AgentRoute[] {
    return this.routes
  }
  
  /**
   * Get API endpoint handler
   */
  getAPIHandler(basePath: string): string | undefined {
    return this.apiEndpoints.get(basePath)
  }
  
  /**
   * Generate static params for Next.js
   */
  generateStaticParams(): Array<{ category: string; slug: string }> {
    return Array.from(this.agents.values()).map(agent => ({
      category: agent.category,
      slug: agent.id
    }))
  }
  
  /**
   * Get navigation structure
   */
  getNavigation(): Record<AgentCategory, AgentManifest[]> {
    return {
      'job-seeker-agents': this.getAgentsByCategory('job-seeker-agents'),
      'recruiter-agents': this.getAgentsByCategory('recruiter-agents'),
      'admin-agents': this.getAgentsByCategory('admin-agents')
    }
  }
}

// Singleton instance
export const agentRegistry = new AgentRegistry()