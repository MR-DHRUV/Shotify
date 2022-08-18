const mongoose = require('mongoose');


const RouteSchema = new mongoose.Schema({
    identifier : {
        type : String,
        required : true
    },
    urladdress : {
        type : String,
        required : true
    },

})


const RouteStore = mongoose.model('Routes',RouteSchema);
module.exports = RouteStore;