import { z } from 'zod';

// Usage Analytics Schema
export const usageAnalyticsSchema = z.object({
  id: z.string(),
  period: z.enum(['hour', 'day', 'week', 'month']),
  timestamp: z.date(),
  metrics: z.object({
    pageViews: z.number(),
    uniqueVisitors: z.number(),
    sessions: z.number(),
    bounceRate: z.number(),
    avgSessionDuration: z.number(),
    conversions: z.number()
  })
});

// User Behavior Schema
export const userBehaviorSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  event: z.string(),
  page: z.string(),
  timestamp: z.date(),
  properties: z.record(z.string(), z.any()).optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional()
});

// Revenue Analytics Schema
export const revenueAnalyticsSchema = z.object({
  id: z.string(),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']),
  timestamp: z.date(),
  metrics: z.object({
    totalRevenue: z.number(),
    newCustomerRevenue: z.number(),
    recurringRevenue: z.number(),
    churnedRevenue: z.number(),
    avgRevenuePerUser: z.number(),
    conversionRate: z.number()
  })
});

// Feature Usage Schema
export const featureUsageSchema = z.object({
  id: z.string(),
  featureName: z.string(),
  category: z.string(),
  usageCount: z.number(),
  uniqueUsers: z.number(),
  avgUsagePerUser: z.number(),
  adoptionRate: z.number(),
  timestamp: z.date()
});

// Custom Report Schema
export const customReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['usage', 'revenue', 'user-behavior', 'performance', 'custom']),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains']),
    value: z.string()
  })),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }),
  groupBy: z.array(z.string()).optional(),
  metrics: z.array(z.string()),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isScheduled: z.boolean(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    recipients: z.array(z.string())
  }).optional()
});

// Input Schemas
export const createReportSchema = customReportSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateReportSchema = createReportSchema.partial();

// Query Schemas
export const analyticsQuerySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  metrics: z.array(z.string()).optional(),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.string(),
    value: z.string()
  })).optional()
});

// Export types
export type UsageAnalytics = z.infer<typeof usageAnalyticsSchema>;
export type UserBehavior = z.infer<typeof userBehaviorSchema>;
export type RevenueAnalytics = z.infer<typeof revenueAnalyticsSchema>;
export type FeatureUsage = z.infer<typeof featureUsageSchema>;
export type CustomReport = z.infer<typeof customReportSchema>;
export type CreateReport = z.infer<typeof createReportSchema>;
export type UpdateReport = z.infer<typeof updateReportSchema>;
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;