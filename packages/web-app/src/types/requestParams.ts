export type CollectionParams = {
  page?: number;
  itemsPerPage?: number;
};

export type GetUsersParams = CollectionParams & {
  firstName?: string;
  lastName?: string;
  email?: string;
};
