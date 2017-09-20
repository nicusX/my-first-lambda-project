/*
  Client class for DynamoDB table
*/
'use strict';

class DbClient {
  constructor(dynamoDocClient, table) {
    this.db = dynamoDocClient;
    this.table = table;
  }

  // Put an item in a table
  // Returns a Promise with the inserted item
  put(item) {
    const dbItem = {
      TableName: this.table,
      Item: item,
    };

    return this.db.put(dbItem).promise()
      .then( () => item );
  }

  // List all item in a table, with optional projection
  // Returns a Promise with items
  list(projection = null) {
    const params = {
        TableName: this.table,
        ProjectionExpression: projection,
    };

    return this.db.scan(params).promise()
      .then(data => data.Items );
  }

  // Get a single Item from a table, by Id
  // Returns a Promise with the Item
  get(idKey, idValue) {
    const params = {
      TableName: this.table,
      Key: {
        [idKey]: idValue,
      },
    };

    return this.db.get(params).promise()
      .then(data => data.Item );
  }
}


module.exports = DbClient;
