'use strict'

require('./model');

class PostStorage {
  constructor(conn = null) {
    if (!conn) throw new Error('connection not provider');

    this.Model = conn.model('Post');
  }

  async save(data) {
    let result = {};
    try {
      result = await new this.Model(data).save();
    } catch (err) {
      console.log('err', err)
      throw new Error(err.messages);
    }
    return result;
  }

  async update(id, data) {
    let result = {};
    try {
      result = await this.Model.findByIdAndUpdate(id, {$set: data}, {new: true});
      if (!result) {
        result = {failed: true, message: 'Post not found'}
      }
    } catch (err) {
      throw new Error(err.messages);
    }
    return result;
  }

  async delete(id) {
    let result = {};
    try {
      result = await this.Model.findByIdAndRemove(id);
      if (!result) {
        result = {failed: true, message: 'Post not found'}
      }
    } catch (err) {
      throw new Error(err.messages);
    }
    return result;
  }

  async find(query = {}) {
    let results = [];
    try {
      results = await this.Model.find(query);
    } catch (err) {
      throw new Error(err.messages);
    }
    return results;
  }

  async findById(id) {
    let result = {};
    try {
      result = await this.Model.findById(id);
      if (!result) {
        result = {failed: true, message: 'Post not found'}
      }
    } catch (err) {
      throw new Error(err.messages);
    }
    return result;
  }
}

module.exports = PostStorage;