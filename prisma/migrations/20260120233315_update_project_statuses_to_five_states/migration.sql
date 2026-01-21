-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "developmentCost" REAL NOT NULL,
    "deadline" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPLICATION_IN_PROGRESS',
    "clientId" TEXT NOT NULL,
    "feasibilityStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "feasibilityReason" TEXT,
    "feasibilityReviewedAt" DATETIME,
    "feasibilityReviewedBy" TEXT,
    "developmentPlan" TEXT,
    "negotiationPending" TEXT,
    "negotiationMessage" TEXT,
    "negotiationRequestedAt" DATETIME,
    "totalPaid" REAL NOT NULL DEFAULT 0,
    "failureReason" TEXT,
    "failureResponsibility" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("clientId", "createdAt", "deadline", "developmentCost", "developmentPlan", "failureReason", "failureResponsibility", "feasibilityReason", "feasibilityReviewedAt", "feasibilityReviewedBy", "feasibilityStatus", "id", "name", "negotiationMessage", "negotiationPending", "negotiationRequestedAt", "requirements", "status", "totalPaid", "updatedAt") SELECT "clientId", "createdAt", "deadline", "developmentCost", "developmentPlan", "failureReason", "failureResponsibility", "feasibilityReason", "feasibilityReviewedAt", "feasibilityReviewedBy", "feasibilityStatus", "id", "name", "negotiationMessage", "negotiationPending", "negotiationRequestedAt", "requirements", 
    CASE 
        WHEN "status" = 'NEW' THEN 'APPLICATION_IN_PROGRESS'
        WHEN "status" = 'UNDER_AGREEMENT' THEN 'DISCUSSION_IN_PROGRESS'
        WHEN "status" = 'ONGOING' THEN 'DEVELOPMENT_IN_PROGRESS'
        WHEN "status" = 'SUCCESSFUL' THEN 'APPROVED'
        WHEN "status" = 'REJECTED' THEN 'FAILED'
        WHEN "status" = 'FAILED' THEN 'FAILED'
        ELSE 'APPLICATION_IN_PROGRESS'
    END,
    "totalPaid", "updatedAt" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
