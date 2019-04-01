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
        //console.log(doc.length)
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
                            status:'2',
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
                                                    courseName:doc2.courseName,
                                                    courseInfo:doc2.courseInfo
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
                //console.log(doc)
                /*
                res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    courseDetail:doc
                }
            })*/
            let students=doc.students;
            console.log(students.length)
            let newStudents=[];
            let getStudentList=(students)=>{
                return new Promise((resolve,reject)=>{
                    console.log('getList-1')
                    if(students.length===0){
                        resolve()
                    }else{
                            students.forEach((item,index)=>{
                            let params={
                                userId:item.studentId
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
                                            studentId:doc.userId,
                                            signInCount:item.signInCount,
                                            studentName:doc.userName,
                                            studentImg:doc.userImg
                                        }
                                        newStudents.push(temp)
                                        if(newStudents.length===students.length){
                                            resolve(newStudents)
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
            getStudentList(students).then(result=>{
                    doc.students=newStudents;
                    console.log(doc)
                    res.json({
                        status:'0',
                        msg:'',
                        result:{
                            count:doc.length,
                            courseDetail:doc
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
//添加课程接口
router.post('/addGuide',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
        courseName: req.body.courseName,
        teacherId: req.body.teacherId,
        teacherName: req.body.teacherName,
        courseInfo:req.body.courseInfo,
        courseImg: req.body.courseImg,
        courseSSID: "",
        classCount: "0",
        HContent: "",
        Htime: "",
        classAddress: req.body.classAddress,
        status: "1",
        HTitle: "",
        students:[]
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
                res.json({
                    status:'2',
                    msg:'',
                    result:'同课程号和课序号的课程已经存在在课表中了,请更换后添加'
                })

            }else{
                var newcourse=new Guide(params)
                newcourse.save(function(err,result){
                    if(err){
                        res.json({
                            status:'3',
                            msg:'录入过程中出错'
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'成功'
                        })
                    }
                })

            }
        }
    })
});
//修改课程接口
router.post('/modifyGuide',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
        courseName: req.body.courseName,
        teacherId: req.body.teacherId,
        teacherName: req.body.teacherName,
        courseInfo:req.body.courseInfo,
        courseImg: req.body.courseImg,
        classAddress: req.body.classAddress,
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
                    doc.courseName=params.courseName;
                    doc.courseInfo=params.courseInfo;
                    doc.courseImg=params.courseImg;
                    doc.classAddress=params.classAddress;
                    doc.save();
                    res.json({
                        status:'0',
                        msg:'',
                        result:doc.students
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
//添加学生接口
router.get('/addVisitor',function(req,res,next){
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    let newStudent={
                    studentId:req.body.studentId,
                    studentName:req.body.studentName,
                    studentImg:'',
                    signInCount:[]
                }
    Guide.findOne(index,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                let item=newStudent;
                doc.students.push(item)
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

//删除学生接口
router.post('/deleteVisitor',function(req,res,next){
    let index={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN,
    }
    //let deleteItem=req.body.studentId;
    let deleteItem=req.body.studentId;
    Guide.findOne(index,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc.students.length>0){
                let list=doc.students;
                let itemIndex
                list.map((item,index)=>{
                    if(item.studentId===deleteItem){
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


//开始签到,修改课程状态
router.post('/startSignIn',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let classCount=req.body.classCount;
    let courseSSID=req.body.courseSSID;
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
                doc.classCount = classCount;
                doc.courseSSID = courseSSID;
                let students=doc.students
                for(let i=0;i<students.length;i++){
                    let signArray=students[i].signInCount;
                    console.log(signArray)
                    let tag=false
                    let newItem={
                        tag:classCount,
                        isSign:'false'
                    }
                    if(signArray.length==0){
                        signArray.push(newItem)
                    }else{
                        for(let j=0;j<signArray.length;j++){
                            if(signArray[j].tag===classCount){
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
                    msg:'找不到你准备修改的课程'
                })
            }
        }
    })
});
//老师代签接口
router.post('/TSignIn',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let info = req.body.info
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                //学生状态修改
                doc.students.forEach(item=>{
                    if(item.studentId === info.studentId){
                        item.signInCount = info.signInCount
                       // console.log(item)
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
//布置作业
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
//添加学生
router.post('/addVisitor',function(req,res,next){
    let params={
        guideId:req.body.guideId,
        guideSN:req.body.guideSN
    }
    let signInCount=new Array()
    let newItem={
        signInCount:signInCount,
        studentId:req.body.studentId,
        studentName:req.body.studentName,
        studentImg:req.body.studentImg
    }
    Guide.findOne(params,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                doc.students.push(newItem);

                doc.save(function(err,result){
                    if(err){
                        res.json({
                            status:'3',
                            msg:err.message
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'success'
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













































module.exports = router;