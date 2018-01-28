const resolver = {
  Query: {
    async posts(root, args, {postStorage}) {
      let results = [];
      try {
        results = await postStorage.find();
      } catch (err) {
        throw new Error('Error: find all posts');
      }
      return results;
    },
    async search(root, args, {postStorage, commentStorage}) {
      let results = [];
      try {
        const resultsPost = await postStorage.find({body: {$regex: new RegExp(args.search, 'i')}});
        const resultsComments = await commentStorage.find({body: {$regex: new RegExp(args.search, 'i')}});
        results = [...resultsPost, ...resultsComments]
      } catch (err) {
        throw new Error('Error: search comments and posts');
      }
      return results;
    },
    async postById(root, args, {postStorage}) {
      let result = {};
      try {
        result = await postStorage.findById(args.id);
      } catch (err) {
        throw new Error('Error: find post by id');
      }
      return result;
    }
  },
  // Post: {
  //   async comments({id}, args, {commentStorage}) {
  //     let result = [];
  //     try {
  //       result = await commentStorage.find({postId: id});
  //     } catch (err) {
  //       throw new Error('Error: find comments');
  //     }
  //     return result;
  //   }
  // },
  Mutation: {
    postAdd(root, args, {postStorage}) {
      let result = {};
      try {
        result = postStorage.save({...args.data});
      } catch (err) {
        throw new Error('Error: save post');
      }
      return result;
    },
    async postEdit(root, args, {postStorage}) {
      let result = {};
      try {
        result = await postStorage.update(args.id, {...args.data});
      } catch (err) {
        throw new Error('Error: update post');
      }
      return result;
    },
    async postDelete(root, args, {postStorage}) {
      let result = {};
      try {
        result = await postStorage.delete(args.id);
      } catch (err) {
        throw new Error('Error: delete post');
      }
      return result;
    }
  }
};

module.exports = resolver;