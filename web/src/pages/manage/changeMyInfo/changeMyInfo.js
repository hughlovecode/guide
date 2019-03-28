import React from 'react'
import { Input,Row,Col,Button ,Upload, message, Icon,Modal} from 'antd';
import './changeMyInfo.styl'
import http from "../../../axios";
import Bmob from "hydrogen-js-sdk";
const {TextArea}=Input;
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")
export default class ChangeMyInfo extends React.Component{
    componentWillMount(){
        this.getData();
        this.setState({
            status:'',
            isShowTip:false
        })
    }
    getData=()=>{
        let userId=localStorage.getItem('userId')
        http.post('/userInfo/info',{userId:userId}).then((res)=>{
            if(res.status!=='0'){
                this.setState({
                    isShowTip:true,
                    tipInfo:'出了点意外,试试刷新'
                })
            }else{
                let temp=res.result.info;
                //console.log(temp)
                this.setState({
                    userId:temp.userId,
                    userImg:temp.userImg,
                    status:temp.status,
                    userName:temp.userName,
                    userPhone:temp.userPhone,
                    email:temp.email,
                    company:temp.company,
                    job:temp.job,
                    introduce:temp.introduce,
                    courseList:temp.courseList
                })
                //console.log(this.state.status)

            }
        })
    }
    getUserName=(e)=>{
        this.setState({
            modifyUserName:e.target.value
        })
    }
    getEmail=(e)=>{
        this.setState({
            modifyEmail:e.target.value
        })
    }
    getIntroduce=e=>{
        this.setState({
            modifyIntroduce:e.target.value
        })
    }
    modifyInfo=()=>{
        if((this.state.modifyUserName===undefined||this.state.modifyUserName.length===0)&&(this.state.modifyEmail===undefined||this.state.modifyEmail.length===0)&&(this.state.modifyIntroduce===undefined||this.state.modifyIntroduce.length===0)){
            this.setState({
                isShowTip:true,
                tipInfo:'您没有改变任何项目'
            })
        }else{
            let email=this.state.modifyEmail
            let userName=this.state.modifyUserName
            let introduce=this.state.modifyIntroduce
            let params={
                email:this.state.email,
                userName:this.state.userName,
                introduce:this.state.introduce,
                userId:this.state.userId
            };
            if(email!==undefined&&email.length>0){
                params.email=email
            }
            if(userName!==undefined&&userName.length>0){
                params.userName=userName
            }
            if(introduce!==undefined&&introduce.length>0){
                params.introduce=introduce
            }
            http.post('/userInfo/modify',params).then((res)=>{
                if(res.status!=='0'){
                    this.setState({
                        isShowTip:true,
                        tipInfo:'失败了!'+res.msg
                    })
                }else{
                    window.location.href='/Info/myInfo'
                }
            })

        }

    }
    handleCancel=()=>{
        this.setState({
            isShowTip:false
        })
    }


    render(){
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            beforeUpload:(file,fileList)=>{
                let item = Bmob.File(file.name, file);
                item.save().then(res=>{
                    console.log(res)
                    let newUserImg=res[0].url;
                    let params={
                        userId:this.state.userId,
                        userImg:newUserImg
                    }
                    http.post('/userInfo/modifyUserImg',params).then(res=>{
                        if(res.status === '0'){
                            this.setState({
                                userImg:newUserImg
                            })
                            localStorage.setItem('userImg',newUserImg)
                        }else{
                            this.setState({
                                isShowTip:true,
                                tipInfo:'出错了!'+res.msg
                            })
                        }
                    })
                   
                })
                return Promise.reject()

            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    //message.success(`${info.file.name} file uploaded successfully`);
                    console.log('success')
                } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return(
            <Row className='changeMyInfo'>
                <Col span='3'/>
                <Col span='7' >
                <ul style={{listStyle:'none',width:'150px'}}>
                        <li style={{width:'150px',height:'150px'}}>
                            <img src={this.state.userImg} className='userImg' alt='用户头像'/>
                        </li>
                        <li style={{width:'150px',height:'32px',display:'flex',justifyContent:'center',marginTop:'10px'}}>
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> 上传图片
                                </Button>
                            </Upload>
                        </li>
                </ul>
                

                </Col>
                <Col span='11' style={{display:'flex',height:'100%',justifyContent:'flex-start',alignItems:'center'}}>

                    <ul style={{listStyle:'none',width:'300px'}}>
                        <li><span>姓名:</span>
                            <Input placeholder={this.state.userName} size='large'  onChange={(e)=>{this.getUserName(e)}}/>
                        </li>
                        <li><span>邮箱:</span>
                            <Input placeholder={this.state.email} size='large' onChange={(e)=>this.getEmail(e)}/>
                        </li>
                        <li><span>手机:</span>
                            <Input placeholder={this.state.userPhone} size='large' disabled/>
                        </li>
                        <li><span>公司:</span>
                            <Input placeholder={this.state.company} size='large' disabled/>
                        </li>
                        <li><span>职位:</span>
                            <Input placeholder={this.state.job} size='large' disabled/>
                        </li>
                        <li><span>格言:</span>
                            <TextArea placeholder={this.state.introduce} size='large' onChange={e=>{this.getIntroduce(e)}}/>
                        </li>
                        <li><Button className='changeMyInfo-button' onClick={this.modifyInfo}>确认</Button></li>
                    </ul>
                    {this.state.isShowTip?<section>
                            <Modal
                              title="提示"
                              visible={this.state.isShowTip}
                              onCancel={this.handleCancel}
                              footer={[
                                    <Button onClick={this.handleCancel} key='1'>知道了</Button>
                                ]}
                            >
                              <p>{this.state.tipInfo}</p>
                            </Modal>
                        </section>:''}
                </Col>

                <Col span='3'/>
            </Row>
        )
    }
}