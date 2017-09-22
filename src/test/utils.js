
// Assumes handler(inputData, callback) and callback(err, success)
// TODO Can't I do the same with Bluebird promosify?
module.exports.toPromise = (handler, inputData) =>
  new Promise( (resolve, reject) =>
    handler(inputData, (err, success) =>
      err ? reject(err) : resolve(success) )
  );
