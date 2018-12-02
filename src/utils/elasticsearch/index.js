import elasticsearch from 'elasticsearch';
import settings from 'settings';
import indices from './utils/indices';
import {
  searchPopularPosts,
} from './utils/queries';

class ElasticClient {
  constructor() {
    this.client = new elasticsearch.Client({
      host: settings.ELASTICSEARCH_URL,
      log: false,
    });
  }

  async popularPosts(communityIds) {
    const data = await this.client.search({
      index: indices.POST,
      type: '_doc',
      body: searchPopularPosts(communityIds),
    });

    if (data && data.hits && data.hits.total > 0) {
      return data.hits.hits;
    }

    return [];
  }

  getURLMetadata = async url => {
    try {
      const data = await this.client.search({
        index: indices.LINK,
        type: '_doc',
        body: {
          query: {
            match: { _id: url },
          },
        },
      });

      if (data && data.hits && data.hits.total > 0) {
        return data.hits.hits[0]._source;
      }
    } catch (e) {
      return null;
    }
  };

  saveURLMetadata = async (url, body) => this.client.update({
    index: indices.LINK,
    type: '_doc',
    id: url,
    body: {
      doc: {
        ...body,
      },
      upsert: {
        ...body,
      },
    },
  })


  async votePost(postId, totalVotes, score) {
    await this.client.update({
      index: indices.POST,
      type: '_doc',
      id: postId,
      body: {
        doc: {
          totalVotes,
          score,
        },
      },
    });
  }

  async incrementPostCommentsCount(postId) {
    await this.client.update({
      index: indices.POST,
      type: '_doc',
      id: postId,
      body: {
        script: 'ctx._source.totalComments += 1',
      },
    });
  }

  async saveCommunity(id, community) {
    await this.client.create({
      index: indices.COMMUNITY,
      type: '_doc',
      id,
      body: {
        ...community,
        public: !!community.public,
        adultOnly: !!community.adultOnly,
      },
    });
  }

  async savePost(id, post) {
    await this.client.create({
      index: indices.POST,
      type: '_doc',
      id,
      body: {
        ...post,
        totalComments: 0,
      },
    });
  }
}

const client = new ElasticClient();

export default client;
