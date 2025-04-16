export interface FindManyOptions {
  page?: number;

  limit?: number;
}

export const convertOptions = (options?: FindManyOptions) => {
  let skip;
  let take;

  if (options && options.page) {
    skip = ((options.page || 1) - 1) * (options.limit || 1);
  }

  if (options && options.limit) {
    take = options.limit;
  }

  return { skip, take };
};
