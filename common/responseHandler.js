exports.returnResponse = ( res, body) => {
  console.log(body.log);
  res.status(body.statusCode);
  res.send(body.body);
};