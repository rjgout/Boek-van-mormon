import { PrismaClient } from "@prisma/client";
import type { PodcastEpisodeSeed, PodcastComprehensionExercise } from "./podcastContent";

function toAnswersAndOptions(comp: PodcastComprehensionExercise): {
  type: "MULTIPLE_CHOICE" | "SEQUENCE" | "TRUE_FALSE";
  prompt: string;
  answers: string[];
  wordBank?: string[];
  options?: { label: string; isCorrect: boolean }[];
} {
  if (comp.type === "MULTIPLE_CHOICE") {
    return {
      type: "MULTIPLE_CHOICE",
      prompt: comp.prompt,
      answers: [comp.options[comp.correctIndex].toLowerCase()],
      options: comp.options.map((label, i) => ({ label, isCorrect: i === comp.correctIndex })),
    };
  }
  if (comp.type === "SEQUENCE") {
    return {
      type: "SEQUENCE",
      prompt: comp.prompt,
      answers: comp.items.map((item) => item.toLowerCase()),
      wordBank: [...comp.items].reverse(),
    };
  }
  return {
    type: "TRUE_FALSE",
    prompt: comp.prompt,
    answers: [comp.answer ? "true" : "false"],
  };
}

/** Idempotent: herdraaien overschrijft de oefeningen van dezelfde aflevering. */
export async function importPodcastEpisodes(
  prisma: PrismaClient,
  episodes: PodcastEpisodeSeed[],
  log: (msg: string) => void = console.log
) {
  for (let i = 0; i < episodes.length; i++) {
    const seed = episodes[i];
    // order = -number, zodat de nieuwste (hoogst genummerde) aflevering
    // altijd bovenaan staat — ongeacht in welke volgorde ze hier of via de
    // feed-sync (zie src/lib/podcastFeed.ts) binnenkomen.
    const episode = await prisma.podcastEpisode.upsert({
      where: { number: seed.number },
      update: { title: seed.title, summary: seed.summary, listenUrl: seed.listenUrl, order: -seed.number },
      create: {
        number: seed.number,
        title: seed.title,
        summary: seed.summary,
        listenUrl: seed.listenUrl,
        order: -seed.number,
      },
    });

    await prisma.podcastExercise.deleteMany({ where: { episodeId: episode.id } });

    let order = 0;
    for (const comp of seed.content) {
      const data = toAnswersAndOptions(comp);
      await prisma.podcastExercise.create({
        data: {
          episodeId: episode.id,
          mode: "CONTENT",
          order: order++,
          type: data.type,
          prompt: data.prompt,
          answers: JSON.stringify(data.answers),
          wordBank: data.wordBank ? JSON.stringify(data.wordBank) : undefined,
          options: data.options ? { create: data.options.map((o, idx) => ({ ...o, order: idx })) } : undefined,
        },
      });
    }

    order = 0;
    for (const comp of seed.bomConnection) {
      const data = toAnswersAndOptions(comp);
      await prisma.podcastExercise.create({
        data: {
          episodeId: episode.id,
          mode: "BOM_CONNECTION",
          order: order++,
          type: data.type,
          prompt: data.prompt,
          answers: JSON.stringify(data.answers),
          wordBank: data.wordBank ? JSON.stringify(data.wordBank) : undefined,
          options: data.options ? { create: data.options.map((o, idx) => ({ ...o, order: idx })) } : undefined,
        },
      });
    }

    log(`  - Aflevering ${seed.number}: ${seed.content.length} + ${seed.bomConnection.length} oefeningen`);
  }
}
