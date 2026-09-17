import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import type { IntroLessonSeed } from "./introContent";
import type { IntroPersonSeed } from "./introPersons";

/**
 * Laadt de introductiecursus ("Ontdek het Boek van Mormon", zie
 * prisma/introContent.ts) in de database. Handmatig geschreven content, net
 * als de podcastcursus — geen automatische generatie. Idempotent: herdraaien
 * overschrijft de content-blokken/oefeningen van dezelfde les, en laat andere
 * lessen en gebruikersvoortgang ongemoeid (Progress-rijen hangen aan
 * IntroLesson.id, dat stabiel blijft — alleen IntroExercise wordt vervangen).
 */
export async function importIntroLessons(
  prisma: PrismaClient,
  lessons: IntroLessonSeed[],
  log: (msg: string) => void = console.log
) {
  for (const seed of lessons) {
    const lesson = await prisma.introLesson.upsert({
      where: { slug: seed.slug },
      update: {
        number: seed.number,
        title: seed.title,
        summary: seed.summary,
        content: JSON.stringify(seed.blocks),
        order: seed.number,
      },
      create: {
        number: seed.number,
        slug: seed.slug,
        title: seed.title,
        summary: seed.summary,
        content: JSON.stringify(seed.blocks),
        order: seed.number,
      },
    });

    await prisma.introExercise.deleteMany({ where: { lessonId: lesson.id } });

    const exerciseRows: Prisma.IntroExerciseCreateManyInput[] = [];
    const optionRows: Prisma.IntroExerciseOptionCreateManyInput[] = [];

    seed.exercises.forEach((ex, order) => {
      const exerciseId = randomUUID();
      exerciseRows.push({
        id: exerciseId,
        lessonId: lesson.id,
        order,
        type: ex.type,
        prompt: ex.prompt,
        answers: JSON.stringify(ex.answers.map((a) => a.toLowerCase())),
        wordBank: ex.wordBank ? JSON.stringify(ex.wordBank) : undefined,
      });
      ex.options?.forEach((o, idx) => {
        optionRows.push({ id: randomUUID(), exerciseId, label: o.label, isCorrect: o.isCorrect, order: idx });
      });
    });

    if (exerciseRows.length > 0) {
      await prisma.introExercise.createMany({ data: exerciseRows });
    }
    if (optionRows.length > 0) {
      await prisma.introExerciseOption.createMany({ data: optionRows });
    }

    log(`  - Les ${seed.number} (${seed.title}): ${seed.exercises.length} oefeningen`);
  }
}

/**
 * Vult de (bij deze cursus geïntroduceerde) Person-tabel — voorheen volledig
 * ongebruikt fundament, zie het schemacommentaar bij Person. Twee losse
 * upserts (eerst alle personen zonder vader, dan pas fatherId koppelen) zodat
 * de volgorde in introPersons.ts er niet toe doet.
 */
export async function importIntroPersons(
  prisma: PrismaClient,
  persons: IntroPersonSeed[],
  log: (msg: string) => void = console.log
) {
  for (const p of persons) {
    await prisma.person.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description },
      create: { slug: p.slug, name: p.name, description: p.description },
    });
  }
  for (const p of persons) {
    if (!p.fatherSlug) continue;
    const father = await prisma.person.findUnique({ where: { slug: p.fatherSlug } });
    if (!father) continue;
    await prisma.person.update({ where: { slug: p.slug }, data: { fatherId: father.id } });
  }
  log(`  - ${persons.length} personen`);
}
