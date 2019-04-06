var express=require('express');
var router = express.Router();
var Guide=require('./../modules/guides');
var User=require('./../modules/users');

//列表接口
router.post('/',function(req,res,next){
    //res.send('hello,')
    let params={
        userId:req.body.userId
    }
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                try{
                    let list=[];
                    let arr=doc.guideList;
                    if(arr.length<=0){
                        res.json({
                            status:'4',
                            msg:'请注意,您还没有任何相关的行程!'
                        })
                    }else{
                        let getData=()=>{
                            return new Promise((resolve,reject)=>{
                                    arr.map((item,index)=>{
                                    let temp={
                                        guideId:item.guideId,
                                        guideSN:item.guideSN
                                    }
                                    Guide.findOne(temp,function(error,doc2){
                                        if(error){
                                            throw error
                                        }else{
                                            if(doc2){
                                                let item2={
                                                    guideId:doc2.guideId,
                                                    guideSN:doc2.guideSN,
                                                    guideName:doc2.guideName,
                                                    guideInfo:doc2.guideInfo
                                                }
                                                list.push(item2)
                                                if(list.length===arr.length){
                                                    resolve(list)
                                                }
                                            }else{ throw '没找到数据'}
                                        }
                                    })
                                })
                            })
                        }
                        getData().then(list=>{
                            res.json({
                                status:'0',
                                msg:'',
                                result:{
                                    count:list.length,
                                    guidelist:list
                                }
                            })
                        }).catch(err=>{
                            res.json({
                                status:'1',
                                msg:'出问题了',
                            })
                            throw '出问题了啊啊啊啊啊啊'
                        })
                        
                    }
                }catch(err){
                    res.json({
                        status:'2',
                        msg:'err:'+err
                    })
                }
        }else{
            res.json({
                status:'2',
                msg:err.message
            })
        }
        }

    })    
});
//详情接口
router.post('/detail',function(req,res,next){ 
    //res.send('hello,')
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    console.log('/guide')
    console.log(params)
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
            let tourists=doc.tourists;
            console.log(tourists.length)
            let newtourists=[];
            let getGuideList=(tourists)=>{
                return new Promise((resolve,reject)=>{
                    console.log('getList-1')
                    if(tourists.length===0){
                        resolve()
                    }else{
                            tourists.forEach((item,index)=>{
                            let params={
                                userId:item.touristId
                            }
                            User.findOne(params,function(err,doc){
                                if(err){
                                    res.json({
                                        status:'3',
                                        msg:'查询出错2'
                                    })
                                    throw '查询出错2'
                                }else{
                                    if(doc){
                                        let temp={
                                            touristId:doc.userId,
                                            signInCount:item.signInCount,
                                            guideName:doc.userName,
                                            guideImg:doc.userImg,
                                            touristPhone:doc.userPhone,
                                            touristEmail:doc.email,
                                            touristIntroduce:doc.introduce,
                                            touristJob:doc.job
                                        }
                                        newtourists.push(temp)
                                        tourists[index]=temp
                                        if(newtourists.length===tourists.length){
                                            resolve(newtourists)
                                        }
                                    }else{
                                        res.json({
                                            status:'4',
                                            msg:'没有这个学生'
                                        })
                                        throw "没有这个学生"
                                    }
                                }
                            })
                        })
                    }

                }).catch(err=>{
                    console.log(err)
                })
            }
            getGuideList(tourists).then(result=>{
                console.log(doc)
                    res.json({
                        status:'0',
                        msg:'',
                        result:{
                            count:doc.length,
                            guideDetail:doc
                        }
                    })
                })
            }else{
                res.json({
                    status:'2',
                    msg:'查询出错'
                })
            }
        }

    })    
});
//添加旅程接口
router.post('/addGuide',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
        guideName: req.body.guideName,
        guiderId: req.body.guiderId,
        guiderName: req.body.guiderName,
        guideInfo:req.body.guideInfo,
        guideImg: req.body.guideImg,
        guideSSID: "",
        guideCount: "0",
        guideAddress: req.body.guideAddress,
        status: "1",
        tourists:[]
    }
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    let paramsUser={
        userId:req.body.guiderId
    }
    console.log(paramsUser)
    const p1=(index)=>{
        return new Promise((resolve,reject)=>{
            Guide.findOne(index,function(err,doc){
            if(err){
            res.json({
                status:'1',
                msg:err.message
                    })
                reject(err.message)
                }else{
                    if(doc){
                        console.log(index)
                        console.log(doc)
                        res.json({
                            status:'2',
                            msg:'',
                            result:'同课程号和课序号的课程已经存在在课表中了,请更换后添加'
                        })
                        reject('同课程号和课序号的课程已经存在在课表中了,请更换后添加')

                    }else{
                        var newguide=new Guide(params)
                        newguide.save()
                        resolve()
                        console.log('111')

                    }
                }
            })
        })
    }
    const p2=paramsUser=>{
        return new Promise((resolve,reject)=>{
            User.findOne(paramsUser,function(err,doc){
                if(err){
                    res.json({
                        status:'2',
                        msg:'加入失败'
                    })
                    reject()
                }else{
                    if(doc){
                        doc.guideList.push(index)
                        doc.save()
                        res.json({
                            status:'0',
                            msg:''
                        })
                        console.log('222')
                    }else{
                        res.json({
                            status:'3',
                            msg:'没有这个用户'
                        })
                    }
                }
            })
        })
    }
    p1(index).then(()=>{return p2(paramsUser)})

});
//修改旅程接口
router.post('/modifyGuide',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
        guideName: req.body.guideName,
        guiderId: req.body.guiderId,
        guiderName: req.body.guiderName,
        guideInfo:req.body.guideInfo,
        guideImg: req.body.guideImg,
        guideAddress: req.body.guideAddress,
    }
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    console.log(index)
    Guide.findOne(index,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                try{
                    doc.guideName=params.guideName;
                    doc.guideInfo=params.guideInfo;
                    doc.guideImg=params.guideImg;
                    doc.guideAddress=params.guideAddress;
                    doc.save();
                    res.json({
                        status:'0',
                        msg:'',
                        result:doc.tourists
                    })

                }catch(err){
                    res.json({
                        status:'2',
                        msg:'err:'+err
                    })
                }

            }else{
                res.json({
                    status:'2',
                    msg:'',
                    result:'没有这门课程'
                })

            }
        }
    })
});
//添加游客接口
router.get('/addVisitor',function(req,res,next){
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    let newGuide={
                    touristId:req.body.touristId,
                    signInCount:[],
                    touristState:"1"
                }
    Guide.findOne(index,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                let item=newGuide;
                doc.tourists.push(item)
                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'2',
                            msg:'操作失败'
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'成功了'
                        })
                    }
                })


            }else{
                res.json({
                    status:'2',
                    msg:'没有这门课程'
                })
            }
        }
    })
});

//删除游客接口
router.post('/deleteVisitor',function(req,res,next){
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    //let deleteItem=req.body.touristId;
    let deleteItem=req.body.touristId;
    Guide.findOne(index,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc.tourists.length>0){
                let list=doc.tourists;
                let itemIndex
                list.map((item,index)=>{
                    if(item.touristId===deleteItem){
                        itemIndex=index
                    }
                });
                list.splice(itemIndex,1)
                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'2',
                            msg:'出错了,正在尽力抢修'
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'成功了'
                        })
                    }
                })

            }else{
                res.json({
                    status:'2',
                    msg:'对不起哦,没有数据呢!'
                })
            }
        }
    })
});


//开始签到,修改状态
router.post('/startSignIn',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let guideCount=req.body.guideCount;
    let guideSSID=req.body.guideSSID;
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //0表示正在签到
                doc.status='0';
                doc.guideCount = guideCount;
                doc.guideSSID = guideSSID;
                let tourists=doc.tourists
                for(let i=0;i<tourists.length;i++){
                    let signArray=tourists[i].signInCount;
                    console.log(signArray)
                    let tag=false
                    let newItem={
                        tag:guideCount,
                        isSign:'false'
                    }
                    if(signArray.length==0){
                        signArray.push(newItem)
                    }else{
                        for(let j=0;j<signArray.length;j++){
                            if(signArray[j].tag===guideCount){
                                tag=true
                            }
                        }
                    }
                    if(!tag){
                        signArray.push(newItem)
                    }
                    console.log(signArray)

                }
                doc.save(function(err2,result){
                    if(err2){
                        res.json({
                            status:'3',
                            msg:err2.message
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:''
                        })
                    }
                })
                
                
                

            }else{
                res.json({
                    status:'2',
                    msg:'找不到你准备修改的课程'
                })
            }
        }
    })
});
//结束签到
router.post('/finishSignIn',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //1表示结束签到
                doc.status='1'
                doc.save()
                res.json({
                    status:'0',
                    msg:''
                })

            }else{
                res.json({
                    status:'2',
                    msg:'找不到你准备修改的旅程'
                })
            }
        }
    })
});
//代签接口
router.post('/TSignIn',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let touristId=req.body.touristId
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //学生状态修改
                doc.tourists.forEach((item,index)=>{
                    if(item.touristId === touristId){
                        item.signInCount.forEach(item2=>{
                            if(item2.tag===doc.guideCount){
                                item2.isSign='true';
                                console.log(item2)
                            }
                        })
                    }
                })
                doc.save()
                res.json({
                    status:'0',
                    msg:'success'
                })

            }else{
                res.json({
                    status:'2',
                    msg:'找不到你准备修改的课程'
                })
            }
        }
    })
});
router.post('/TSignOut',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let touristId=req.body.touristId
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //状态修改
                doc.tourists.forEach((item,index)=>{
                    if(item.touristId === touristId){
                        item.signInCount.forEach(item2=>{
                            if(item2.tag===doc.guideCount){
                                item2.isSign='false';
                            }
                        })
                    }
                })
                doc.save()
                res.json({
                    status:'0',
                    msg:'success'
                })

            }else{
                res.json({
                    status:'2',
                    msg:'找不到你准备修改的课程'
                })
            }
        }
    })
});
//发布通知
router.post('/addNotice',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let item = {
        title:req.body.title,
        content:req.body.content,
        time:req.body.time
    };
    console.log('item:')
    console.log(item)
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //作业修改
                doc.notice.push(item);
                doc.save()
                res.json({
                    status:'0',
                    msg:'success',
                    res:doc.notice
                })

            }else{
                res.json({
                    status:'2',
                    msg:'找不到你准备修改的课程'
                })
            }
        }
    })
});















































module.exports = router;