/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-8-29
 * Time: 下午10:40
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var http = require('http');
var iconv = require('iconv-lite');
var $ = require('jquery');
var InfoProvider = require("../modules/InfoProvider").InfoProvider;
var infoProvider = new InfoProvider();
var ObjectID = require('mongodb').ObjectID;
//http://www.dianping.com/shop/3083767
var globalHost =  'www.dianping.com';
//var listpath = '/search/keyword/2/10_%E5%8F%8C%E4%BA%95';
var listpath =  '/search/category/2/30/r2579';
var detailPath = 'shop/'; //shop/+id

 //43

getData(1,function(){

})

function getData(no,callback){
    var options = {
        host:globalHost,
        port:80,
        path:listpath+'p'+no,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
        }
    };
    var html = "";
    http.get(options,function (res) {
        res.on('data', function (data) {
            html += data;
        });
        res.on('end', function () {
            console.log('--------->',html);
            var dom = $(html);//生成文档树
            var $fir = dom.find('#searchList > dl');
            var $sec = $fir.find('dd');
            var count = $sec.size();
        });
    }).on('error', function (e) {
           console.log(e);
        });
}

