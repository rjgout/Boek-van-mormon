import { PrismaClient } from "@prisma/client";
import {
  generateFillBlank,
  generateWordBank,
  generateTrueFalse,
  buildDistractorPool,
  shuffleWithSeed,
} from "../src/lib/exerciseGen";
import { syncCourses } from "../src/lib/courses";
import type { SeedBook } from "./content";

/**
 * Laadt boeken/hoofdstukken/verzen in de database en genereert er
 * invuloefeningen bij. Idempotent: herdraaien overschrijft bestaande
 * verzen/oefeningen van dezelfde hoofdstukken.
 */
export async function importBooks(
  prisma: PrismaClient,
  books: SeedBook[],
  log: (msg: string) => void = console.log
) {
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

      const distractorPool = buildDistractorPool(seedChapter.verses);

      let exerciseOrder = 0;
      for (let i = 0; i < seedChapter.verses.length; i++) {
        const verseRef = `${seedBook.name} ${seedChapter.number}:${i + 1}`;
        const sourceVerseId = verseIds[i];

        const fillBlank = generateFillBlank(seedChapter.verses[i], verseRef, i, distractorPool);
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
              options: fillBlank.options
                ? {
                    create: fillBlank.options.map((label, order) => ({
                      label,
                      isCorrect: fillBlank.answers.includes(label.toLowerCase()),
                      order,
                    })),
                  }
                : undefined,
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

      // Handmatig geschreven begrijpend-lezen-oefeningen (zie ComprehensionExercise
      // in prisma/content.ts) — kunnen niet automatisch uit de verzen worden
      // afgeleid zoals de rest hierboven.
      for (let c = 0; c < (seedChapter.comprehension ?? []).length; c++) {
        const comp = seedChapter.comprehension![c];
        if (comp.type === "MULTIPLE_CHOICE") {
          await prisma.exercise.create({
            data: {
              chapterId: chapter.id,
              order: exerciseOrder++,
              type: "MULTIPLE_CHOICE",
              verseRef: comp.verseRef,
              prompt: comp.prompt,
              answers: JSON.stringify([comp.options[comp.correctIndex].toLowerCase()]),
              options: {
                create: comp.options.map((label, order) => ({ label, isCorrect: order === comp.correctIndex, order })),
              },
            },
          });
        } else {
          const shuffled = shuffleWithSeed(comp.items, c + 1);
          await prisma.exercise.create({
            data: {
              chapterId: chapter.id,
              order: exerciseOrder++,
              type: "SEQUENCE",
              verseRef: comp.verseRef,
              prompt: comp.prompt,
              answers: JSON.stringify(comp.items.map((item) => item.toLowerCase())),
              wordBank: JSON.stringify(shuffled),
            },
          });
        }
      }

      log(`  - ${seedBook.name} ${seedChapter.number}: ${exerciseOrder} oefeningen`);
    }
  }

  await syncCourses(prisma);
}
