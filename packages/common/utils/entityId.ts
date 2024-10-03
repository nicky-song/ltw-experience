// converts /api/learning_items/1 to 1
export const getIdFromUrl = (entityUrl: string) => {
  return entityUrl.split('/').pop() as string;
};
