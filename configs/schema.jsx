
import {
  integer,
  json,
  pgTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

// Existing courses table
export const CourseList = pgTable("courseList", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  level: varchar("level").notNull(),
  includeVideo: varchar("includeVideo").notNull().default("Yes"),
  courseOutput: json("courseOutput").notNull(),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("username"),
  userProfileImage: varchar("userProfileImage"),
  courseBanner: varchar("coursebanner").default("/images.png"),
   createdOnPlan: varchar("createdOnPlan")
    .notNull()
    .default("free"),
  publish: varchar("publish"),
});

// Existing chapters table
export const Chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  chapterId: integer("chapterId").notNull(),
  content: json("content").notNull(),
  videoId: varchar("videoId").notNull(),
});

// Lifetime free course usage
export const FreeCourseUsage = pgTable("freeCourseUsage", {
  userId: varchar("userId").primaryKey(),
  courseCount: integer("courseCount").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Razorpay Pro subscription
export const UserSubscription = pgTable("userSubscription", {
  userId: varchar("userId").primaryKey(),
  razorpaySubscriptionId: varchar("razorpaySubscriptionId").unique(),
  razorpayPlanId: varchar("razorpayPlanId"),
  status: varchar("status").notNull().default("created"),
  currentPeriodStart: timestamp("currentPeriodStart", {
    withTimezone: true,
  }),
  currentPeriodEnd: timestamp("currentPeriodEnd", {
    withTimezone: true,
  }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
