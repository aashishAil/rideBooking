const httpCodes = require('http-codes');

const requests = require('../../schemas/requests');
const checker = require('../../common/checker');

const errorMessage = 'Some error occured';
const validationError = 'ValidationError';
const alreadyExists = 'Request Already exists';
const alreadyExistsMessage = 'Request for this customer already is already in progress';
const driverExistsMessage = 'Already one request in progress for this driver';
const notFound = 'Not found';
const notFoundMessage = 'Request is not available';

exports.getAllRequests = () => {
  return new Promise( (resolve,reject) => {
        requests.find({}, { '_id' : 0 ,'__v' : 0})
            .then( data => {
                data = data.map( (singleData) => {
                    let newData = {};
                    newData["status"] = singleData.status;
                    newData["driverId"] = singleData.driverId;
                    newData["customerId"] = singleData.customerId;
                    newData["requestId"] = singleData.requestId;
                    if(singleData.completedTime)
                        newData['elapsedTime'] = singleData.elapsedCompletedTime(true);
                    else if(singleData.ongoingTime)
                        newData['elapsedTime'] = singleData.elapsedOngoingTime(true);
                    else
                        newData['elapsedTime'] = singleData.elapsedCreatedTime(true);
                   return newData;
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

exports.getDriverRequests = (variables) => {
    return new Promise( (resolve,reject) => {
        let returnData = {};
        checker.validate(variables)
            .then(checked => {
                if(checked.errors){
                    throw {
                        name : validationError,
                        message : checked.message
                    }
                }
                return requests.find({status : 'waiting'}, { '_id' : 0 ,'__v' : 0});
            })
            .then( waitingRequests => {
                waitingRequests = waitingRequests.map( (singleData) => {
                    let newData = {};
                    newData["status"] = singleData.status;
                    newData["createdTime"] = singleData.createdTime;
                    newData["customerId"] = singleData.customerId;
                    newData["requestId"] = singleData.requestId;
                    let tmp = singleData.elapsedCreatedTime(false);
                    newData['requestTime'] = tmp == "" ? "0 minutes " : tmp;
                    return newData;
                });
                returnData['waiting'] = waitingRequests;
                return requests.find({status : 'ongoing' , driverId : variables.driverId}
                                      , { '_id' : 0 ,'__v' : 0});
            })
            .then( ongoingRequests => {
                ongoingRequests = ongoingRequests.map( (singleData) => {
                    let newData = {};
                    newData["status"] = singleData.status;
                    newData["createdTime"] = singleData.createdTime;
                    newData["customerId"] = singleData.customerId;
                    newData["requestId"] = singleData.requestId;
                    let tmp = singleData.elapsedCreatedTime(false);
                    newData['requestTime'] = tmp == "" ? "0 minutes " : tmp;
                    if(singleData.ongoingTime){
                        tmp = singleData.elapsedOngoingTime(false);
                        newData['pickedUpTime'] = tmp == "" ? "0 minutes " : tmp;
                    }
                    return newData;
                });
                returnData['ongoing'] = ongoingRequests;
                return requests.find({status : 'complete' , driverId : variables.driverId }
                                        , { '_id' : 0 ,'__v' : 0});
            })
            .then( completedRequests => {
                completedRequests = completedRequests.map( (singleData) => {
                    let newData = {};
                    newData["status"] = singleData.status;
                    newData["createdTime"] = singleData.createdTime;
                    newData["customerId"] = singleData.customerId;
                    newData["requestId"] = singleData.requestId;
                    let tmp = singleData.elapsedCreatedTime(false);
                    newData['requestTime'] = tmp == "" ? "0 minutes " : tmp;
                    if(singleData.completedTime){
                        tmp = singleData.elapsedCompletedTime(false)
                        newData['completedTime'] = tmp == "" ? "0 minutes " : tmp;
                    }
                    if(singleData.ongoingTime){
                        tmp = singleData.elapsedOngoingTime(false);
                        newData['pickedUpTime'] = tmp == "" ? "0 minutes " : tmp;
                    }
                    return newData;
                });
                returnData['completed'] = completedRequests;
                return {
                    statusCode : httpCodes.OK,
                    body : returnData,
                    log : 'Returned complete data for driver'
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
                return requests.findOne({ customerId : variables.customerId , status : 'waiting'});
            })
            .then(foundRequest =>{
                if(foundRequest){
                    throw {
                        name : alreadyExists
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
        let finalRequest;
        checker.validate(variables)
            .then(checked => {
                if(checked.errors){
                    throw {
                        name : validationError,
                        message : checked.message
                    }
                }
                return requests.findOne({ driverId : variables.driverId , status : 'ongoing'});
            })
            .then( request => {
                if(request){
                    throw {
                        name : alreadyExists
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
                request['ongoingTime'] = new Date();
                finalRequest = request;
                return request.save();
            })
            .then( () => {
                setTimeout(changeStatus,300000,finalRequest);
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
                else if(err.name === alreadyExists){
                    statusCode = httpCodes.ACCEPTED;
                    body = driverExistsMessage;
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

function changeStatus(request){
    request.status = 'complete';
    request['completedTime'] = new Date();
    request.save()
        .then( () => {
            console.log('Request status marked as completed');
        })
};