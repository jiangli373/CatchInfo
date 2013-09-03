/**
 * Created with JetBrains WebStorm.
 * User: yoyo
 * Date: 13-7-23
 * Time: 上午9:39
 * To change this template use File | Settings | File Templates.
 */
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var PointProvider = function() {
//this.collectionName = 'meishi';
//    this.collectionName = 'xiuxian';
//    this.collectionName = 'gouwu';
//    this.collectionName = 'marry';
//    this.collectionName = 'qinzi';
//    this.collectionName = 'sports';
//        this.collectionName = 'hotel';
        this.collectionName = 'life';
};

util.inherits(PointProvider, DataProvider);

exports.PointProvider = PointProvider;