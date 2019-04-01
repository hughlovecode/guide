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
			touristInfo:{
				userId:'',
				touristName:'',
				email:'',
				userImg:''
			},
			addVisitorId:''
		})
		http.post('/guide/detail',this.props.location.state.params).then(res=>{
            if(res.status !== '0'){
                this.setState({
                    isVisible:true,
                    modalInfo:'服务器出错,查不到对应数据',
                    modalTag:'错误'
                })
            }else{
                let tourists=res.result.guideDetail.tourists;
                console.log('tourists:')
                console.log(tourists)
                tourists.forEach(item=>{
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
                	guideInfo:res.result.guideDetail.guideInfo,
                	guideName:res.result.guideDetail.guideName,
                    tourists:tourists,
                    guideId:res.result.guideDetail.guideId,
                    guideSN:res.result.guideDetail.guideSN
                })
                
            }
        })
	}
	detail=e=>{
		console.log(e.target.dataset)
		let touristId=e.target.dataset.touristid;
		let params={
			userId:touristId
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
				let touristInfo=res.result.info;
				console.log('touristInfo')
				console.log(touristInfo)
				this.setState({
					touristInfo:touristInfo, 
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
	changeTouristInfo=()=>{
		this.setState({
			confirmLoading:true
		})
	}
	delete=e=>{
		let touristId=e.target.dataset.touristId;
		let params={
			guideId:this.state.guideId,
			guideSN:this.state.guideSN,
			touristId:touristId
		}
		
		http.post('/guide/deleteVisitor',params).then(res=>{
			if(res.status !== '0'){
				throw 'throw on onFulfilled_1'
			}else{
				
				return Promise.resolve()
			}
		}).then(res=>{
			http.post('/userInfo/deleteGuide',params).then(res=>{
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
                let tourists=res.result.guideDetail.tourists;
                tourists.forEach(item=>{
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
                    tourists:tourists,
                    guideId:res.result.guideDetail.guideId,
                    guideSN:res.result.guideDetail.guideSN,
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
	getTouristName=e=>{
		let touristInfo=this.state.touristInfo;
		touristInfo.userName=e.target.value
		this.setState({
			touristInfo:touristInfo
		})
	}
	
	getEmail=e=>{
		let touristInfo=this.state.touristInfo;
		touristInfo.email=e.target.value
		this.setState({
			touristInfo:touristInfo
		})
	}
	clickCancelModify=()=>{
		this.setState({
			modifyModal:false,
		})
	}
	modifyTouristInfo=()=>{
		if(this.state.touristInfo.userId===''||this.state.touristInfo.userName===''||this.state.touristInfo.email===''||this.state.touristInfo.userImg===''){
			console.log(this.state)
			this.setState({
				isVisible:true,
				modifyModal:false,
				modalTag:'警告',
				modalInfo:'请将信息补充完整',
			})
		}else{
			let params=this.state.touristInfo;
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
				guideInfo:this.state.guideInfo,
				guideName:this.state.guideName,
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
		let tourists=this.state.tourists
		console.log(tourists)
		console.log('tourists')
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
							dataSource={tourists}
							renderItem={item => (
						      <List.Item>
						        <List.Item.Meta
						          avatar={<Avatar src={item.guideImg} />}
						          title={item.guideName}
						          description={"该游客一共签到了"+item.signTag+"次,总共"+item.count+"次!"}
						        />
						        <Button data-touristId={item.touristId} onClick={e=>this.delete(e)} style={{marginRight:'20px'}}>删除</Button>
						        <Button data-touristId={item.touristId} onClick={e=>this.detail(e)}>详情</Button>
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
                    		<Button onClick={this.modifyTouristInfo} key='0'>修改</Button>
                    	]}
                >
                <section>
                	<Row>
                		<Col span={18}>
                			<div style={{ marginBottom: 16 }}>
						      <Input addonBefore="id:" disabled onChange={e=>this.gettouristId(e)} value={this.state.touristInfo.userId}/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <Input addonBefore="电话:" disabled value={this.state.touristInfo.userPhone}/>
						    </div>
                			<div style={{ marginBottom: 16 }}>
						      <Input addonBefore="姓名:"   onChange={e=>this.getTouristName(e)} value={this.state.touristInfo.userName}/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <Input addonBefore="邮箱:"  onChange={e=>this.getEmail(e)} value={this.state.touristInfo.email}/>
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
        						<img src={this.state.touristInfo.userImg} alt="avatar" style={{width:'100%',maxHeight:'80px'}}/> 
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