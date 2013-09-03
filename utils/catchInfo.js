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
var listpath = '/search/category/2/10/r2579'; //美食
//var listpath =  '/search/category/2/30/r2579';           //休闲
//var listpath =  '/search/category/2/20/r2579';         //购物
//var listpath =  '/search/category/2/50/r2579';         //丽人
//var listpath =  '/search/category/2/55/r2579';         //marry
//var listpath =  '/search/category/2/70/r2579';         //亲子
//var listpath =  '/search/category/2/45/r2579';         //运动健身    5page
//var listpath =  '/search/category/2/60/r2579';         //hotel    3page
//var listpath =  '/search/category/2/80/r2579';    //生活服务  25page


var detailPath = 'shop/'; //shop/+id

 //43

startTask(1,41,'',function(){
    console.log('dddddddddddddddddd');
    process.exit(0);
});
function startTask(current,count,path,callback){
    if(current> count){
        callback();
    }else{
        getData(current,function(){
            startTask(current+1,count,path,callback);
        })
    }
}

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
            var dom = $(html);//生成文档树
            var $fir = dom.find('#searchList > dl');
            var $sec = $fir.find('dd');
            var count = $sec.size();
            getDetail(1,count,$sec,function(){
               callback();
            });
        });
    }).on('error', function (e) {
           console.log(e);
        });
}


function getDetail (current,count,$data,callback){
    if(current>count){
        callback();
    }else{
        browserPage($data.eq(current),function(){
            getDetail(current+1,count,$data,callback);
        })
    }
}

function browserPage(ele,callback){
    var id = ele.find('.shopname > a').attr('href');
    var options = {
        host:globalHost,
        port:80,
        path:id,
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
            var json = {};
            json._id = new ObjectID();
            json.fromurl = globalHost+id;
            json.from = '大众点评';
            json.from = true;
            var category =  $(html).find('.breadcrumb >b').eq(3).find('a span').first().text();
            json.category = (category===undefined)?' ':category;
            var subCategory =  $(html).find('.breadcrumb >b').eq(4).find('a span').first().text();
            json.subCategory = (subCategory===undefined)? ' ':subCategory;
            var title = $(html).find('.shop-title').text();
            json.title = (title===undefined)? ' ':title;
            var address = $(html).find("span[itemprop='street-address']").text();
            json.address = (address===undefined) ? ' ':address;
            var fee = $(html).find(".stress").text();
            json.fee = (fee===undefined) ? ' ':fee;
            var imgPath = $(html).find('.thumb-switch').find('img').attr('src');
            json.imgPath = (imgPath===undefined) ? ' ':imgPath;
            var tel = [];
            var $tel = $(html).find("span[itemprop='tel']");
            for(var i=0;i<$tel.size();i++){
                tel.push($tel.eq(i).text().replace(/(^\s*)|(\s*$)/g, ""));
            }
            json.tel = tel;
            var opentime = $(html).find('.J_full-cont').text().replace(/(^\s*)|(\s*$)/g, "");
            json.opentime = (opentime===undefined) ? ' ':opentime;
            var introduce = '';
            var tags = [];
            var $em = $(html).find('em.tit');
//            todo 这里根据不同的页面需要做具体的分析，简介和特色在不同的页面不一致
            for(var k=0;k<$em.size();k++){
                var text = $em.eq(k);
                if(text.text().replace(/(^\s*)|(\s*$)/g, "").indexOf("简介")>=0){
                    introduce =text.parent('li').clone().children().remove().end().text().replace(/(^\s*)|(\s*$)/g, "");
                }else if(text.text().replace(/(^\s*)|(\s*$)/g, "").indexOf("特色")>=0){
                    var $desc_tag =  text.next().find('.desc-tag');
                    for(var j=0;j<$desc_tag.size();j++){
                tags.push($desc_tag.eq(j).find('a').text().replace(/(^\s*)|(\s*$)/g, ""));
            }
                }
            }
              json.introduce = introduce;
            json.tags = tags;
            console.log('-------------->',json);
            infoProvider.insert(json,{},function(err,result){
                if(err) throw err;
                if(result){
                    callback()
                }
            });
        });
    }).on('error', function (e) {
            console.log(e);
        });
}
