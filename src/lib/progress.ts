import { CATEGORIES } from './data';

export interface LevelProgress {
  completed: boolean;
  score: number;
}

export interface DomainProgress {
  levels: { [levelId: string]: LevelProgress };
}

export interface UserProgress {
  domains: { [domainId: string]: DomainProgress };
}

const STORAGE_KEY = 'quizmaster_progress_v1';

export const getProgress = (): UserProgress => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress', e);
    }
  }
  return { domains: {} };
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const completeLevel = (domainId: string, levelId: string, score: number) => {
  const progress = getProgress();
  if (!progress.domains[domainId]) {
    progress.domains[domainId] = { levels: {} };
  }
  
  progress.domains[domainId].levels[levelId] = {
    completed: true,
    score: score
  };
  
  saveProgress(progress);
};

export const isLevelCompleted = (domainId: string, levelId: string): boolean => {
  const progress = getProgress();
  return progress.domains[domainId]?.levels[levelId]?.completed || false;
};

export const isLevelUnlocked = (domainId: string, levelId: string): boolean => {
  const domain = CATEGORIES.find(d => d.id === domainId);
  if (!domain) return false;
  
  const levelIdx = domain.levels.findIndex(l => l.id === levelId);
  if (levelIdx === -1) return false;
  if (levelIdx === 0) return true; // Level 1 is always unlocked for an unlocked domain
  
  // Previous level must be completed
  const prevLevel = domain.levels[levelIdx - 1];
  return isLevelCompleted(domainId, prevLevel.id);
};

export const isDomainUnlocked = (domainId: string): boolean => {
  const domainIdx = CATEGORIES.findIndex(d => d.id === domainId);
  if (domainIdx === -1) return false;
  if (domainIdx === 0) return true; // First domain always unlocked
  
  // Previous domain must be fully completed
  const prevDomain = CATEGORIES[domainIdx - 1];
  return prevDomain.levels.every(l => isLevelCompleted(prevDomain.id, l.id));
};

export const getCompletedLevelsCount = (domainId: string): number => {
  const domain = CATEGORIES.find(d => d.id === domainId);
  if (!domain) return 0;
  return domain.levels.filter(l => isLevelCompleted(domainId, l.id)).length;
};
