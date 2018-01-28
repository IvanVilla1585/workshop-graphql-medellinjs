const resolver = {
  Query: {
    async comments(root, args, {commentStorage}) {
      let results = [];
      try {
        results = await commentStorage.find();
      } catch (err) {
        throw new Error('Error: find all comment');
      }
      return results;
    }
  },
  Comment: {
    async post({postId}, args, {postStorage}) {
      let result = {};
      if (!postId) return {};
      try {
        result = await postStorage.findById(postId);
      } catch (err) {
        throw new Error('Error: find post');
      }
      return result;
    }
  },
  Subscription: {
    async commentAdd(root, args, {commentStorage}) {
      let result = {};
      try {
        result = await commentStorage.save({...args.data});
      } catch (err) {
        throw new Error('Error: save comment');
      }
      return result;
    }
  }
};

module.exports = resolver;