var express=require('express');
var router = express.Router();
var mongoose=require('mongoose');
var User=require('./../modules/users');
var Guide=require('./../modules/guides');
var request=require('request')
var wx=require('./config.js')
//连接mongodb test
mongoose.connect('mongodb://59.110.162.130:27017/guide');
mongoose.connection.on('connected',function(){
    console.log('mongodb connected success')
});
mongoose.connection.on('error',function(){
    console.log('mongodb connected error')
});

mongoose.connection.on('disconnected',function(){
    console.log('mongodb disconnected')
});

router.get('/',function(req,res,next){
    //res.send('hello,')

    User.find({},function(err,doc){
        console.log(doc)
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    user:doc
                }
            })
        }

    })



});
router.post('/login',function(req,res,next){
    let params={
        userId:req.body.userId,
        password:req.body.password
    }
    User.findOne(params,function(err,doc){

        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            console.log(params.userName,params.password)
            if(doc){
                //console.log(doc)
                res.cookie('userId',doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                });
                let temp={
                    userId:doc.userId,
                    userName:doc.userName,
                    userImg:doc.userImg,
                    status:doc.status,
                    guideList:doc.guideList
                }

                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        userInfo:temp
                    }
                })


            }else{
                res.json({
                    status:'2',
                    msg:'未找到',
                    result:[]
                })
            }
        }
    })
})
//电话号码登录
router.post('/loginByPhone',function(req,res,next){
    let params={
        userPhone:req.body.userPhone
    }
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //console.log(doc)
                res.cookie('userId',doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                });
                let temp={
                    userId:doc.userId,
                    userName:doc.userName,
                    userImg:doc.userImg,
                    status:doc.status,
                    guideList:doc.guideList
                }

                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        userInfo:temp
                    }
                })


            }else{
                res.json({
                    status:'2',
                    msg:'未找到',
                    result:[]
                })
            }
        }
    })
})
router.post('/register',function(req,res,next){
    let params1={
        userId:req.body.userId,
    }
    let params2={
        userPhone:req.body.userPhone
    }
    let guideList=new Array()
    let params3={
        status:req.body.status,
        userId:req.body.userId,
        userName:req.body.userName,
        password:req.body.password,
        email:req.body.email,
        userImg:req.body.userImg,
        userPhone:req.body.userPhone,
        guideList:guideList
    }
    User.findOne(params1,function(err,doc){
        if(err){
            //console.log('status:1')
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            //console.log('else')
            if(doc){
                console.log('status:2')
                res.json({
                    status:'2',
                    msg:'这个用户id已经被注册了,请使用未被注册的userId来尽心注册',
                })
            }else{
                //console.log('else2')
                User.findOne(params2,function(err,doc){
                    if(err){
                        console.log('status:3')
                        res.json({
                            status:'3',
                            msg:err.message
                        })
                    }else{
                        //console.log('else3')
                        if(doc){
                            console.log('status:4')
                            res.json({
                                status:'4',
                                msg:'这个手机号已经被注册了,请使用全新的手机号'
                            })
                        }else{
                            //console.log('else4')
                            var newUser=new User(params3)
                            newUser.save(function(err,result){
                                if(err){
                                    console.log('status:5')
                                    res.json({
                                        status:'5',
                                        msg:'录入过程中出错,请稍后再试'
                                    })
                                }else{
                                    //console.log('status:0')
                                    res.json({
                                        status:'0',
                                        msg:'成功'
                                    })
                                }
                            })

                        }
                    }
                })
            }
        }
    })
})
router.post('/info',function(req,res,next){
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
                
                let arr=doc.guideList;
                let temp={
                    userId:doc.userId,
                    userImg:doc.userImg,
                    status:doc.status,
                    userName:doc.userName,
                    email:doc.email,
                    userPhone:doc.userPhone,
                    company:doc.company,
                    job:doc.job,
                    introduce:doc.introduce
                }
                let guideList=[];
                let p1=(arr)=>{
                    return new Promise((resolve,reject)=>{
                        arr.forEach((item,index)=>{
                            let params={
                                guideId:item.guideId,
                                guideSN:item.guideSN
                            }
                            Guide.findOne(params,function(err,doc){
                                if(err){
                                    res.json({
                                        status:'2',
                                        msg:'查找信息失败'
                                    })
                                    reject()
                                }else{
                                    if(doc){
                                        let s={
                                            guideId:doc.guideId,
                                            guideSN:doc.guideSN,
                                            guideInfo:doc.guideInfo,
                                            guideName:doc.guideName,
                                            guideImg:doc.guideImg
                                        }
                                        guideList.push(s)
                                        if(guideList.length===arr.length){
                                            resolve()
                                        }
                                    }else{
                                        res.json({
                                            status:'2',
                                            msg:'空值'
                                        })
                                        reject()
                                    }
                                }
                            })
                        })
                    })
                }
                p1(arr).then(result=>{
                    temp.guideList=guideList;
                    console.log(temp.guideList)
                    res.json({
                        status:'0',
                        msg:'',
                        info:temp
                    })
                })
            }else{
                res.json({
                    status:'2',
                    msg:'没有返回值'
                })
            }
        }
    })
})
router.post('/modify',function(req,res,next){
    let params={
        userId:req.body.userId
    }
    //console.log(req.body)
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                if(req.body.email){
                    doc.email=req.body.email
                }
                if(req.body.userName){
                    doc.userName=req.body.userName
                }
                if(req.body.introduce){
                    doc.introduce=req.body.introduce
                }
                if(req.body.userImg){
                    doc.userImg=req.body.userImg
                }
                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'2',
                            msg:'错误'
                        })
                    }else{
                        if(doc){
                            res.json({
                                status:'0',
                                msg:'成功了哦~'
                            })
                        }else{
                            res.json({
                                status:'3',
                                msg:'失败了'
                            })
                        }
                    }
                })
                

            }else{
                res.json({
                    status:'2',
                    msg:'在数据库中找不到该项'
                })
            }
        }

  })
})
//删课
router.post('/deleteGuide',function(req,res,next){
    let params={
        userId:req.body.touristId

    }
    let guideId=req.body.guideId
    let guideSN=req.body.guideSN
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                let list=doc.guideList;
                let itemIndex
                list.map((item,index)=>{
                    if(item.guideId===guideId&&item.guideSN===guideSN){
                        itemIndex=index
                    }
                });
                //console.log(itemIndex)
                list.splice(itemIndex,1)
                //console.log(list)
                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'3',
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
                    msg:'在数据库中找不到该项'
                })
            }
        }
    })
})
//改头像
router.post('/modifyUserImg',function(req,res,next){
    let params={
        userId:req.body.userId
    }
    let userId=req.body.userId;
    let newUserImg=req.body.userImg;
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            console.log('/userInfo/modifyUserImg');
            if(doc){
                doc.userImg=req.body.userImg;
                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'1',
                            msg:'错误'
                        })
                    }else{
                        if(doc){
                            res.json({
                                status:'0',
                                msg:'成功了~'
                            })
                        }else{
                            res.json({
                                status:'1',
                                msg:'出错了'
                            })
                        }
                    }
                })
                
            }else{
                res.json({
                    status:'2',
                    msg:'在数据库中找不到该项'
                })
            }
        }
    })
})
//添加旅程
router.post('/addGuide',function(req,res,next){
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
                let newItem={
                    guideId:req.body.guideId,
                    guideSN:req.body.guideSN
                }
                doc.guideList.push(newItem)
                res.json({
                    status:'0',
                    msg:'guideList更新成功'
                })
                doc.save()
            }else{
                res.json({
                    status:'2',
                    msg:'在数据库中找不到该项'
                })
            }
        }
    })
})
//添加游客
router.post('/addVisitor',function(req,res,next){
    let params={
        userId:req.body.userId
    }
    let newItem={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    console.log(newItem)
    let p1=()=>{
        return new Promise((resolve,reject)=>{

            User.findOne(params,function(err,doc){
            if(err){
                throw err
            }else{
                if(doc){
                    let guideList=doc.guideList;
                    let tag=false;
                    guideList.forEach(item=>{
                        if(item.guideId===newItem.guideId&&item.guideSN===newItem.guideSN){
                            tag=true
                        }
                    })
                    if(tag){
                        reject('这个同学已经拥有这门课了!')
                    }else{
                        doc.guideList.push(newItem)
                        doc.save(function(err,result){
                            if(err){
                                throw '信息保存失败'
                            }else{
                                if(doc){
                                    resolve('成功')
                                }
                                
                            }
                        })

                    }
                }else{
                    throw '数据表中没有这个学生,请先注册!'
                }
            }
        })

        })
        console.log('p1')
    }
    let p2=()=>{
        return new Promise((resolve,reject)=>{
            Guide.findOne(newItem,function(err,doc){
                if(err){
                    throw '课程查询出错'
                }else{
                    if(doc){
                        let item={
                            signInCount:[],
                            touristId:req.body.userId,
                        }
                        doc.tourists.push(item);
                        doc.save(function(err,doc){
                            if(err){
                                throw '课程信息修改失败'
                            }else{
                                res.json({
                                    status:'0',
                                    msg:'',
                                    res:doc
                                })
                            }
                        })
                    }else{
                        throw '没有这门课'
                    }
                }
            })
        }).catch(err=>{
                res.json({
                    status:'3',
                    msg:'err:'+err
                })
            })
        console.log('p2')
    }
    p1().then(data=>{return p2()},err=>{
        res.json({
            status:'4',
            msg:'err:'+err
        })
    })
})
//微信验证接口
router.post('/wxLogin',function(req,res,next){
    const params={
        code:req.body.code,
        appid:wx.wx.appid,
        appsercret:wx.wx.appsercret
    }
    console.log(params)
    let url='https://api.weixin.qq.com/sns/jscode2session?appid='+params.appid+'&secret='+params.appsercret+'&js_code='+params.code+'&grant_type=authorization_code';
    console.log(url)
    request(url,function(err,response,body){
        if(err){
            res.json({
                status:'2',
                msg:'err:'+err
            })
        }else{
            res.json({
                status:'0',
                res:body
            })
        }
    })
});

module.exports = router;




























