const handler = require('./handler');
const responseHandler = require('../../common/responseHandler');

exports.getAllRequests = (req,res) => {
    handler.getAllRequests()
        .then( body => {
            responseHandler.returnResponse(res,body);
        });
};

exports.getDriverRequests = (req,res) => {
    let variables = {};
    handler.getDriverRequests(variables)
        .then( body => {
            responseHandler.returnResponse(res,body);
        });
};

exports.createRequest = (req,res) => {
    let variables = {
        customerId : req.body.customerId
    };
    handler.createRequest(variables)
        .then( body => {
            responseHandler.returnResponse(res,body);
        });
};

exports.updateRequest = (req,res) => {
    let variables = {};
    handler.updateRequest(variables)
        .then( body => {
            responseHandler.returnResponse(res,body);
        });
};