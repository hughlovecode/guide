import React from 'react'
import { Row,Col,Button,List,Avatar,Input,Modal} from 'antd'
import Util from './../../../util/util'
import http from './../../../axios/index'
const { TextArea } = Input
export default class MyNotice extends React.Component{
	constructor(props){
        super(props)
        this.state={
            isShowList:false,
            courseImg:this.props.location.state.params.courseImg,
            newNoticeTitle:'',
            newNoticeContent:'',
            sysTime:Util.formateDate(new Date().getTime()),
            noticeList:[]
        }

    }
    componentDidMount(){
        let params={
            courseId:this.props.location.state.params.courseId,
            courseSN:this.props.location.state.params.courseSN
        }
        http.post('/guide/detail',params).then(res=>{
            if(res.status!=='0'){
                this.setState({
                    isShowTip:true,
                    tipInfo:'错误:'+res.msg
                })
            }else{
                this.setState({
                    noticeList:res.result.courseDetail.notice
                })
            }
        })
    }
    setNoticeTitle=e=>{
    	this.setState({
    		newNoticeTitle:e.target.value
    	})
    }
    setNoticeContent=e=>{
    	this.setState({
    		newNoticeContent:e.target.value
    	})
    }
    handleCancel=()=>{
    	this.setState({
    		isShowTip:false
    	})
    }
    clickCancelAddModal=()=>{
    	this.setState({
    		isShowAddModal:false
    	})
    }
    clickAdd=()=>{
    	var that=this
    	if(this.state.newNoticeContent===''||this.state.newNoticeTitle===''){
    		this.setState({
    			isShowAddModal:false,
    			isShowTip:true,
    			tipInfo:'请填写完整哦!'
    		})
    	}else{
            let newItem={
                title:this.state.newNoticeTitle,
                time:this.state.sysTime,
                content:this.state.newNoticeContent
            }
    		let params={
    			courseId:this.props.location.state.params.courseId,
    			courseSN:this.props.location.state.params.courseSN,
    			title:this.state.newNoticeTitle,
                time:this.state.sysTime,
                content:this.state.newNoticeContent
            }
    		console.log(params)
            console.log('params:')
    		http.post('/guide/addNotice',params).then(res=>{
    			if(res.status !== '0'){
                    that.setState({
                        isShowAddModal:false,
                        isShowTip:true,
                        tipInfo:'添加失败!'+res.msg
                    })
    			}else{
    				that.setState({
    					noticeList:res.res,
    					isShowAddModal:false,
    					isShowTip:true,
    					tipInfo:'添加成功!'
    				})
    				return Promise.resolve()
    			}
    		})
    	}
    }
    addNotice=()=>{
    	this.setState({
    		isShowAddModal:true
    	})
    }
	render(){
		return(
				<div>
					<Row>
						<Button style={{float:'right',margin:'20px 130px'}} onClick={this.addNotice}>添加通知</Button>
					</Row>
					<Row>
						<Col span={3}></Col>
						<Col span={18} style={{margin:'30px 0px'}}>
							<List 
								itemLayout="horizontal"
								dataSource={this.state.noticeList}
								renderItem={item => (
							      <List.Item>
							        <List.Item.Meta
							          avatar={<Avatar src={this.state.courseImg} />}
							          title={item.title}
							          description={item.content}
							        />
							        <span>{item.time}</span>
							      </List.Item>
                              
							    )}
							/>
						</Col>
						<Col span={3}></Col>
					</Row>
					<Modal
                    title="添加通知"
                    visible={this.state.isShowAddModal}
                    onCancel={this.clickCancelAddModal}
                    footer={[
                    		<Button onClick={this.clickCancelAddModal} key='1'>取消</Button>,
                    		<Button onClick={this.clickAdd} key='0'>添加</Button>
                    	]}
                >
                <section>
                	
                	<Row>
                		<Col span={3}/>
                		<Col span={18}>
                			<div style={{ marginBottom: 16 }}>
						      <Input addonBefore="标题:" onChange={e=>this.setNoticeTitle(e)} value={this.state.newNoticeTitle} placeholder='请输入通知标题'/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <TextArea rows={4} placeholder='请输入您的通知详情' value={this.state.newNoticeContent} onChange={e=>this.setNoticeContent(e)}/>
						    </div>
                		</Col>
                		<Col span={3}/>	
                	</Row>
                	
                	
                </section>
                </Modal>
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
				</div>
			)
	}
}