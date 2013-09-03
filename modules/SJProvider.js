require('./SJConfig');
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var SJProvider = function () {
};

SJProvider.prototype.db = new Db(global.mongodbDB, new Server(global.mongodbHost, global.mongodbPort, {auto_reconnect: true, poolSize: 5}),{safe:false},{w: 0, native_parser: false});

//(function () {
//    SJProvider.prototype.db.open(function(err, db) {
//        if (err) {
//            throw err;
//        }
//        console.log('ddddddddddddddddddddddd');
//        SJProvider.prototype.db = db;
//    });
//})();
exports.SJProvider = SJProvider;