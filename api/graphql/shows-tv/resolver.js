'use strict'

const resolver = {
  Query: {
    shows(root, args, {showConnector}) {
      let results = [];

      try {
        results = showConnector.getShows();
      } catch (err) {
        throw new Error('Error: find all shows')
      }

      return results;
    },
    showById(root, args, {showConnector}) {
      let results = {};

      try {
        results = showConnector.getShowById(args.id);
      } catch (err) {
        throw new Error('Error: find show by id')
      }

      return results;
    }
  },
  Show: {
    akas({id}, args, {showConnector}) {
      let results = [];
      try {
        results = showConnector.getShowsAkas(id);
      } catch (err) {
        throw new Error('Error: find all akas')
      }

      return results;
    }
  }
};


module.exports = resolver;