import { z } from 'zod';

// System Health Schema
export const systemHealthSchema = z.object({
  id: z.string(),
  service: z.string(),
  status: z.enum(['healthy', 'warning', 'critical', 'unknown']),
  uptime: z.number(),
  responseTime: z.number(),
  lastCheck: z.date(),
  metrics: z.object({
    cpu: z.number(),
    memory: z.number(),
    disk: z.number(),
    network: z.number()
  })
});

// Performance Metrics Schema
export const performanceMetricsSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  endpoint: z.string(),
  method: z.string(),
  responseTime: z.number(),
  statusCode: z.number(),
  requestSize: z.number(),
  responseSize: z.number(),
  userAgent: z.string().optional(),
  ip: z.string().optional()
});

// Alert Schema
export const alertSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum(['performance', 'security', 'error', 'capacity']),
  status: z.enum(['active', 'acknowledged', 'resolved']),
  triggeredAt: z.date(),
  resolvedAt: z.date().optional(),
  assignedTo: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Uptime Record Schema
export const uptimeRecordSchema = z.object({
  id: z.string(),
  service: z.string(),
  timestamp: z.date(),
  status: z.enum(['up', 'down', 'degraded']),
  responseTime: z.number(),
  errorMessage: z.string().optional()
});

// Alert Rule Schema
export const alertRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  metric: z.string(),
  operator: z.enum(['>', '<', '>=', '<=', '==', '!=']),
  threshold: z.number(),
  duration: z.number(), // in minutes
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  enabled: z.boolean(),
  notifications: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Input Schemas
export const createAlertRuleSchema = alertRuleSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateAlertRuleSchema = createAlertRuleSchema.partial();
export const acknowledgeAlertSchema = z.object({
  alertId: z.string(),
  acknowledgement: z.string().optional()
});

// Query Schemas
export const systemHealthQuerySchema = z.object({
  services: z.array(z.string()).optional(),
  status: z.enum(['healthy', 'warning', 'critical', 'unknown']).optional(),
  timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).optional()
});

export const metricsQuerySchema = z.object({
  endpoint: z.string().optional(),
  method: z.string().optional(),
  timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).default('24h'),
  granularity: z.enum(['1m', '5m', '15m', '1h', '1d']).default('1h')
});

export const alertsQuerySchema = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.enum(['performance', 'security', 'error', 'capacity']).optional(),
  status: z.enum(['active', 'acknowledged', 'resolved']).optional(),
  assignedTo: z.string().optional(),
  timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).optional()
});

// Export types
export type SystemHealth = z.infer<typeof systemHealthSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetricsSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type UptimeRecord = z.infer<typeof uptimeRecordSchema>;
export type AlertRule = z.infer<typeof alertRuleSchema>;
export type CreateAlertRule = z.infer<typeof createAlertRuleSchema>;
export type UpdateAlertRule = z.infer<typeof updateAlertRuleSchema>;
export type AcknowledgeAlert = z.infer<typeof acknowledgeAlertSchema>;
export type SystemHealthQuery = z.infer<typeof systemHealthQuerySchema>;
export type MetricsQuery = z.infer<typeof metricsQuerySchema>;
export type AlertsQuery = z.infer<typeof alertsQuerySchema>;