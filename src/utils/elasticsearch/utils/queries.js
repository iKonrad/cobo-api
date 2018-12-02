export const searchPopularPosts = communityIds => ({

  query: {
    function_score: {
      query: {
        constant_score: {
          filter: {
            terms: {
              communityId: communityIds,
            },
          },
        },
      },
      score_mode: 'sum',
      functions: [
        {
          field_value_factor: {
            field: 'totalVotes',
          },
          weight: 0.1,
        },
        {
          field_value_factor: {
            field: 'score',
          },
          weight: 0.05,
        },
        {
          field_value_factor: {
            field: 'totalComments',
          },
          weight: 0.5,
        },
        {
          filter: { match: { hot: true } },
          weight: 15,
        },
        {
          linear: {
            createdAt: {
              scale: '14d',

              decay: 0.05,
            },
          },
          weight: 420,
        },
      ],
    },
  },
});
