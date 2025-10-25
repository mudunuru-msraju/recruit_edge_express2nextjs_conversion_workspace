import { pgTable, serial, integer, varchar, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const interviewTypeEnum = pgEnum('interview_type', [
  'behavioral',
  'technical',
  'case_study',
  'system_design',
  'coding',
  'general'
]);

// Interview Schedules Table
export const interviewSchedules = pgTable('interview_schedules', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').notNull(),
  interviewerId: integer('interviewer_id').notNull(),
  candidateId: integer('candidate_id').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration').notNull(), // in minutes
  interviewType: interviewTypeEnum('interview_type').notNull(),
  location: varchar('location', { length: 255 }), // physical address or video link
  meetingLink: text('meeting_link'),
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // scheduled, completed, cancelled, no_show, rescheduled
  notes: text('notes'),
  feedback: text('feedback'),
  score: integer('score'), // 0-100
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations (would connect to applications and users tables in full implementation)
export const interviewSchedulesRelations = relations(interviewSchedules, ({ one }) => ({
  // application: one(applications, {
  //   fields: [interviewSchedules.applicationId],
  //   references: [applications.id],
  // }),
  // interviewer: one(users, {
  //   fields: [interviewSchedules.interviewerId],
  //   references: [users.id],
  // }),
  // candidate: one(users, {
  //   fields: [interviewSchedules.candidateId],
  //   references: [users.id],
  // }),
}));

// Types
export type InterviewSchedule = typeof interviewSchedules.$inferSelect;
export type InsertInterviewSchedule = typeof interviewSchedules.$inferInsert;
export type UpdateInterviewSchedule = Partial<InsertInterviewSchedule>;

export type InterviewType = 'behavioral' | 'technical' | 'case_study' | 'system_design' | 'coding' | 'general';
export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export type AvailabilitySlot = {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  interviewerId?: number;
  candidateId?: number;
};

export type AvailabilityCheckRequest = {
  interviewerIds: number[];
  candidateId: number;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
};

export type AvailabilityCheckResponse = {
  availableSlots: AvailabilitySlot[];
  conflicts: {
    date: string;
    time: string;
    reason: string;
  }[];
};