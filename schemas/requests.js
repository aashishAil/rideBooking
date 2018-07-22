const mongoose = require('mongoose');
const schema = mongoose.Schema;

const requestSchema = new schema({
    requestId : {type : String , required : true},
    customerId : {type : String , required : true},
    status : { type : String , enum : ['waiting','ongoing','complete'] , default : 'waiting'},
    createdTime : { type : Date , dafault : new Date()},
    pickedUpTime : { type : Date },
    driverId : { type : String }
});

module.exports = mongoose.model('Requests' , requestSchema);