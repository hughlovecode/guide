import React from 'react'
import { Row,Col,Card,Icon,Avatar } from 'antd';
import http from './../../../axios/index'
import './myInfo.styl'
const { Meta } = Card;


export default class MyInfo extends React.Component{
    componentWillMount(){
        this.getData();
        this.setState({
            status:'',//必须写上status,否则下面this.state.status会报错,其他无所谓
            courseTree:''
        })
    }
    getData=()=>{
        let userId=localStorage.getItem('userId')
        http.post('/userInfo/info',{userId:userId}).then((res)=>{
            if(res.status!=='0'){
                alert('好像出了点以外刷新看看')
            }else{
                let temp=res.result.info;
                //console.log(temp)
                this.setState({
                    userId:temp.userId,
                    userImg:temp.userImg,
                    status:temp.status,
                    userName:temp.userName,
                    email:temp.email,
                    courseList:temp.courseList,
                    courseTree:this.getcourseTree(temp.courseList)
                })
                //console.log(this.state.status)

            }
        })
    }
    getcourseTree=(data)=>{
        if(data.length>0){
            return data.map((item)=>{
                return <Row gutter={16} key={item.courseId}><Card title={item.courseName} bordered={false} style={{width:300}}>{item.courseInfo}</Card></Row>
            })
        }else{
            return ''
        }
    }

    render(){
        return(
            <Row className='Info-all'>

                <Col span='12' className='info-left'>
                <div >
                <Card
                    style={{ width: 320 }}
                    cover={<img alt="example" src={this.state.userImg} style={{width:320,maxHeight:320}}/>}
                    actions={[<Icon type="setting" />, <Icon type="edit" onClick={()=>{this.props.history.push('/Info/changeMyInfo')}}></Icon>, <Icon type="ellipsis" />]}
                >
                    <Meta
                        avatar={<Avatar src={this.state.userImg} />}
                        title={this.state.userName}
                        description={this.state.userId}
                    />
                    <p style={{marginLeft:50}}>{this.state.email}</p>
                </Card></div>
                </Col>
                <Col span='12' className='info-right'>
                    <div style={{ height:'100%',width:'100%',paddingLeft:'30px'}}>



                        <div className='CourseInfo'>
                            <span style={{fontSize:'20px',fontWeight:900,paddingLeft:'10px'}}>我的课程</span>
                            {this.state.courseTree}

                        </div>
                    </div>
                </Col>

            </Row>
        )
    }
}



