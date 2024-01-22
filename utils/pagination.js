export const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, posts, totalPages, currentPage };
};
