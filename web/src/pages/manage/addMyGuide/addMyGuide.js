import React from 'react'
import { Row,Col,Input, Icon,Upload, Button,Alert } from 'antd'
import http from "../../../axios";
import Bmob from "hydrogen-js-sdk"
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")
const { TextArea } = Input
//上传书本头像

export default class AddMyGuide extends React.Component{
	componentWillMount(){
		this.setState({
			isError:false,
			isSuccess:false,
			successInfo:'录入成功',
			errorInfo:'出错了',
			imageUrl:'',
			guideName:'',
			guideId:'',
			guideSN:'',
			guideAddress:'',
			guideInfo:''
		})
	}
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
			http.post('/guide/addGuide',params).then(res=>{
				if(res.status === '0'){
					this.setState({
						isError:false,
						isSuccess:true,
						successInfo:'已经创建了新的旅程'
					})
					return Promise.resolve()
				}else if(res.status === '2'){
					this.setState({
						isError:true,
						isSuccess:false,
						errorInfo:'很抱歉,您创建的旅程在表中已经存在,请创建表中不存在的旅程'
					})
					return Promise.reject()
				}else{
					this.setState({
						isError:true,
						isSuccess:false,
						errorInfo:'很抱歉,服务器出错了'
					})
					return Promise.reject()
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
    render(){
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">上传旅程图像</div>
      </div>
    );	
        return(
            <Row type='flex'  style={{height:'100%'}}>
            	<Col span={3}></Col>
            	<Col span={18} style={{margin:'60px 0px'}}>
            		
            		<div style={{display:'flex'}}>
            			<section style={{flex:'3'}}>
            				<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="旅程名"  placeholder="请输入旅程名" onChange={e=>this.getguideName(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="旅程号"  placeholder="请输入旅程号" onChange={e=>this.getguideId(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="序号"  placeholder="请输入序号" onChange={e=>this.getguideSN(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="出发点"  placeholder="请输入出发点" onChange={e=>this.getguideAddress(e)}/>
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
      					<TextArea rows={4} placeholder='请输入一些旅程基本信息' onChange={e=>this.getguideInfo(e)}/>
    				</div>
    				<div style={{float:'right'}}>
    					<Button  onClick={this.setParams}>确定</Button>
    				</div>
    				{this.state.isError?<Alert message={this.state.errorInfo} type="error" style={{marginTop:'66px'}}/>:''}
    				{this.state.isSuccess?<Alert message={this.state.successInfo} type="success" style={{marginTop:'66px'}}/>:''}
    				
            	</Col>
            	<Col span={3}></Col>
            </Row>
        )
    }
}