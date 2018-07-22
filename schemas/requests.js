const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uuid = require('uuid');

const requestSchema = new schema({
    requestId : {type : String , required : true},
    customerId : {type : String , required : true},
    status : { type : String , enum : ['waiting','ongoing','complete'] , default : 'waiting'},
    createdTime : { type : Date , default : new Date()},
    ongoingTime : { type : Date },
    completedTime : { type : Date },
    driverId : { type : String }
});


requestSchema.methods.elapsedCreatedTime = function(enabled){
    let difference = Math.abs((new Date() - this.createdTime)/1000);
    return getMinutesAndSeconds(difference,enabled);
};

requestSchema.methods.elapsedOngoingTime = function(enabled){
    let difference = Math.abs((new Date() - this.ongoingTime)/1000);
    return getMinutesAndSeconds(difference,enabled);
};

requestSchema.methods.elapsedCompletedTime = function(enabled){
    let difference = Math.abs((new Date() - this.completedTime)/1000);
    return getMinutesAndSeconds(difference,enabled);
};

function getMinutesAndSeconds(difference,enabled) {
    let minutes = Math.floor(difference / 60) % 60;
    difference -= (minutes * 60);
    let seconds = Math.floor(difference % 60);
    let elapsed  = '';
    if(minutes !== 0){
        elapsed += minutes + " minutes ";
    }
    if(enabled)
        elapsed += seconds + "seconds ";
    return elapsed;
};

requestSchema.methods.generateUuid = function(){
    return uuid();
};

module.exports = mongoose.model('Requests' , requestSchema);