-- AddColumn gender, motherId naar Person tabel
ALTER TABLE "Person" ADD COLUMN "gender" TEXT;
ALTER TABLE "Person" ADD COLUMN "motherId" TEXT;

-- AddForeignKey voor motherId
ALTER TABLE "Person" ADD CONSTRAINT "Person_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
