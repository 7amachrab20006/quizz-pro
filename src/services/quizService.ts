import { prisma } from '../lib/db';

export async function submitQuizResults(userId: string, levelId: string, answers: { questionId: string, answer: string }[]) {
  // 1. Fetch the level and its quizzes to validate
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: { quizzes: true, category: true }
  });

  if (!level) throw new Error('Level not found');

  // 2. Calculate score on server
  let correctCount = 0;
  const totalQuestions = level.quizzes.length;
  
  if (totalQuestions === 0) throw new Error('No questions found for this level');

  answers.forEach(ans => {
    const quiz = level.quizzes.find(q => q.id === ans.questionId);
    if (quiz && quiz.correctAnswer === ans.answer) {
      correctCount++;
    }
  });

  const scorePercentage = (correctCount / totalQuestions) * 100;
  const isCompleted = scorePercentage >= 70; // Requirement: Unlock if >= 70%

  // 3. Update User Progress
  const progress = await prisma.progress.upsert({
    where: {
      userId_levelId: { userId, levelId }
    },
    update: {
      score: correctCount,
      total: totalQuestions,
      completed: isCompleted
    },
    create: {
      userId,
      levelId,
      score: correctCount,
      total: totalQuestions,
      completed: isCompleted
    }
  });

  // 4. Award XP if first time completing or improved score
  const xpReward = isCompleted ? 50 : 10;
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: { increment: xpReward }
    }
  });

  // 5. Unlock next level if criteria met
  if (isCompleted) {
    const nextLevelNumber = level.levelNumber + 1;
    const nextLevel = await prisma.level.findFirst({
      where: {
        categoryId: level.categoryId,
        levelNumber: nextLevelNumber
      }
    });

    if (nextLevel) {
      await prisma.level.update({
        where: { id: nextLevel.id },
        data: { isLocked: false }
      });
    }
  }

  return {
    score: correctCount,
    total: totalQuestions,
    percentage: scorePercentage,
    completed: isCompleted,
    xpAwarded: xpReward
  };
}

export async function getUserProgress(userId: string) {
  return prisma.progress.findMany({
    where: { userId },
    include: {
      level: {
        include: { category: true }
      }
    }
  });
}

export async function getLeaderboard() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      xp: true,
      level: true
    },
    orderBy: {
      xp: 'desc'
    },
    limit: 10
  });
}
