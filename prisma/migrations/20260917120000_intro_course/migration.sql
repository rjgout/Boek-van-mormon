-- Introductiecursus ("Ontdek het Boek van Mormon") + persoonlijke
-- lijstvolgorde voor cursussen/spelletjes. Zuiver additief: nieuwe enum-
-- waarden, een nieuwe nullable kolom, en nieuwe tabellen — geen bestaande
-- kolom/tabel/rij wijzigt van betekenis.

-- CourseType.INTRO
ALTER TYPE "CourseType" ADD VALUE 'INTRO';

-- XPReason voor het afronden van een introductieles (zie completeIntroLesson)
ALTER TYPE "XPReason" ADD VALUE 'INTRO_LESSON_COMPLETED';

-- Zelfgerapporteerd kennisniveau bij de onboarding
CREATE TYPE "IntroKnowledgeLevel" AS ENUM ('NEVER', 'SOME', 'READ_BEFORE', 'UNSURE');

-- Nullable: bestaande gebruikers hebben dit nooit ingevuld, en dat is een
-- geldige, bewust ondersteunde toestand (val terug op de standaardvolgorde).
ALTER TABLE "User" ADD COLUMN "bomKnowledgeLevel" "IntroKnowledgeLevel";

CREATE TABLE "IntroLesson" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IntroLesson_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "IntroLesson_number_key" ON "IntroLesson"("number");
CREATE UNIQUE INDEX "IntroLesson_slug_key" ON "IntroLesson"("slug");

CREATE TABLE "IntroExercise" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "wordBank" TEXT,

    CONSTRAINT "IntroExercise_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "IntroExercise_lessonId_idx" ON "IntroExercise"("lessonId");
ALTER TABLE "IntroExercise" ADD CONSTRAINT "IntroExercise_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "IntroLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "IntroExerciseOption" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IntroExerciseOption_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "IntroExerciseOption_exerciseId_idx" ON "IntroExerciseOption"("exerciseId");
ALTER TABLE "IntroExerciseOption" ADD CONSTRAINT "IntroExerciseOption_exerciseId_fkey"
    FOREIGN KEY ("exerciseId") REFERENCES "IntroExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "IntroExerciseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "givenText" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntroExerciseAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "IntroExerciseAttempt_userId_idx" ON "IntroExerciseAttempt"("userId");
CREATE INDEX "IntroExerciseAttempt_exerciseId_idx" ON "IntroExerciseAttempt"("exerciseId");
ALTER TABLE "IntroExerciseAttempt" ADD CONSTRAINT "IntroExerciseAttempt_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IntroExerciseAttempt" ADD CONSTRAINT "IntroExerciseAttempt_exerciseId_fkey"
    FOREIGN KEY ("exerciseId") REFERENCES "IntroExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "IntroLessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "IntroLessonProgress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "IntroLessonProgress_userId_lessonId_key" ON "IntroLessonProgress"("userId", "lessonId");
ALTER TABLE "IntroLessonProgress" ADD CONSTRAINT "IntroLessonProgress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IntroLessonProgress" ADD CONSTRAINT "IntroLessonProgress_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "IntroLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "UserListOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listKey" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "UserListOrder_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserListOrder_userId_listKey_itemKey_key" ON "UserListOrder"("userId", "listKey", "itemKey");
ALTER TABLE "UserListOrder" ADD CONSTRAINT "UserListOrder_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
