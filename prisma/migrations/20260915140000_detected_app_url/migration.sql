-- CreateTable
CREATE TABLE "DetectedAppUrl" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetectedAppUrl_pkey" PRIMARY KEY ("id")
);
