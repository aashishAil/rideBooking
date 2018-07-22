const httpCodes = require('http-codes');

const requests = require('../../schemas/requests');
const checker = require('../../common/checker');

const errorMessage = 'Some error occured';
const validationError = 'ValidationError';

exports.getAllRequests = () => {
  return new Promise( (resolve,reject) => {
        requests.find({}, { '_id' : 0 ,'__v' : 0})
            .then( data => {
                data = data.map( (singleData) => {
                   singleData['elapsedTime'] = singleData.elapsedTime();
                   return singleData;
                });
                return{
                    statusCode : httpCodes.OK,
                    body : data,
                    log : 'Returned list of all requests'
                }
            })
            .catch( err => {
                return {
                    statusCode : httpCodes.INTERNAL_SERVER_ERROR,
                    body : errorMessage,
                    log : err
                }
            }).then( sendBack => {
                resolve(sendBack);
            });
  });
};

exports.getDriverRequests = () => {
    return new Promise( (resolve,reject) => {
        
    });
};

exports.createRequest = (variables) => {
    return new Promise( (resolve,reject) => {
        checker.validate(variables)
            .then(checked => {
                if(checked.errors){
                    throw {
                        name : validationError,
                        message : checked.message
                    }
                }
                let request = new requests(variables);
                request.requestId = request.generateUuid();
                return request.save();
            })
            .then(() => {
                return{
                    statusCode : httpCodes.CREATED,
                    body : {},
                    log : 'Created new request'
                }
            })
            .catch( err => {
                let statusCode;
                let body;
                let log;
                if(err.name === validationError){
                    statusCode = httpCodes.BAD_REQUEST;
                    body = err.message;
                    log = 'Validation error';
                }
                else{
                    statusCode = httpCodes.INTERNAL_SERVER_ERROR;
                    body = errorMessage;
                    log = err;
                }
                return {
                    statusCode : statusCode,
                    body : body,
                    log : log
                }
            })
            .then( sendBack => {
                resolve(sendBack);
            });
    });
};

exports.updateRequest = () => {
    return new Promise( (resolve,reject) => {

    });
};