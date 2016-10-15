/**
 * Created by bowenjiang on 2016-10-15.
 */
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema;

var Account= new Schema({
    username:String,
    password:String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);