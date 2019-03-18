import React from 'react'
import http from './../../../axios/index'
import './detail.styl'
import { List, Avatar,Icon,Button } from 'antd';
import StudentList from './studentList'
import HomeworkList from './homeworkList'
export default class Detail extends React.Component{

    constructor(params){
        super(params);
        this.state={
            teacherImg:localStorage.getItem('userImg'),
            courseName:'',
            courseId:'',
            courseSN:'',
            classAddress:'',
            classCount:'',
            courseInfo:'',
            courseState:'',
            teacherName:'',
            students:'',
            teacherId:'',
            isCourseLoading:true,
            isStudentLoading:true,//这上下两个是react异步传值所需要的
            homeworkList:{}

        }
        http.post('/course/detail',this.props.location.state.params).then((res)=>{
            if(res.status!=='0'){
                alert('抱歉,出问题了!')
                console.log(res)
            }else{
                let detail=res.result.courseDetail;
                let tempObject={
                    HContent:detail.HContent,
                    HTime:detail.Htime,
                    HTitle:detail.HTitle
                }
                this.setState({
                    courseName:detail.courseName,
                    courseId:detail.courseId,
                    courseSN:detail.courseSN,
                    classAddress:detail.classAddress,
                    classCount:detail.classCount,
                    courseInfo:detail.courseInfo,
                    courseState:detail.courseState,
                    teacherName:detail.teacherName,
                    students:detail.students,
                    teacherId:detail.teacherId,
                    courseImg:detail.courseImg,
                    homeworkList:tempObject
                })

            }
        }).then(()=>{
            this.setState({
                isCourseLoading:false,
                isStudentLoading:false
            })
        })


    }
    homework=()=>{
        return <span>作业</span>
    }
    goToModifyInfo=()=>{
        let params={
            courseId:this.state.courseId,
            courseSN:this.state.courseSN
        }
        this.props.history.push({pathname: '/course/modifyCourse', state: {params: params}})
    }
    goToStatistic=()=>{
        let params={
            courseId:this.state.courseId,
            courseSN:this.state.courseSN
        }
        this.props.history.push({pathname: '/course/statistic', state: {params: params}})
    }
    goToHomework=()=>{
        let params={
            courseId:this.state.courseId,
            courseSN:this.state.courseSN,
            HTitle:this.state.homeworkList.HTitle,
            HContent:this.state.homeworkList.HContent,
            Htime:this.state.homeworkList.HTime,
            courseImg:this.state.courseImg
        }
        console.log(params)
        this.props.history.push({pathname: '/course/myHomework', state: {params: params}})

    }
    goToStudents=()=>{
        let params={
            courseId:this.state.courseId,
            courseSN:this.state.courseSN,
        }
        console.log(params)
        this.props.history.push({pathname: '/course/myStudents', state: {params: params}})

    }




    render(){


        return(
            <div className='detail-all'>
                <span style={{fontSize:'20px',fontWeight:'900'}}><Icon type="double-right" style={{margin:'20px 5px 0px 20px'}}/>{this.state.courseName}</span>
                <Button style={{float:'right',margin:'20px 30px 0px 20px'}} onClick={this.goToModifyInfo}>修改信息</Button>
                <Button style={{float:'right',margin:'20px 10px 0px 20px'}} onClick={this.goToStatistic}>签到统计</Button>
            <div className='detail-container'>

                <List className="detail-list">

                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar
                                src={this.state.teacherImg}/>}
                            title={<span>{this.state.teacherName}</span>}
                            description={this.state.teacherId}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>简介</span>}
                            description={this.state.courseInfo}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>课程号</span>}
                            description={this.state.courseId}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>课序号</span>}
                            description={this.state.courseSN}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>教室</span>}
                            description={this.state.classAddress}
                        />
                    </List.Item>
                    <List.Item >
                        <List.Item.Meta
                            title={<span>作业<Button style={{marginLeft:'100px'}} onClick={this.goToHomework}>详情</Button></span> }
                            description={this.state.isCourseLoading?'loading':<HomeworkList homeworkList={this.state.homeworkList}/>}
                        />
                    </List.Item>
                    <List.Item className='studentListDiv'>
                        <List.Item.Meta

                            title={<span>学生<Button style={{marginLeft:'100px'}} onClick={this.goToStudents}>详情</Button></span>}
                            description={this.state.isStudentLoading?'loading':<StudentList studentList={this.state.students}/>}
                        />
                    </List.Item>
                </List>


                

            </div>
            </div>
        )
        }
        }