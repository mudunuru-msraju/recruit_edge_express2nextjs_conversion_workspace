import { z } from 'zod';

// Subscription Schema
export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  planName: z.string(),
  status: z.enum(['active', 'cancelled', 'past_due', 'trialing', 'incomplete']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  trialEnd: z.date().optional(),
  amount: z.number(),
  currency: z.string(),
  interval: z.enum(['month', 'year']),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Payment Schema
export const paymentSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['succeeded', 'pending', 'failed', 'cancelled']),
  paymentMethod: z.string(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  failureReason: z.string().optional(),
  createdAt: z.date(),
  processedAt: z.date().optional()
});

// Invoice Schema
export const invoiceSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  invoiceNumber: z.string(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  currency: z.string(),
  dueDate: z.date(),
  paidAt: z.date().optional(),
  hostedInvoiceUrl: z.string().optional(),
  invoicePdf: z.string().optional(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitAmount: z.number(),
    amount: z.number()
  })),
  createdAt: z.date()
});

// Billing Analytics Schema
export const billingAnalyticsSchema = z.object({
  id: z.string(),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']),
  timestamp: z.date(),
  metrics: z.object({
    totalRevenue: z.number(),
    newSubscriptions: z.number(),
    churnedSubscriptions: z.number(),
    activeSubscriptions: z.number(),
    averageRevenuePerUser: z.number(),
    monthlyRecurringRevenue: z.number(),
    churnRate: z.number(),
    lifetimeValue: z.number()
  })
});

// Payment Method Schema
export const paymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['card', 'bank_account', 'paypal']),
  last4: z.string().optional(),
  brand: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  isDefault: z.boolean(),
  createdAt: z.date()
});

// Plan Schema
export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  currency: z.string(),
  interval: z.enum(['month', 'year']),
  intervalCount: z.number(),
  trialPeriodDays: z.number().optional(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Input Schemas
export const createSubscriptionSchema = z.object({
  userId: z.string(),
  planId: z.string(),
  paymentMethodId: z.string(),
  trialPeriodDays: z.number().optional()
});

export const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().optional()
});

export const createPaymentMethodSchema = z.object({
  userId: z.string(),
  type: z.enum(['card', 'bank_account', 'paypal']),
  token: z.string(),
  isDefault: z.boolean().optional()
});

// Query Schemas
export const subscriptionQuerySchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'past_due', 'trialing', 'incomplete']).optional(),
  planId: z.string().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

export const paymentQuerySchema = z.object({
  subscriptionId: z.string().optional(),
  status: z.enum(['succeeded', 'pending', 'failed', 'cancelled']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

export const invoiceQuerySchema = z.object({
  subscriptionId: z.string().optional(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

// Export types
export type Subscription = z.infer<typeof subscriptionSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type BillingAnalytics = z.infer<typeof billingAnalyticsSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Plan = z.infer<typeof planSchema>;
export type CreateSubscription = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;
export type CreatePaymentMethod = z.infer<typeof createPaymentMethodSchema>;
export type SubscriptionQuery = z.infer<typeof subscriptionQuerySchema>;
export type PaymentQuery = z.infer<typeof paymentQuerySchema>;
export type InvoiceQuery = z.infer<typeof invoiceQuerySchema>;