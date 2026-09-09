-- CreateTable
CREATE TABLE "sector_news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sector_news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sector_news_url_key" ON "sector_news"("url");

-- CreateIndex
CREATE INDEX "sector_news_publishedAt_idx" ON "sector_news"("publishedAt" DESC);
