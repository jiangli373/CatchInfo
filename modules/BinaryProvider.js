var Provider = require('./Provider').Provider;
var GridStore = require('mongodb').GridStore;
var util = require('util');

var BinaryProvider = function () {
};

util.inherits(BinaryProvider, Provider);//从一个构造函数中继承另一个的原生方法。

BinaryProvider.prototype.write = function (binaryData, fileType, fileID, callback) {           //构造一个函数
    var gridStore = new GridStore(this.db, fileID, 'w', {"content_type": fileType, "chunk_size": binaryData.length, "metadata": {"date": new Date()}});
    gridStore.open(function (err, gridStore) {
        gridStore.write(binaryData, function (err, result) {  //将文件写入数据库
            gridStore.close(function (err, result) {
                callback(err, result);
            });
        });
    });
};

BinaryProvider.prototype.unlink = function (fileID, callback) {
    var gridStore = new GridStore(this.db, fileID, 'r'); //只读
    gridStore.unlink(function (err, result) {
        callback(err, result);
    });
};

//BinaryProvider.prototype.read = function (fileID, callback) {
//    var gridStore = new GridStore(this.db, fileID, "r");
//    gridStore.open(function (err, gridStore) {
//        gridStore.read(function (err, binaryData) {
//            console.log("读取文件 fileID: ", fileID, gridStore.contentType);
//            callback(err, binaryData, gridStore.contentType);
//        });
//    });
//};
BinaryProvider.prototype.read = function (fileID, callback) {

    var gridStore = new GridStore(this.db, fileID);
    gridStore.open(function (err, gridStore) {
        if (err) {
            callback(err);
        } else {
            if (gridStore.length) {
                gridStore.read(function (err, binaryData) {
                    callback(err, binaryData, gridStore.contentType);
                });
            } else {
                callback('file not exist');
            }
        }
    });
};

BinaryProvider.prototype.writeFile = function (filePath, fileType, fileID, callback) {
    var gridStore = new GridStore(this.db, fileID, 'w', {"content_type": fileType, "metadata": {"date": new Date()}});
    gridStore.open(function (err, gridStore) {
        gridStore.writeFile(filePath, function (err, result) {
            gridStore.close(function (err, result) {
                callback(err, result);
            });
        });
    });
};

BinaryProvider.prototype.stream = function (fileID, callback) {
    var gridStore = new GridStore(this.db, fileID);
    gridStore.open(function (err, gridStore) {
        callback(gridStore.stream(true));
    });
};

BinaryProvider.prototype.list = function (callback) {
    GridStore.list(this.db,{id:true}, function(err, items) {
        callback(err, items);
    });
};

BinaryProvider.prototype.exist = function (fileID, callback) {
    GridStore.exist(this.db, fileID, function(err, result) {
        callback(err, result);
    });
};


exports.BinaryProvider = BinaryProvider;