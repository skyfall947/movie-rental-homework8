export const uploadPosterDto = {
  type: 'object',
  properties: {
    poster: {
      type: 'string',
      format: 'binary',
    },
  },
};
