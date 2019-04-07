var express=require('express');
var router = express.Router();
var request=require('request')
var utility = require('utility');
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');


router.post('/',function(req,res,next){

    let params={
        city:req.body.city
    }
    //let Url='http://jwc.scu.edu.cn/'
    let Url='http://www.mafengwo.cn/search/q.php?q='+params.city+'&t=notes'
    console.log(Url)
    superagent.get(Url)
    .end(function(err,response){
        if(err){
            console.log('出错了')
            res.json({
                status:'1',
                msg:'出错了'
            })
        }else{
            //console.log(response.text)
            let tripList=[]
            let date=new Date();
            var $=cheerio.load(response.text)
            let list=$(".att-list>ul>li>.clearfix")
            list.each(function(){
                let link=$(this).find('.flt1>a').attr("href")
                let imageUrl=$(this).find('.flt1>a>img').attr("src")
                let title=$(this).find('.ct-text>h3').text()
                let brief=$(this).find('.ct-text>p').text()
                let time="2019"+'-'+(date.getMonth()+1)+'-'+date.getDate()
                let item={
                    link:link,
                    imageUrl:imageUrl,
                    title:title,
                    brief:brief,
                    time:time
                }
                tripList.push(item)
            })
            
            
            res.json({
                status:'0',
                res:tripList
            })
            
            
            
        }
    })
    
})
router.post('/detail',function(req,res,next){
    /*
    let params={
        city:req.body.city
    }
    */
    //let Url='http://jwc.scu.edu.cn/'
    let Url=req.body.link;
    superagent.get(Url)
    .end(function(err,response){
        if(err){
            console.log('出错了')
            res.json({
                status:'1',
                msg:'出错了'
            })
        }else{
            //console.log(response.text)
            let detail=new Object();
            var $=cheerio.load(response.text)
            let triTime=$('.tarvel_dir_list>ul>.time').text()
            let triDay=$('.tarvel_dir_list>ul>.day').text()
            let triPeople=$('.tarvel_dir_list>ul>.people').text()
            let triCost=$('.tarvel_dir_list>ul>.cost').text()
            let contentP=$('._j_content_box>p')
            let contentImg=$('._j_content_box').html()
            let pList=[];
            let imgList=[];
            contentP.each(function() {
                let item=$(this).text()
                pList.push(item)
            });
            //console.log(contentImg)
            let reg = /<img.+?data-rt-src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;  
            while (tem = reg.exec(contentImg)) {  
                imgList.push(tem[2]);  
            } 
            detail={
                triTime:triTime,
                triDay:triDay,
                triPeople:triPeople,
                triCost:triCost,
                pList:pList,
                imgList:imgList
            }
            
            
            res.json({
                status:'0',
                res:detail
            })
            
            
            
        }
    })
    
})


module.exports = router;




























