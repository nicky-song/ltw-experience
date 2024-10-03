export const getStatus = (progress: number | undefined) => {
  if (!progress) {
    return 'Not Started';
  }
  const maxProgress = 100;
  if (progress <= 0) {
    return 'Not Started';
  } else if (progress < maxProgress) {
    return 'In Progress';
  } else if (progress >= maxProgress) {
    return 'Completed';
  }
};
