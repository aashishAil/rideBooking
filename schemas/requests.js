const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uuid = require('uuid');

const requestSchema = new schema({
    requestId : {type : String , required : true},
    customerId : {type : String , required : true},
    status : { type : String , enum : ['waiting','ongoing','complete'] , default : 'waiting'},
    createdTime : { type : Date , default : new Date()},
    driverId : { type : String }
});


requestSchema.methods.elapsedTime = function(){
    let difference = Math.abs((new Date() - this.createdTime)/1000);
    var minutes = Math.floor(difference / 60) % 60;
    difference -= (minutes * 60);
    var seconds = difference % 60;
    let elapsed  = '';

    if( minutes >  5){
        elapsed += "5 minutes ";
    }else{
        if(minutes !== 0){
            elapsed += minutes + " minutes ";
        }
        elapsed += seconds + "seconds";
    }
    return (elapsed)
};

requestSchema.methods.generateUuid = function(){
    return uuid();
};

module.exports = mongoose.model('Requests' , requestSchema);