import React from 'react'
import {Row,Col,Input, Select, Icon,Upload,message,Button,Alert} from 'antd'
import http from './../../axios/index'
import './login.styl'
import Bmob from "hydrogen-js-sdk"
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")
const Option = Select.Option;
export default class Login extends React.Component{
    constructor(){
        super();
        this.state={
            switchIndex:true,
            registerId:'',
            registerName:'',
            registerPassword:'',
            againPassword:'',
            registerEmail:'',
            selectOption:'@qq.com',
            imageUrl:'',
            isShowTip:false,
            tipMessage:'',
            tipDescription:'',
            tipType:'error',
            smsCode:'',
            registerPhone:'',
            isShowSmsCode:false,
            registerStatus:'学生',
            loginUserId:'',
            loginPassword:'',
            loginSmsCode:'',
            loginPhone:'',
            isChangeLogin:false,
            isShowLoginTip:false,
            isShowInputSmsCode:false
        }
    }
    componentWillMount(){
        this.setState({
            show1:this.state.switchIndex?'block':'none',
            show2:!this.state.switchIndex?'block':'none',
        })
        //storage,判断能否跳过登录
        if(window.localStorage.getItem('userId')!=null&&window.localStorage.getItem('userId').length>0){
            this.props.history.push('/Info/myInfo')
        }

    }
    switch1=()=>{
        this.setState({
            show1:'block',
            show2:'none',
            switchIndex:true
        })
    }
    switch2=()=>{
        this.setState({
            show1:'none',
            show2:'block',
            switchIndex:false
        })
    }
    
    loginByNormal=()=>{
        var that=this
        if(this.state.loginUserId===''||this.state.loginPassword===''){
            this.setState({
                isShowLoginTip:true,
                tipMessage:'错误',
                tipDescription:"请将用户id和密码填写完整",
                tipType:'error'
            })
        }else{
            if(!window.localStorage){
                this.setState({
                    isShowLoginTip:true,
                    tipMessage:'错误',
                    tipDescription:'你的浏览器不支持loaclstorage,请使用chrome',
                    tipType:'error'
                })
            }else{
                //登录过程
                http.post('/userInfo/login',{
                    userId:that.state.loginUserId+'',
                    password:that.state.loginPassword
                }).then((res)=>{
                    if(res.status==='1'){
                        this.setState({
                        isShowLoginTip:true,
                        tipMessage:'错误',
                        tipDescription:'用户名或者密码错误',
                        tipType:'error'
                    })
                    }else if(res.status==='2'){
                        console.log(res)
                        this.setState({
                        isShowLoginTip:true,
                        tipMessage:'错误',
                        tipDescription:'请先注册',
                        tipType:'error'
                    })
                    }else{
                        

                        if(res.result.userInfo.status !=='t'){
                                this.setState({
                                isShowLoginTip:true,
                                tipMessage:'错误',
                                tipDescription:'学生用户现只允许注册,该系统现只开放给老师使用,请联系您的课程老师进行相关操作',
                                tipType:'error'
                            })
                        }else{
                            //alert(res.result.userInfo)
                            let storage=window.localStorage;
                            //将基础信息存到localstorage中
                            storage.setItem('userId',res.result.userInfo.userId)
                            storage.setItem('userName',res.result.userInfo.userName)
                            storage.setItem('userImg',res.result.userInfo.userImg)
                            window.location.href='/Info/myInfo'
                        }

                    }
                })
            }
            //return <Redirect to='/Info/myInfo'/>

        }
    }
    loginSendCode=()=>{
        var that=this
        if(this.state.loginPhone===''){
                this.setState({
                    isShowLoginTip:true,
                    tipMessage:'错误',
                    tipDescription:"请将电话号码填写完整",
                    tipType:'error'
                })
        }else{
            let phone_params = {
                    mobilePhoneNumber: this.state.loginPhone+'' //string
                }
                Bmob.requestSmsCode(phone_params).then(function (response) {
                    console.log(response);
                    that.setState({
                        isShowInputSmsCode:true,
                        isShowLoginTip:true,
                        tipMessage:'提示',
                        tipDescription:"短信已发送,请将收到的数字写入下面的框内,并随后点击登录",
                        tipType:'info'
                    })
                })
                .catch(function (error) {
                    console.log(error)
                    that.setState({
                        isShowTip:true,
                        tipType:'error',
                        tipDescription:'短信发送失败,'+error.error,
                        tipMessage:'错误',
                        isShowInputSmsCode:false
                    })  
                });
        }
    }
    loginByPhone=()=>{
        var that=this
        if(this.state.loginSmsCode===''||this.state.loginPhone===''){
            console.log(this.state)
            that.setState({
                isShowTip:true,
                tipType:'error',
                tipDescription:'信息不完整,请重新填写',
                tipMessage:'错误',
            }) 
        }else{
                let smsCode=this.state.loginSmsCode+''
                let data = {
                  mobilePhoneNumber: this.state.loginPhone+''
                }
                let params={
                    userPhone: this.state.loginPhone+''
                }
                Bmob.verifySmsCode(smsCode, data).then(function (response) {
                    console.log(response);
                    http.post('/userInfo/loginByPhone',params).then(res=>{
                        if(res.status==='0'){
                            if(res.result.userInfo.status !=='t'){
                                    this.setState({
                                    isShowLoginTip:true,
                                    tipMessage:'错误',
                                    tipDescription:'学生用户现只允许注册,该系统现只开放给老师使用,请联系您的课程老师进行相关操作',
                                    tipType:'error'
                                })
                            }else{
                                //alert(res.result.userInfo)
                                let storage=window.localStorage;
                                //将基础信息存到localstorage中
                                storage.setItem('userId',res.result.userInfo.userId)
                                storage.setItem('userName',res.result.userInfo.userName)
                                storage.setItem('userImg',res.result.userInfo.userImg)
                                window.location.href='/Info/myInfo'
                            }
                        }else{
                            console.log(res)
                            //注册失败的各种情况
                            that.setState({
                                isShowTip:true,
                                tipType:'error',
                                tipDescription:'服务器错误,'+res.msg,
                                tipMessage:'错误',
                            })
                        }
                    }).catch(err=>{
                        console.log(err)
                        that.setState({
                            isShowTip:true,
                            tipType:'error',
                            tipDescription:'服务器错误,请稍后再试',
                            tipMessage:'错误',
                            isShowSmsCode:true
                        })
                    })
                })
                .catch(function (error) {
                    console.log(error);
                    that.setState({
                        isShowTip:true,
                        tipType:'error',
                        tipDescription:'验证码错误',
                        tipMessage:'错误信息',
                    })
                });

        }
    }
    setRegisterId=e=>{
        this.setState({
            registerId:e.target.value
        })
    }
    setRegisterName=e=>{
        this.setState({
            registerName:e.target.value
        })
    }
    setRegisterPassword=e=>{
        this.setState({
            registerPassword:e.target.value
        })
    }
    setAgainPassword=e=>{
        this.setState({
            againPassword:e.target.value
        })
    }
    setRegisterEmail=e=>{
        this.setState({
            registerEmail:e.target.value
        })
    }
    setSmsCode=e=>{
        this.setState({
            smsCode:e.target.value
        })
    }
    setRegisterPhone=e=>{
        this.setState({
            registerPhone:e.target.value
        })
    }
    setLoginUserId=e=>{
        this.setState({
            loginUserId:e.target.value
        })
    }
    setLoginPassword=e=>{
        this.setState({
            loginPassword:e.target.value
        })
    }
    setLoginPhone=e=>{
        this.setState({
            loginPhone:e.target.value
        })
    }
    handleChange=(value)=> {
        this.setState({
            selectOption:`selected ${value}`
        })
    }
    getRegisterStatus=(value)=>{
        this.setState({
            registerStatus:`selected ${value}`
        })
    }
    setLoginSmsCode=e=>{
        this.setState({
            loginSmsCode:e.target.value
        })
    }
    beforeUpload=(file,fileList)=>{
        let item = Bmob.File(file.name, file);
                item.save().then(res=>{
                   this.setState({
                    imageUrl:res[0].url
                   })
                })
                return Promise.reject()
    }
    changeLogin=()=>{
        this.setState({
            isChangeLogin:!this.state.isChangeLogin
        })
    }
    beforeRegister=()=>{
        var that=this
        if(this.state.registerId===''||this.state.registerName===''||this.state.registerPassword===''||this.state.registerEmail===''||this.state.againPassword===''||this.state.imageUrl===''||this.state.registerPhone===''||this.state.registerStatus===''){
          //if(false){
            this.setState({
                isShowTip:true,
                tipType:'error',
                tipDescription:'请将信息补充完整',
                tipMessage:'提示'
            })
        }else{
            var reg = /^[0-9a-zA-Z]+$/
            var str=this.state.registerEmail;
            if(!reg.test(str)){
                    this.setState({
                    isShowTip:true,
                    tipType:'error',
                    tipDescription:'邮箱格式不正确,请输入数字或者字母,并选择合适的邮箱后缀(qq,gmail或者163)',
                    tipMessage:'提示'
                })
            }else if(this.state.registerPassword !== this.state.againPassword){
                this.setState({
                    isShowTip:true,
                    tipType:'error',
                    tipDescription:'两次密码不匹配',
                    tipMessage:'提示'
                })
            }else{
                let status='s'
                if(this.state.registerStatus==='教师'){
                    status='t'
                }
                let params={
                    status:status,
                    userId:this.state.registerId+'',
                    userName:this.state.registerName,
                    password:this.state.registerPassword,
                    email:this.state.registerEmail+ this.state.selectOption,
                    userImg:this.state.imageUrl,
                    userPhone:this.state.registerPhone
                }
                this.setState({
                    registerParams:params
                })
                let phone_params = {
                    mobilePhoneNumber: this.state.registerPhone+'' //string
                }
                Bmob.requestSmsCode(phone_params).then(function (response) {
                    console.log(response);
                    that.setState({
                        isShowTip:true,
                        tipType:'info',
                        tipDescription:'短信已发送,收到后,请填写到下方的框中,并点击注册',
                        tipMessage:'提示',
                        isShowSmsCode:true
                    })
                })
                .catch(function (error) {
                    console.log(error)
                    that.setState({
                        isShowTip:true,
                        tipType:'error',
                        tipDescription:'短信发送失败,'+error.error,
                        tipMessage:'错误',
                        isShowSmsCode:false
                    })  
                });

            }
        }
    }
    register=()=>{
        var that=this
        if(this.state.smsCode===''){
            this.setState({
                isShowTip:true,
                tipType:'error',
                tipDescription:'输入为空,请重新填写',
                tipMessage:'错误',
                isShowSmsCode:true
            })
        }else{
            let smsCode=this.state.smsCode+''
            let data = {
              mobilePhoneNumber: this.state.registerPhone+''
            }
            Bmob.verifySmsCode(smsCode, data).then(function (response) {
                console.log(response);
                http.post('/userInfo/register',that.state.registerParams).then(res=>{
                    console.log(that.state.registerParams)
                    if(res.status==='0'){
                        that.setState({
                            isShowTip:true,
                            tipType:'success',
                            tipDescription:'注册成功,请返回登录',
                            tipMessage:'提示',
                            isShowSmsCode:true
                        })
                    }else{
                        console.log(res)
                        //注册失败的各种情况
                        that.setState({
                            isShowTip:true,
                            tipType:'error',
                            tipDescription:'服务器错误,'+res.msg,
                            tipMessage:'错误',
                            isShowSmsCode:true
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                    that.setState({
                        isShowTip:true,
                        tipType:'error',
                        tipDescription:'服务器错误,请稍后再试',
                        tipMessage:'错误',
                        isShowSmsCode:true
                    })
                })
            })
            .catch(function (error) {
                console.log(error);
                that.setState({
                    isShowTip:true,
                    tipType:'error',
                    tipDescription:'验证码错误',
                    tipMessage:'错误信息',
                    isShowSmsCode:true
                })
            });
        }
    } 
    render(){
        var style1={
            display:this.state.show1
        }
        var style2={
            display:this.state.show2
        }
        var style3={
            borderBottom:this.state.switchIndex?'2px solid black':'2px',
            marginRight:'20px'
        }
        var style4={
            borderBottom:!this.state.switchIndex?'2px solid black':'2px',
        }
        const selectAfter=(
                  <Select defaultValue="@qq.com" style={{ width: 80 }} onChange={this.handleChange}>
                    <Option value="@gmail.com">@gmail.com</Option>
                    <Option value="@163.com">@163.com</Option>
                    <Option value="@qq.com">@qq.com</Option>
                  </Select>
            )  
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
          </div>
        ); 
         


        return(
            <div className='back' >
            <Row className='back2'>
                <Col span='14'></Col>
                <Col span='10' className='login' >
                    <div className='LoginDiv' style={{height:'auto',paddingBottom:'30px'}}>
                        <Row className='SwitchBox'>
                            <Row className='tips'>
                                <Col span='2'/>
                                <Col span='22'>
                                    <span onClick={this.switch1} style={style3} >登录</span>
                                    <span onClick={this.switch2} style={style4} >注册</span>
                                </Col>
                            </Row>
                            <Row className='LoginInfo' style={style1}>
                                <Col span='2'/>
                                <Col span='20' >
                                    <Row>
                                        {this.state.isChangeLogin?
                                        <Row>
                                            <Row>
                                            <Col span={16}>
                                                <div style={{ marginBottom: 16 }}>
                                                  <Input addonBefore="手机号" value={this.state.loginPhone} placeholder='请输入您的手机号' type="number" onChange={e=>this.setLoginPhone(e)}/>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <Button key='4' onClick={this.loginSendCode} style={{float:'right'}}>发送</Button>
                                            </Col>
                                            </Row>
                                            {this.state.isShowInputSmsCode?
                                                    <Row>
                                                        <Col span={16}>
                                                            <div style={{ marginBottom: 16 }}>
                                                              <Input addonBefore="验证码" value={this.state.loginSmsCode} placeholder='请输入您的验证码' type="number" onChange={e=>this.setLoginSmsCode(e)}/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                :''}
                                        </Row>:
                                        <section>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="用户id" value={this.state.loginUserId} placeholder='请输入您的用户id' type="number" onChange={e=>this.setLoginUserId(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="密码" value={this.state.loginPassword} placeholder='请再次输入您的密码' type="password" onChange={e=>this.setLoginPassword(e)}/>
                                        </div>
                                        </section>
                                    }
                                        {this.state.isShowLoginTip?
                                            <Alert
                                              style={{marginBottom: 16 }}
                                              message={this.state.tipMessage}
                                              description={this.state.tipDescription}
                                              type={this.state.tipType}
                                              showIcon
                                            />
                                            :''
                                        }
                                    </Row>
                                    <Row>
                                        您可以通过{this.state.isChangeLogin?
                                            <span style={{fontWeight:'900',color:'blue'}} onClick={this.changeLogin}>账号</span>:
                                            <span style={{fontWeight:'900',color:'blue'}} onClick={this.changeLogin}>手机</span>}登录
                                        <Button key='222' onClick={this.state.isChangeLogin?this.loginByPhone:this.loginByNormal} style={{float:'right'}}>登录</Button>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className='RegisterInfo' style={style2}>
                                <Col span='2'/>
                                <Col span='20' >
                                    <Row>
                                        <Col span={16}>
                                            <Select defaultValue="学生" style={{ marginBottom: 16,width:'80px' }} onChange={this.getRegisterStatus}>
                                              <Option value="教师">教师</Option>
                                              <Option value="学生">学生</Option>
                                            </Select>
                                            <div style={{ marginBottom: 16}}>
                                              <Input addonBefore="学号" type="number" value={this.state.registerId} placeholder='请输入您的学生号/教师号' onChange={e=>this.setRegisterId(e)}/>
                                            </div>
                                            <div style={{ marginBottom: 16 }}>
                                              <Input addonBefore="姓名" value={this.state.registerName} placeholder='请输入您的姓名' onChange={e=>this.setRegisterName(e)}/>
                                            </div>
                                        </Col>
                                        <Col span={8} style={{display:'flex',justifyContent:'flex-end'}}>
                                             <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                beforeUpload={this.beforeUpload}
                                              >
                                                {this.state.imageUrl ? <img src={this.state.imageUrl} alt="头像" style={{width:'100%',maxHeight:'80px'}}/> : uploadButton}
                                              </Upload>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="邮箱" addonAfter={selectAfter} value={this.state.registerEmail} placeholder='请输入您的邮箱' onChange={e=>this.setRegisterEmail(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="手机" value={this.state.registerPhone} placeholder='请输入您的手机号' type="number" onChange={e=>this.setRegisterPhone(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="密码" value={this.state.registerPassword} placeholder='请输入您的密码' type="password" onChange={e=>this.setRegisterPassword(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                          <Input addonBefore="重复密码" value={this.state.againPassword} placeholder='请再次输入您的密码' type="password" onChange={e=>this.setAgainPassword(e)}/>
                                        </div>
                                        {this.state.isShowTip?
                                            <Alert
                                            style={{marginBottom:16}}
                                              message={this.state.tipMessage}
                                              description={this.state.tipDescription}
                                              type={this.state.tipType}
                                              showIcon
                                            />
                                            :''
                                        }
                                    </Row>
                                    {this.state.isShowSmsCode?
                                        <Row> 
                                            <Col span={16}>
                                                <div style={{ marginBottom: 16 }}>
                                                  <Input addonBefore="验证码" value={this.state.smsCode} placeholder='请输入您收到的验证码' type="number" onChange={e=>this.setSmsCode(e)}/>
                                                </div>
                                            </Col> 
                                            <Col span={2}></Col>   
                                            <Col span={4}><Button key='2' onClick={this.register}>提交验证码</Button></Col>
                                            <Col span={2}></Col>   
                                        </Row>        
                                    :''}
                                    <Row>
                                        {!this.state.isShowSmsCode?
                                            <Button key='0' onClick={this.beforeRegister} style={{float:'right'}}>确定</Button>
                                            :''
                                        }
                                    </Row>
                                    
                                </Col>
                                <Col span='2'/>
                            </Row>
                        </Row>
                    </div>
                </Col>
            </Row>
            </div>
        )
    }
}