var express=require('express');
var router = express.Router();
var mongoose=require('mongoose');
var User=require('./../modules/users');
var Course=require('./../modules/courses');
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
                    courseList:doc.courseList
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
                    courseList:doc.courseList
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
    let courseList=new Array()
    let params3={
        status:req.body.status,
        userId:req.body.userId,
        userName:req.body.userName,
        password:req.body.password,
        email:req.body.email,
        userImg:req.body.userImg,
        userPhone:req.body.userPhone,
        courseList:courseList
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
            console.log('/info')
            if(doc){
                //尽量传递少的数据
                let list=[];
                let arr=doc.courseList;
                arr.map((item)=>{
                    let temp={
                        courseId:item.courseId,
                        courseSN:item.courseSN,
                        courseName:item.courseName,
                        courseInfo:item.courseInfo
                    }
                    list.push(temp)
                })
                let temp={
                    userId:doc.userId,
                    userImg:doc.userImg,
                    status:doc.status,
                    userName:doc.userName,
                    email:doc.email,
                    userPhone:doc.userPhone,
                    courseList:list,
            company:doc.company,
            job:doc.job,
            introduce:doc.introduce
                }
        console.log(temp)
                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        info:temp
                    }
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
                doc.save()
                let courseList=doc.courseList
                try{
                        courseList.forEach(item=>{
                            let tempParams={
                                courseId:item.courseId,
                                courseSN:item.courseSN
                            }
                            Course.findOne(tempParams,function(err,doc2){
                                if(err){
                                    res.json({
                                        status:'3',
                                        msg:err.message
                                    })
                                }else{
                                    if(doc2){
                                        let students=doc2.students;
                                        try{
                                            students.forEach((item2,index)=>{
                                            if(item2.studentId===req.body.userId){
                                                    students[index].studentName=req.body.userName
                                                    students[index].studentImg=req.body.userImg
                                                }
                                            })
                                            doc2.students=students;
                                            doc2.save()
                                        }catch(err){
                                            console.log('出错了')
                                            res.json({
                                                status:'1',
                                                msg:'错误信息:'+err
                                            })
                                        }
                                    }else{
                                        throw "这个小伙伴还没有加入这次绿城哦"
                                    }
                                }
                            })
                    })
                        res.json({
                            status:'0',
                            msg:'修改成功了哦~~'
                        })
                }catch(err){
                    res.json({
                        status:'4',
                        msg:'错误信息:'+err
                    })
                }

            }else{
console.log('5')
                res.json({
                    status:'2',
                    msg:'在数据库中找不到该项'
                })
            }
        }

  })
})
//删课
router.post('/deleteCourse',function(req,res,next){
    let params={
        userId:req.body.studentId

    }
    let courseId=req.body.courseId
    let courseSN=req.body.courseSN
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                let list=doc.courseList;
                let itemIndex
                list.map((item,index)=>{
                    if(item.courseId===courseId&&item.courseSN===courseSN){
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
                if(req.body.userImg){
                    doc.userImg=req.body.userImg;
                    //改course里面的头像
                    let courseList=doc.courseList;
                    courseList.forEach(item=>{
                        let params={
                            courseId:item.courseId,
                            courseSN:item.courseSN
                        }
                        Course.findOne(params,function(err2,doc2){
                            if(err2){
                                console.log('修改coursenebula学生头像出错')
                            }else{
                                console.log('正在修改课程内部学生头像')
                                if(doc2){
                                    let students=doc2.students;
                                    for(let i=0;i<students.length;i++){
                                        if(students[i].studentId === userId){
                                            students[i].studentImg = newUserImg;
                                            break;
                                        }
                                    }
                                    doc2.students=students;
                                    doc2.save()

                                }else{
                                    console.log('内部头像修改出错')
                                }
                            }
                        })
                    })
                }
                res.json({
                    status:'0',
                    msg:''
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
//添加课程
router.post('/addCourse',function(req,res,next){
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
                    courseId:req.body.courseId,
                    courseSN:req.body.courseSN,
                    courseName:req.body.courseName,
                    courseInfo:req.body.courseInfo
                }
                doc.courseList.push(newItem)
                res.json({
                    status:'0',
                    msg:'courseList更新成功'
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
//添加学生
router.post('/addStudent',function(req,res,next){
    let params={
        userId:req.body.userId
    }
    let newItem={
                    courseId:req.body.courseId,
                    courseSN:req.body.courseSN,
                    courseName:req.body.courseName,
                    courseInfo:req.body.courseInfo
                }
                console.log(newItem)
    User.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                let courseList=doc.courseList;
                let tag=false;
                for(let i=0;i<courseList.length;i++){
                    if(courseList[i].courseId===newItem.courseId&&courseList[i].courseSN===newItem.courseSN){
                        tag=true;
                        break;
                    }
                }
                if(tag){
                    res.json({
                        status:'2',
                        msg:'这个同学已经拥有这门课了!'
                    })
                }else{
                    doc.courseList.push(newItem)
                    doc.save(function(err,result){
                        if(err){
                            res.json({
                                status:'5',
                                msg:'信息保存失败'
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:result
                            })
                        }
                    })

                }
            }else{
                res.json({
                        status:'3',
                        msg:'数据表中没有这个学生,请先注册!'
                    })
            }
        }
    })
})

module.exports = router;