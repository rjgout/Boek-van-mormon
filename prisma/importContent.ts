import { PrismaClient } from "@prisma/client";
import { generateFillBlank, generateWordBank, generateTrueFalse } from "../src/lib/exerciseGen";
import type { SeedBook } from "./content";

/**
 * Laadt boeken/hoofdstukken/verzen in de database en genereert er
 * invuloefeningen bij. Idempotent: herdraaien overschrijft bestaande
 * verzen/oefeningen van dezelfde hoofdstukken.
 */
export async function importBooks(prisma: PrismaClient, books: SeedBook[]) {
  for (let bookOrder = 0; bookOrder < books.length; bookOrder++) {
    const seedBook = books[bookOrder];
    const book = await prisma.book.upsert({
      where: { slug: seedBook.slug },
      update: { name: seedBook.name, order: bookOrder },
      create: { slug: seedBook.slug, name: seedBook.name, order: bookOrder },
    });

    for (let chapterOrder = 0; chapterOrder < seedBook.chapters.length; chapterOrder++) {
      const seedChapter = seedBook.chapters[chapterOrder];
      const chapter = await prisma.chapter.upsert({
        where: { bookId_number: { bookId: book.id, number: seedChapter.number } },
        update: { order: chapterOrder },
        create: { bookId: book.id, number: seedChapter.number, order: chapterOrder },
      });

      await prisma.exercise.deleteMany({ where: { chapterId: chapter.id } });
      await prisma.verse.deleteMany({ where: { chapterId: chapter.id } });

      const verseIds: string[] = [];
      for (let i = 0; i < seedChapter.verses.length; i++) {
        const verse = await prisma.verse.create({
          data: { chapterId: chapter.id, number: i + 1, text: seedChapter.verses[i] },
        });
        verseIds.push(verse.id);
      }

      let exerciseOrder = 0;
      for (let i = 0; i < seedChapter.verses.length; i++) {
        const verseRef = `${seedBook.name} ${seedChapter.number}:${i + 1}`;
        const sourceVerseId = verseIds[i];

        const fillBlank = generateFillBlank(seedChapter.verses[i], verseRef, i);
        if (fillBlank) {
          await prisma.exercise.create({
            data: {
              chapterId: chapter.id,
              order: exerciseOrder++,
              type: fillBlank.type,
              verseRef: fillBlank.verseRef,
              sourceVerseId,
              prompt: fillBlank.prompt,
              answers: JSON.stringify(fillBlank.answers),
            },
          });
        }

        if (i % 2 === 0) {
          const wordBank = generateWordBank(seedChapter.verses[i], verseRef, i);
          if (wordBank) {
            await prisma.exercise.create({
              data: {
                chapterId: chapter.id,
                order: exerciseOrder++,
                type: wordBank.type,
                verseRef: wordBank.verseRef,
                sourceVerseId,
                prompt: wordBank.prompt,
                answers: JSON.stringify(wordBank.answers),
                wordBank: JSON.stringify(wordBank.wordBank),
              },
            });
          }
        } else {
          const trueFalse = generateTrueFalse(seedChapter.verses[i], verseRef, i);
          if (trueFalse) {
            await prisma.exercise.create({
              data: {
                chapterId: chapter.id,
                order: exerciseOrder++,
                type: trueFalse.type,
                verseRef: trueFalse.verseRef,
                sourceVerseId,
                prompt: trueFalse.prompt,
                answers: JSON.stringify(trueFalse.answers),
              },
            });
          }
        }
      }

      console.log(`  - ${seedBook.name} ${seedChapter.number}: ${exerciseOrder} oefeningen`);
    }
  }
}
