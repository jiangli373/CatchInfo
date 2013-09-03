/**
 * Created with JetBrains WebStorm.
 * User: yoyo
 * Date: 13-8-13
 * Time: 下午1:14
 * To change this template use File | Settings | File Templates.
 */
var SJDataProvider = require('./SJDataProvider.js').SJDataProvider,
    util = require('util');
var NewsProvider = function() {
    this.collectionName = 'news';
};
util.inherits(NewsProvider, SJDataProvider);
exports.NewsProvider =NewsProvider;