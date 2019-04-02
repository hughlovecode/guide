import React from 'react'
import { Row,Col,List,Card,Icon,Avatar,Typography } from 'antd';
import http from './../../../axios/index'
import './myInfo.styl'
const { Meta } = Card;


export default class MyInfo extends React.Component{
    componentWillMount(){
        this.getData();
        this.setState({
            status:'',//必须写上status,否则下面this.state.status会报错,其他无所谓
            guideTree:''
        })
    }
    getData=()=>{
        let userId=localStorage.getItem('userId')
        http.post('/userInfo/info',{userId:userId}).then((res)=>{
            if(res.status!=='0'){
                alert('好像出了点以外刷新看看')
            }else{
                let temp=res.info;
                console.log('temp:')
                console.log(temp)
                this.setState({
                    userId:temp.userId,
                    userImg:temp.userImg,
                    status:temp.status,
                    userName:temp.userName,
                    email:temp.email,
                    guideList:temp.guideList,
                    company:temp.company,
                    job:temp.job,
                    introduce:temp.introduce,
                    userPhone:temp.userPhone
                })

            }
        })
    }
    render(){
        let data = [
          this.state.userId?{'name':'用户ID','value':this.state.userId}:{},
          this.state.userName?{'name':'姓名','value':this.state.userName}:{},
          this.state.email?{'name':'邮箱','value':this.state.email}:{},
          this.state.company?{'name':'公司','value':this.state.company}:{},
          this.state.job?{'name':'职位','value':this.state.job}:{},
          this.state.introduce?{'name':'格言','value':this.state.introduce}:{},
        ];
        let tree = new Array();
        data.forEach(item=> {
            if (JSON.stringify(item) !== '{}'){
                tree.push(item)
            }
        })
        return(
            <Row className='Info-all'>

                <Col span='12' className='info-left'>
                <div>
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
                    <div style={{ width:'320px','paddingLeft':'30px'}}>
                        <div className='SomeInfo'>
                            <List
                              header={<div>Some Tips</div>}
                              bordered
                              dataSource={tree}
                              //renderItem={item => (<List.Item><Typography.Text mark>[ITEM]</Typography.Text> {item}</List.Item>)}
                              renderItem={item=>(<List.Item><Typography.Text mark>[{item.name}]</Typography.Text> {item.value}</List.Item>:'')}
                            />
                        </div>
                    </div>
                </Col>

            </Row>
        )
    }
}



