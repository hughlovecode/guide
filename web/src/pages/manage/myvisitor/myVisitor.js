import React from 'react'
import {List , Avatar ,Row,Col,Button,Modal,Input,Upload,Icon} from 'antd'
import http from './../../../axios/index'
import Bmob from "hydrogen-js-sdk"
Bmob.initialize("bcca23c72b60e95d2e9bc1dd0916533a", "db4b514fef75e21afaade6481a94c3eb")


export default class MyVisitor extends React.Component{
	constructor(params){
		super(params)
		
	}
	componentWillMount(){
		this.setState({
			isVisible:false,
			studentInfo:{
				studentId:'',
				studentName:'',
				email:'',
				userImg:''
			},
			addVisitorId:''
		})
		console.log('this.props')
		console.log(this.props)
		http.post('/guide/detail',this.props.location.state.params).then(res=>{
            if(res.status !== '0'){
                this.setState({
                    isVisible:true,
                    modalInfo:'服务器出错,查不到对应数据',
                    modalTag:'错误'
                })
            }else{
                let students=res.result.courseDetail.students;
                students.forEach(item=>{
                	let signInCount=item.signInCount;
                	let count=0;
                	let signTag=0;
                	signInCount.forEach(item2=>{
                		if(item2.isSign === 'true'){
                			signTag++
                		}
                		count++
                	})
                	item.count=count;
                	item.signTag=signTag
                })
                this.setState({
                	courseInfo:res.result.courseDetail.courseInfo,
                	courseName:res.result.courseDetail.courseName,
                    students:students,
                    guideId:res.result.courseDetail.guideId,
                    guideSN:res.result.courseDetail.guideSN
                })
                
            }
        })
	}
	detail=e=>{
		console.log(e.target.dataset)
		let studentId=e.target.dataset.studentid;
		let params={
			userId:studentId
		}
		http.post('/userInfo/info',params).then(res=>{
			if(res.status !== '0'){
				console.log(params)
				this.setState({
					isVisible:true,
					modalInfo:'服务器开了小差,请稍后再试',
					modalTag:'错误'
				})
			}else{
				let studentInfo=res.result.info;
				this.setState({
					studentInfo:studentInfo,
					modifyModal:true
				})
			}
		})

	}
	iGotIt=()=>{
		this.setState({
			isVisible2:false
		})
	}
	changeStudentInfo=()=>{
		this.setState({
			confirmLoading:true
		})
	}
	delete=e=>{
		let studentId=e.target.dataset.studentid;
		let params={
			guideId:this.state.guideId,
			guideSN:this.state.guideSN,
			studentId:studentId
		}
		
		http.post('/guide/deleteVisitor',params).then(res=>{
			if(res.status !== '0'){
				throw 'throw on onFulfilled_1'
			}else{
				
				return Promise.resolve()
			}
		}).then(res=>{
			http.post('/userInfo/deleteCourse',params).then(res=>{
				if(res.status !== '0'){
					throw 'throw on onFulfilled_1'
				}else{
					
					return Promise.resolve()
				}
			})
		}).then(res=>{
			this.updateData(params)
		}).catch(err=>{
			console.log(err)
			this.setState({
				isVisible:true,
				modalInfo:'出错了呢,请稍后再试',
				modalTag:'错误'			
			})
		})
	}
	updateData=(params)=>{
		http.post('/guide/detail',params).then(res=>{
            if(res.status !== '0'){
                this.setState({
                    isVisible:true,
                    modalInfo:'服务器出错,查不到对应数据',
                    modalTag:'错误'
                })
                
            }else{
                let students=res.result.courseDetail.students;
                students.forEach(item=>{
                	let signInCount=item.signInCount;
                	let count=0;
                	let signTag=0;
                	signInCount.forEach(item2=>{
                		if(item2.isSign === 'true'){
                			signTag++
                		}
                		count++
                	})
                	item.count=count;
                	item.signTag=signTag
                })
                this.setState({
                    students:students,
                    guideId:res.result.courseDetail.guideId,
                    guideSN:res.result.courseDetail.guideSN,
                    isVisible:true,
                    modalTag:'成功',
                    modalInfo:'恭喜你,更新成功'

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
	addVisitor=()=>{
		this.setState({
			isVisible2:true
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
	getStudentName=e=>{
		let studentInfo=this.state.studentInfo;
		studentInfo.userName=e.target.value
		this.setState({
			studentInfo:studentInfo
		})
	}
	
	getEmail=e=>{
		let studentInfo=this.state.studentInfo;
		studentInfo.email=e.target.value
		this.setState({
			studentInfo:studentInfo
		})
	}
	clickCancelModify=()=>{
		this.setState({
			modifyModal:false,
		})
	}
	modifyStudentInfo=()=>{
		if(this.state.studentInfo.userId===''||this.state.studentInfo.userName===''||this.state.studentInfo.email===''||this.state.studentInfo.userImg===''){
			console.log(this.state)
			this.setState({
				isVisible:true,
				modifyModal:false,
				modalTag:'警告',
				modalInfo:'请将信息补充完整',
			})
		}else{
			let params=this.state.studentInfo;
			http.post('/userInfo/modify',params).then(res=>{
				if(res.status !=='0'){
					throw res.msg
				}else{
					let params2={
						guideId:this.state.guideId,
						guideSN:this.state.guideSN,
					}
					this.setState({
						modifyModal:false
					})
					this.updateData(params2)

				}
			}).catch(err=>{
				this.setState({
					isVisible:true,
					modifyModal:false,
					modalTag:'报错',
					modalInfo:err,
				})
			})
		}
	}
	getAddVisitorId=e=>{
		this.setState({
			addVisitorId:e.target.value
		})
	}
	
	uploadVisitorInfo=()=>{
		if(this.state.addVisitorId===''){
			this.setState({
				isVisible:true,
				isVisible2:false,
				modalTag:'警告',
				modalInfo:'请将信息补充完整',
			})
		}else{
			let params={
				userId:this.state.addVisitorId,
				guideId:this.state.guideId,
				guideSN:this.state.guideSN,
				courseInfo:this.state.courseInfo,
				courseName:this.state.courseName,
			}
			http.post('/userInfo/addVisitor',params).then(res=>{
				console.log('ress:')
				console.log(res)
				if(res.status !== '0'){
					this.setState({
						isVisible2:false,
						isVisible:true,
						modalInfo:res.msg,
						modalTag:'错误'

					})
				}else{
					this.setState({
					isVisible2:false
					})
					this.updateData(params)
					
				}
			})
		}
	}
	render(){
		let students=this.state.students
		const uploadButton = (
	      <div>
	        <Icon type='plus' />
	        <div className="ant-upload-text">上传旅程图像</div>
	      </div>
	    );
		return(
			<div>
				<Row>
					<Button style={{float:'right',margin:'20px 130px'}} onClick={this.addVisitor}>添加游客</Button>
				</Row>
				<Row >
					<Col span={3}></Col>
					<Col span={18} style={{margin:'30px 0px'}}>
						<List 
							itemLayout="horizontal"
							dataSource={students}
							renderItem={item => (
						      <List.Item>
						        <List.Item.Meta
						          avatar={<Avatar src={item.studentImg} />}
						          title={item.studentName}
						          description={"该游客一共签到了"+item.signTag+"次,总共"+item.count+"次!"}
						        />
						        <Button data-studentid={item.studentId} onClick={e=>this.delete(e)} style={{marginRight:'20px'}}>删除</Button>
						        <Button data-studentid={item.studentId} onClick={e=>this.detail(e)}>详情</Button>
						      </List.Item>
						    )}
						/>
					</Col>
					<Col span={3}></Col>
					<Modal
                    title={this.state.modalTag}
                    visible={this.state.isVisible}
                    onCancel={this.clickCancel}
                    footer={[
                    		<Button onClick={this.clickOk} key='3'>确认</Button>
                    	]}
                >
                <p>{this.state.modalInfo}</p>
                </Modal>
                <Modal
                    title="添加游客"
                    visible={this.state.isVisible2}
                    onCancel={this.iGotIt}
                    footer={[
                    	    <Button onClick={this.iGotIt} key='1'>取消</Button>,
                    		<Button onClick={this.uploadVisitorInfo} key='0'>确认</Button>
                    	]}
                >
                <Row>
                	<Col span={4}></Col>
                	<Col span={16}>
                		<div style={{ marginBottom: 16 }}>
						   <Input addonBefore="id:" onChange={e=>this.getAddVisitorId(e)} value={this.state.addVisitorId} placegolder='请输入游客id'/>
						</div>
                	</Col>
                	<Col span={4}></Col>
                </Row>
                </Modal>
                <Modal
                    title="游客信息"
                    visible={this.state.modifyModal}
                    onCancel={this.clickCancelModify}
                    footer={[
                    		<Button onClick={this.clickCancelModify} key='1'>知道了</Button>,
                    		<Button onClick={this.modifyStudentInfo} key='0'>修改</Button>
                    	]}
                >
                <section>
                	<Row>
                		<Col span={18}>
                			<div style={{ marginBottom: 16 }}>
						      <Input addonBefore="id:" disabled onChange={e=>this.getStudentId(e)} value={this.state.studentInfo.userId}/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <Input addonBefore="电话:" disabled value={this.state.studentInfo.userPhone}/>
						    </div>
                			<div style={{ marginBottom: 16 }}>
						      <Input addonBefore="姓名:"   onChange={e=>this.getStudentName(e)} value={this.state.studentInfo.userName}/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <Input addonBefore="邮箱:"  onChange={e=>this.getEmail(e)} value={this.state.studentInfo.email}/>
						    </div>
                		</Col>	
                		<Col span={6} style={{padding:'15px'}}>
                			<Upload
        						name="avatar"
        						listType="picture-card"
        						className="avatar-uploader"
        						showUploadList={false}
        						beforeUpload={this.beforeUpload}
      							>
        						<img src={this.state.studentInfo.userImg} alt="avatar" style={{width:'100%',maxHeight:'80px'}}/> 
      						</Upload>
                		</Col>	
                	</Row>
                	
                </section>
                </Modal>
				</Row>
			</div>	
			)
	}
}