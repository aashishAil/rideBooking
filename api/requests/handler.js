const httpCodes = require('http-codes');

const requests = require('../../schemas/requests');
const checker = require('../../common/checker');

const errorMessage = 'Some error occured';
const validationError = 'ValidationError';
const alreadyExists = 'Request Already exists';
const alreadyExistsMessage = 'Request for this customer already is already in progress';
const notFound = 'Not found';
const notFoundMessage = 'Request is not available';

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
        let request;
        checker.validate(variables)
            .then(checked => {
                if(checked.errors){
                    throw {
                        name : validationError,
                        message : checked.message
                    }
                }
                return requests.findOne({ customerId : variables.customerId , status : 'waiting'});
            })
            .then(foundRequest =>{
                if(foundRequest){
                    throw {
                        name : alreadyExists
                    }
                }
                request = new requests(variables);
                request.requestId = request.generateUuid();
                return request.save();
            })
            .then(() => {
                setTimeout(changeStatus,300000,request);
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
                else if(err.name === alreadyExists){
                    statusCode = httpCodes.ACCEPTED;
                    body = alreadyExistsMessage;
                    log = alreadyExists;
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

exports.updateRequest = (variables) => {
    return new Promise( (resolve,reject) => {
        checker.validate(variables)
            .then(checked => {
                if(checked.errors){
                    throw {
                        name : validationError,
                        message : checked.message
                    }
                }
                return requests.findOne({ requestId : variables.requestId , status : 'waiting'});
            })
            .then( request=> {
                if(!request){
                    throw {
                        name : notFound
                    }
                }
                request.status = 'ongoing';
                request['driverId'] = variables.driverId;
                return request.save();
            })
            .then( () => {
                return{
                    statusCode : httpCodes.OK,
                    body : {},
                    log : 'Updated request successfully'
                }
            })
            .catch(err => {
                let statusCode;
                let body;
                let log;
                if(err.name === validationError){
                    statusCode = httpCodes.BAD_REQUEST;
                    body = err.message;
                    log = 'Validation error';
                }
                else if(err.name === notFound){
                    statusCode = httpCodes.NOT_FOUND;
                    body = notFoundMessage;
                    log = notFound;
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

function changeStatus(request){
    request.status = 'complete'
    request.save()
        .then( () => {
            console.log('Request status marked as completed');
        })
};