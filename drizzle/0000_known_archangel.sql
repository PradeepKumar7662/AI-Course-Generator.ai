CREATE TABLE IF NOT EXISTS "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"chapterId" integer NOT NULL,
	"content" json NOT NULL,
	"videoId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courseList" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"level" varchar NOT NULL,
	"includeVideo" varchar DEFAULT 'Yes' NOT NULL,
	"courseOutput" json NOT NULL,
	"createdBy" varchar NOT NULL,
	"username" varchar,
	"userProfileImage" varchar,
	"coursebanner" varchar DEFAULT '/images.png',
	"publish" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "freeCourseUsage" (
	"userId" varchar PRIMARY KEY NOT NULL,
	"courseCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userSubscription" (
	"userId" varchar PRIMARY KEY NOT NULL,
	"razorpaySubscriptionId" varchar,
	"razorpayPlanId" varchar,
	"status" varchar DEFAULT 'created' NOT NULL,
	"currentPeriodStart" timestamp with time zone,
	"currentPeriodEnd" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "userSubscription_razorpaySubscriptionId_unique" UNIQUE("razorpaySubscriptionId")
);
