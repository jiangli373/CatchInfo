/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-9-1
 * Time: 上午11:54
 * To change this template use File | Settings | File Templates.
 */
//http://api.map.baidu.com/geocoder/v2/?ak=B8e760f97057e53492bb5bd7c783a131&output=json&address=%E8%B0%9C%E4%B9%8B%E7%89%A9%E8%AF%AD%E5%AF%86%E5%AE%A4%E9%80%83%E8%84%B1%E4%BF%B1%E4%B9%90%E9%83%A8&city=
//http://api.map.baidu.com/place/v2/search?ak=B8e760f97057e53492bb5bd7c783a131&output=json&tag=咖啡厅&query=阅&page_size=10&page_num=0&scope=2&region=北京
//q(query)	是	无	中关村、ATM、百度大厦	检索关键字
//tag	否	无	日式烧烤/铁板烧、朝外大街	标签项，与q组合进行检索
//output	否	xml	json或xml	输出格式为json或者xml
//scope	是	1	1、2
//filter=industry_type:life

var fs = require('fs');
var http = require('http');
var iconv = require('iconv-lite');
var $ = require('jquery');
var PointProvider = require("../modules/PointProvider").PointProvider;
var pointProvider = new PointProvider();
var ObjectID = require('mongodb').ObjectID;
var querystring = require('querystring');
//var BinaryProvider = require("../modules/BinaryProvider.js").BinaryProvider;
//var binaryProvider = new BinaryProvider();

var NewsProvider = require("../modules/NewsProvider.js").NewsProvider;
var newsProvider = new NewsProvider();
var SJBinaryProvider = require("../modules/SJBinaryProvider.js").SJBinaryProvider;
var sJBinaryProvider = new SJBinaryProvider();



pointProvider.find({},{},function(err,result){
    if(err) throw err;
    if(result){
        console.log('*************',result.length);
        startTask(0,result.length,result,function(){
            process.exit(0);
        });
    }
});

function startTask(current,count,data,callback){

    if(current>=count){
        callback();
    }else{
        doBaiduPoint(data,current,function(){
            startTask(current+1,count,data,callback);
        });
    }
}

function doBaiduPoint(data,current,callback){
    var curr = data[current];
    if(curr.title==''||(curr.category==''&&curr.subCategory=='')){
        callback();
    }else{
        var ccat = '';
        if(curr.subCategory==''){
            ccat = curr.category;
        } else{
            ccat = curr.subCategory;
        }
        var params = querystring.stringify({tag: '双井',query:curr.title});
        var path =  '/place/v2/search?ak=B8e760f97057e53492bb5bd7c783a131&output=json&page_size=1&page_num=0&scope=2&region=北京&'+params;
        var options = {
            host:'api.map.baidu.com',
            port:80,
            path:path,
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
                if(html!==undefined){
                var data = JSON.parse(html);
                if(data.status==0){
                   var results = data.results;
                    console.log('-------------->',results);

                    if(results.length>0&&results[0].location!==undefined){
                        var location = results[0].location;
                        var lat = location.lat;
                        var lng = location.lng;
                        var imgId = new ObjectID();

                        if(curr.imgPath !=' '||curr.imgPath !=''){
                            saveImage(curr.imgPath,imgId,function(sss){
//                                commentNum:0,gradeSum:0,isLike:[],searchNum:0,activityType:0,
                                if(sss){

                                    var json = {
                                        commentNum:0,
                                        gradeSum:0,
                                        isLike:[],
                                        searchNum:0,
                                        activityType:0 ,
                                        data:{
                                            'pic':[imgId+''],
                                            'address':curr.address,
                                            'time':curr.opentime,
                                            'phone':curr.tel[0],
                                            'decs':curr.introduce,
                                            'tags':curr.tags.toString(),
                                            'cusume':curr.fee
                                        },
                                        date:new Date(),
                                        location:{
                                            latitude:lat,
                                            longtitude:lng
                                        },
                                        "path" : "root,生活圈,生活服务,酒店",
                                        "queryNum" : 1,
                                        "title" : curr.title,
                                        "user" : {
                                            "id" : "5212242deac5f8125a000001",
                                            "name" : "witmob",
                                            "avatar" : null
                                        }
                                    };
                                    newsProvider.insert(json,{w:1},function(errs,rpo){
                                        if(errs) throw errs;
//                                    process.exit(0);
                                        callback();
                                    });
                                } else{
                                    callback();
                                }
                            });
                        }else{
                            callback();
                        }
                    }else{
                        var lat = 0;
                        var lng = 0;
                        var imgId = new ObjectID();
                        if(curr.imgPath !=' '||curr.imgPath !=''){
                            saveImage(curr.imgPath,imgId,function(sss){
//                                commentNum:0,gradeSum:0,isLike:[],searchNum:0,activityType:0,
                                if(sss){

                                    var json = {
                                        commentNum:0,
                                        gradeSum:0,
                                        isLike:[],
                                        searchNum:0,
                                        activityType:0 ,
                                        data:{
                                            'pic':[imgId+''],
                                            'address':curr.address,
                                            'time':curr.opentime,
                                            'phone':curr.tel[0],
                                            'decs':curr.introduce,
                                            'tags':curr.tags.toString(),
                                            'cusume':curr.fee
                                        },
                                        date:new Date(),
                                        location:{
                                            latitude:lat,
                                            longtitude:lng
                                        },
                                        "path" : "root,生活圈,生活服务,酒店",
                                        "queryNum" : 1,
                                        "title" : curr.title,
                                        "user" : {
                                            "id" : "5212242deac5f8125a000001",
                                            "name" : "witmob",
                                            "avatar" : null
                                        }
                                    };
                                    newsProvider.insert(json,{w:1},function(errs,rpo){
                                        if(errs) throw errs;
//                                    process.exit(0);
                                        callback();
                                    });
                                }else{
                                    callback();
                                }
                            });
                        }else{
                            callback();
                        }
                    }
                }else{
                    callback();
                }
                }else{
                    callback();
                }
            });
        });
    }
}

function saveImage(url,imageID,callback) {
    if(url.replace(/(^\s*)|(\s*$)/g, "").length ==0||url.replace(/(^\s*)|(\s*$)/g, "")==''){
        callback(false);
    }else{
        var hostName = url.split('/')[2];
        var path = url.substring(url.indexOf(hostName) + hostName.length);
        var options = {
            host:hostName,
            port:80,
            path:path
        };

        http.get(options, function (res) {
            res.setEncoding('binary');
            var imageData = "";
            res.on('data', function (data) {//图片加载到内存变量
                imageData += data;
            }).on('end', function () {//加载完毕保存图片
                    if(imageData!==undefined){
                        var fileType = res.headers["content-type"];
                        sJBinaryProvider.write(imageData, fileType, imageID, function (err, result) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("binaryProvider.write successful! ");
                                callback(true);
                            }
                        });
                    }else{
                        callback(false);
                    }

                });
        }).on('error', function (e) {
                console.log('ddddddddddddddddddddddddddddddddddddddddd');
                callback(false);
            });
    }

}

//function readeFile(id){
//    sJBinaryProvider.read(new ObjectID(id),function(err,binaryData,fileType){
//        if(err){
//throw err;
//        }
//        else
//        {
//            console.log('---------------------->',fileType);
//          console.log('---------------------->',binaryData);
//        }
//    })
//}
//
//readeFile('522327f62743efd405000035');