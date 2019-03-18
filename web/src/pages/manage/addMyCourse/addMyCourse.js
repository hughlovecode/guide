import React from 'react'
import { Row,Col,Input, Icon,Upload, Button,Alert } from 'antd'
import http from "../../../axios";
import Bmob from "hydrogen-js-sdk"
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")
const { TextArea } = Input
//上传书本头像

export default class AddMyCourse extends React.Component{
	componentWillMount(){
		this.setState({
			isError:false,
			isSuccess:false,
			successInfo:'录入成功',
			errorInfo:'出错了',
			imageUrl:'',
			courseName:'',
			courseId:'',
			courseSN:'',
			classAddress:'',
			courseInfo:''
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
		if(this.state.courseName&&this.state.courseId&&this.state.courseSN&&this.state.classAddress&&this.state.courseInfo&&this.state.imageUrl){
			let params={
				courseId:this.state.courseId,
				courseSN:this.state.courseSN,
				courseName:this.state.courseName,
				classAddress:this.state.classAddress,
				courseInfo:this.state.courseInfo,
				courseImg:this.state.imageUrl,
				teacherId:localStorage.getItem('userId'),
				teacherName:localStorage.getItem('userName')
			}
			http.post('/course/addCourse',params).then(res=>{
				if(res.status === '0'){
					this.setState({
						isError:false,
						isSuccess:true,
						successInfo:'已经创建了新的课程'
					})
					return Promise.resolve()
				}else if(res.status === '2'){
					this.setState({
						isError:true,
						isSuccess:false,
						errorInfo:'很抱歉,您创建的课程在表中已经存在,请创建表中不存在的课程'
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
			}).then(res=>{
				let params2={
					userId:localStorage.getItem('userId'),
					courseId:this.state.courseId,
					courseSN:this.state.courseSN,
					courseName:this.state.courseName,
					courseInfo:this.state.courseInfo
				}
				http.post('/userInfo/addCourse',params2).then(res=>{
					if(res.status !== '0'){
						this.setState({
						isError:true,
						isSuccess:false,
						errorInfo:'很抱歉,用户出错了'
					})
					}
				})
			})
		}else{
			this.setState({
				isError:true,
				isSuccess:false,
				errorInfo:'请将信息补充完整!'
			})
		}
	}
	getCourseName=(e)=>{
		this.setState({
			courseName:e.target.value
		})
	}
	getCourseId=(e)=>{
		this.setState({
			courseId:e.target.value
		})
	}
	getCourseSN=(e)=>{
		this.setState({
			courseSN:e.target.value
		})
	}
	getClassAddress=(e)=>{
		this.setState({
			classAddress:e.target.value
		})
	}
	getCourseInfo=(e)=>{
		this.setState({
			courseInfo:e.target.value
		})
	}
    render(){
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">上传课程图像</div>
      </div>
    );	
        return(
            <Row type='flex'  style={{height:'100%'}}>
            	<Col span={3}></Col>
            	<Col span={18} style={{margin:'60px 0px'}}>
            		
            		<div style={{display:'flex'}}>
            			<section style={{flex:'3'}}>
            				<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="课程名"  placeholder="请输入课程名" onChange={e=>this.getCourseName(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="课程号"  placeholder="请输入课程号" onChange={e=>this.getCourseId(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="课序号"  placeholder="请输入课序号" onChange={e=>this.getCourseSN(e)}/>
    						</div>
    						<div style={{ marginBottom: 16 }}>
      							<Input addonBefore="教室地址"  placeholder="请输入教室地址" onChange={e=>this.getClassAddress(e)}/>
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
      					<TextArea rows={4} placeholder='请输入一些课程基本信息' onChange={e=>this.getCourseInfo(e)}/>
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