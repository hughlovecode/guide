import React from 'react'
import {Modal,Row,Col,Input, Icon,Upload, Button,Alert} from 'antd'
import http from './../../../axios/index'
import Bmob from "hydrogen-js-sdk"
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")

const { TextArea } = Input
export default class ModifyGuide extends React.Component{
    constructor(params){
        super(params)

    }
    componentWillMount(){
        this.setState({
            isVisible:false,
            confirmLoading:false
        })

       
    }
    componentDidMount(){
        http.post('/guide/detail',this.props.location.state.params).then(res=>{
            if(res.status !== '0'){
                this.setState({
                    isVisible:true,
                    modalInfo:'服务器出错,查不到对应数据'
                })
            }else{
                let detail=res.result.guideDetail;
                this.setState({
                    isGetData:true,
                    detail:detail,
                    imageUrl:detail.guideImg,
                    guideId:detail.guideId,
                    guideSN:detail.guideSN,
                    guideName:detail.guideName,
                    guideAddress:detail.guideAddress,
                    guideInfo:detail.guideInfo,
                })
                
            }
        })
        
    }
    clickOk=()=>{
        this.setState({
            isVisible:false
        })
    }
    clickCancel=()=>{ 
        this.setState({
            isVisible:false
        })
    }
    //基本信息
    //上传书本头像
    beforeUpload=(file,fileList)=>{
        let item = Bmob.File(file.name, file);
                item.save().then(res=>{
                   this.setState({
                    imageUrl:res[0].url
                   })
                })
                return Promise.reject()
    }
    setParams=()=>{
        if(this.state.guideName&&this.state.guideId&&this.state.guideSN&&this.state.guideAddress&&this.state.guideInfo&&this.state.imageUrl){
            let params={
                guideId:this.state.guideId,
                guideSN:this.state.guideSN,
                guideName:this.state.guideName,
                guideAddress:this.state.guideAddress,
                guideInfo:this.state.guideInfo,
                guideImg:this.state.imageUrl,
                guiderId:localStorage.getItem('userId'),
                guiderName:localStorage.getItem('userName')
            }
            http.post('/guide/modifyGuide',params).then(res=>{
                if(res.status === '0'){
                    this.setState({
                        isError:false,
                        isSuccess:true,
                        successInfo:'已经修改了旅程'
                    })
                    return Promise.resolve()
                }else if(res.status === '2'){
                    this.setState({
                        isError:true,
                        isSuccess:false,
                        errorInfo:'很抱歉,您修改的数据在表中不存在,请不要修改表中不存在的数据'
                    })
                    return Promise.reject()
                }else{
                    this.setState({
                        isError:true,
                        isSuccess:false,
                        errorInfo:'很抱歉,服务器出错了'
                    })
                }
            })
        }else{
            this.setState({
                isError:true,
                isSuccess:false,
                errorInfo:'请将信息补充完整!'
            })
        }
    }
    getguideName=(e)=>{
        this.setState({
            guideName:e.target.value
        })
    }
    getguideId=(e)=>{
        this.setState({
            guideId:e.target.value
        })
    }
    getguideSN=(e)=>{
        this.setState({
            guideSN:e.target.value
        })
    }
    getguideAddress=(e)=>{
        this.setState({
            guideAddress:e.target.value
        })
    }
    getguideInfo=(e)=>{
        this.setState({
            guideInfo:e.target.value
        })
    }
    toNotice=()=>{
        let params={
            guideId:this.state.detail.guideId,
            guideSN:this.state.detail.guideSN,
            HTitle:this.state.detail.HTitle,
            HContent:this.state.detail.HContent,
            Htime:this.state.detail.Htime,
            guideImg:this.state.detail.guideImg
        }
        console.log(params)
        this.props.history.push({pathname: '/guide/myNotice', state: {params: params}})

    }
    toVisitor=()=>{
        let params={
            guideId:this.state.detail.guideId,
            guideSN:this.state.detail.guideSN
        }
        this.props.history.push({pathname: '/guide/myVisitor', state: {params: params}})
    }
    render(){
        let afterNoData=(<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>no Data</div>)
        const uploadButton = (
        <div>
            <Icon type='plus' />
            <div className="ant-upload-text">上传旅程图像</div>
        </div>
        )
        return(

            <div >
                {this.state.isGetData?
                    <section>
                        <Row>
                            <div style={{float:'right',margin:'20px 30px 0px 0px'}}>
                                <Button style={{marginRight:'20px'}} onClick={this.toNotice}>我的通知</Button>
                                <Button onClick={this.toVisitor}>我的游客</Button>
                            </div>
                        </Row>
                        <Row type='flex'  style={{height:'100%'}}>
                            <Col span={3} ></Col>
                            <Col span={18} >
                                <div style={{display:'flex',margin:'60px 0px 0px 0px'}}>
                                    <section style={{flex:'3'}}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Input addonBefore="旅程名"  placeholder={this.state.detail.guideName} onChange={e=>this.getguideName(e)} />
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <Input addonBefore="旅程号" disabled placeholder={this.state.detail.guideId} onChange={e=>this.getguideId(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <Input addonBefore="序号" disabled placeholder={this.state.detail.guideSN} onChange={e=>this.getguideSN(e)}/>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <Input addonBefore="集合地址"  placeholder={this.state.detail.guideAddress} onChange={e=>this.getguideAddress(e)}/>
                                        </div>
                                    </section>
                                    <section style={{flex:'1',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            beforeUpload={this.beforeUpload}
                                            >
                                            {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{width:'100%',maxHeight:'80px'}}/> : uploadButton}
                                        </Upload>
                                    </section>
                                    
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <TextArea rows={4} placeholder={this.state.detail.guideInfo} onChange={e=>this.getguideInfo(e)}/>
                                </div>
                                <div style={{float:'right'}}>
                                    <Button  onClick={this.setParams}>确定</Button>
                                </div>
                                {this.state.isError?<Alert message={this.state.errorInfo} type="error" style={{marginTop:'66px'}}/>:''}
                                {this.state.isSuccess?<Alert message={this.state.successInfo} type="success" style={{marginTop:'66px'}}/>:''}
                                
                            </Col>
                            <Col span={3}></Col>
                        </Row>
                    </section>
                    :afterNoData}
                <Modal
                    title='警告'
                    visible={this.state.isVisible}
                    onOk={this.clickOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.clickCancel}
                >
                <p>{this.state.modalInfo}</p>
                </Modal>

            </div>

        )
    }
}