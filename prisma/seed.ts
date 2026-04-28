import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    id: 'geography',
    name: 'Geography',
    order: 1,
    levels: [
      {
        levelNumber: 1,
        quizzes: [
          { question: 'What is the largest continent by area?', choices: JSON.stringify(['Africa', 'Europe', 'Asia', 'North America']), correctAnswer: 'Asia' },
          { question: 'Which country has the largest population?', choices: JSON.stringify(['India', 'China', 'USA', 'Indonesia']), correctAnswer: 'China' },
        ],
      },
    ],
  },
  {
    id: 'history',
    name: 'History',
    order: 2,
    levels: [
      {
        levelNumber: 1,
        quizzes: [
          { question: 'Who was the first President of the USA?', choices: JSON.stringify(['George Washington', 'Abraham Lincoln', 'John F. Kennedy', 'Barack Obama']), correctAnswer: 'George Washington' },
        ],
      },
    ],
  },
];

async function main() {
  console.log('Start seeding...');

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, order: cat.order },
      create: { id: cat.id, name: cat.name, order: cat.order },
    });

    for (const lvl of cat.levels) {
      const level = await prisma.level.upsert({
        where: { categoryId_levelNumber: { categoryId: category.id, levelNumber: lvl.levelNumber } },
        update: { isLocked: lvl.levelNumber === 1 ? false : true },
        create: {
          categoryId: category.id,
          levelNumber: lvl.levelNumber,
          isLocked: lvl.levelNumber === 1 ? false : true,
        },
      });

      for (const q of lvl.quizzes) {
        await prisma.quiz.create({
          data: {
            levelId: level.id,
            question: q.question,
            choices: q.choices,
            correctAnswer: q.correctAnswer,
          },
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
