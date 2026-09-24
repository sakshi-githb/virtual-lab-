const API_URL = import.meta.env.VITE_API_URL || '';

export const getExperiments = async () => {
  // In a real app, this would fetch from API
  return [];
};

export const getExperiment = async (slug) => {
  return null;
};

export const getVivaQuestions = async (experimentId) => {
  return [];
};

export const submitViva = async (experimentId, answers) => {
  return { score: 0 };
};

export const saveObservation = async (experimentId, data) => {
  return { success: true };
};

export const createAttempt = async (experimentId) => {
  return { id: 1 };
};

export const getProgress = async () => {
  return { completed: 0, inProgress: 0 };
};
