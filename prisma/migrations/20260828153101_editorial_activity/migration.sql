-- CreateTable
CREATE TABLE "editorial_activity" (
    "id" TEXT NOT NULL,
    "editorEmail" TEXT NOT NULL,
    "editorName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "collection" TEXT,
    "docTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "editorial_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "editorial_activity_createdAt_idx" ON "editorial_activity"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "editorial_activity_editorEmail_createdAt_idx" ON "editorial_activity"("editorEmail", "createdAt" DESC);
