import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  generateFillBlank,
  generateWordBank,
  generateTrueFalse,
  buildDistractorPool,
  shuffleWithSeed,
} from "../src/lib/exerciseGen";

export interface KidsStorySeed {
  number: number;
  title: string;
  text: string;
  images: string[];
}

const MAX_TEXT_EXERCISES_PER_STORY = 8;
const MIN_SENTENCE_LENGTH = 25;
const MAX_SENTENCE_LENGTH = 170;

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý])/)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_SENTENCE_LENGTH && s.length <= MAX_SENTENCE_LENGTH);
}

/**
 * Laadt de kindercursus ("Verhalen uit het Boek van Mormon", zie
 * prisma/kidsManifest.json) in de database. Genereert per verhaal een aantal
 * FILL_BLANK/WORD_BANK/TRUE_FALSE-oefeningen uit de verhaaltekst (zelfde
 * generators als bij de boekhoofdstukken, hier toegepast op zinnen i.p.v.
 * verzen) plus één IMAGE_CHOICE-oefening: welke van vier afbeeldingen (één
 * van dit verhaal, drie afleiders van andere verhalen) hoort bij dit
 * verhaal? Idempotent: herdraaien vervangt de oefeningen van hetzelfde
 * verhaal, en laat andere verhalen en gebruikersvoortgang ongemoeid.
 */
export async function importKidsStories(
  prisma: PrismaClient,
  stories: KidsStorySeed[],
  log: (msg: string) => void = console.log
) {
  const allImages = stories.flatMap((s) => s.images);

  for (let i = 0; i < stories.length; i++) {
    const seed = stories[i];
    const story = await prisma.kidsStory.upsert({
      where: { number: seed.number },
      update: { title: seed.title, text: seed.text, images: JSON.stringify(seed.images), order: seed.number },
      create: {
        number: seed.number,
        title: seed.title,
        text: seed.text,
        images: JSON.stringify(seed.images),
        order: seed.number,
      },
    });

    await prisma.kidsExercise.deleteMany({ where: { storyId: story.id } });

    const sentences = splitSentences(seed.text).slice(0, MAX_TEXT_EXERCISES_PER_STORY);
    const distractorPool = buildDistractorPool(sentences);

    const exerciseRows: Prisma.KidsExerciseCreateManyInput[] = [];
    const optionRows: Prisma.KidsExerciseOptionCreateManyInput[] = [];
    let order = 0;

    for (let s = 0; s < sentences.length; s++) {
      const sentence = sentences[s];
      const verseRef = `Verhaal ${seed.number}`;
      let generated;
      if (s % 3 === 2) {
        generated = generateTrueFalse(sentence, verseRef, s);
      } else if (s % 2 === 0) {
        generated = generateFillBlank(sentence, verseRef, s, distractorPool);
      } else {
        generated = generateWordBank(sentence, verseRef, s);
      }
      if (!generated) continue;

      const exerciseId = randomUUID();
      exerciseRows.push({
        id: exerciseId,
        storyId: story.id,
        order: order++,
        type: generated.type,
        prompt: generated.prompt,
        answers: JSON.stringify(generated.answers),
        wordBank: generated.wordBank ? JSON.stringify(generated.wordBank) : undefined,
      });
      generated.options?.forEach((label, idx) => {
        optionRows.push({
          id: randomUUID(),
          exerciseId,
          label,
          isCorrect: generated!.answers.includes(label.toLowerCase()),
          order: idx,
        });
      });
    }

    // IMAGE_CHOICE: welke afbeelding hoort bij dit verhaal? Correct antwoord
    // is een eigen afbeelding van dit verhaal; de 3 afleiders komen van
    // andere verhalen (deterministisch geshuffeld, dus stabiel bij herimport).
    if (seed.images.length > 0) {
      const correctImage = seed.images[0];
      const otherImages = allImages.filter((img) => !seed.images.includes(img));
      const distractors = shuffleWithSeed(otherImages, seed.number).slice(0, 3);
      const imageOptions = shuffleWithSeed([correctImage, ...distractors], seed.number + 11);

      const exerciseId = randomUUID();
      exerciseRows.push({
        id: exerciseId,
        storyId: story.id,
        order: order++,
        type: "IMAGE_CHOICE",
        prompt: `Welke afbeelding hoort bij het verhaal "${seed.title}"?`,
        answers: JSON.stringify([correctImage.toLowerCase()]),
      });
      imageOptions.forEach((url, idx) => {
        optionRows.push({
          id: randomUUID(),
          exerciseId,
          label: url,
          imageUrl: url,
          isCorrect: url === correctImage,
          order: idx,
        });
      });
    }

    if (exerciseRows.length > 0) {
      await prisma.kidsExercise.createMany({ data: exerciseRows });
    }
    if (optionRows.length > 0) {
      await prisma.kidsExerciseOption.createMany({ data: optionRows });
    }

    log(`  - Verhaal ${seed.number} (${seed.title}): ${order} oefeningen`);
  }
}
