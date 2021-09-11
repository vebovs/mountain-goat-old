require('dotenv').config();
const mongodb = require('mongodb');
const assert = require('assert');

module.exports = class Dao {
  constructor(collection) {
    mongodb.MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (error, client) => {
      assert.equal(null, error);
      this.db = client.db(process.env.DATABASE);
      this.collection = this.db.collection(collection);
    });
  }
}