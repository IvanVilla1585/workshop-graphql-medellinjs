'use strict'

const fetch = require('node-fetch');


class ShowConnector {
  constructor(url = '') {
    if (!url) throw new Error()('The url is not provider');
    this.API_ROOT = url;
  }

  async fetch(url) {
    const URL = `${this.API_ROOT}${url}`;
    const res = await fetch(URL).then(r => r.json());

    if (res.errors) throw Error(res.message);
    return res;
  }

  getShows() {
    return this.fetch('/shows?page=1');
  }

  getShowById(id) {
    return this.fetch(`/shows/${id}`);
  }

  getShowsAkas(id) {
    return this.fetch(`/shows/${id}/akas`);
  }
}

module.exports = ShowConnector;