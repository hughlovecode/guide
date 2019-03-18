import React from 'react'
import { Row,Col,Button,List,Avatar,Input,Modal} from 'antd'
import Util from './../../../util/util'
import http from './../../../axios/index'
const { TextArea } = Input
export default class MyHomework extends React.Component{
	constructor(props){
        super(props)
        let t1=this.props.location.state.params.HContent.split('@#$%')
        let t2=this.props.location.state.params.Htime.split('@#$%')
        let t3=this.props.location.state.params.HTitle.split('@#$%')
        this.state={
            list:this.getList(t1,t2,t3),
            isShowList:false,
            courseImg:this.props.location.state.params.courseImg,
            newHomeworkTitle:'',
            newHomeworkContent:'',
            sysTime:Util.formateDate(new Date().getTime())
        }
        console.log(this.state.courseImg)
        console.log(this.state.list)

    }
    getList=(t1,t2,t3)=>{
        let tempArr=[]
        t2.forEach((item,index)=>{
            let tempObj;
            tempObj={
                HContent:t1[index],
                HTime:t2[index],
                HTitle:t3[index],
                id:index
            }
            tempArr.push(tempObj)
        })
        return tempArr

    }
    setHomeworkTitle=e=>{
    	this.setState({
    		newHomeworkTitle:e.target.value
    	})
    }
    setHomeworkContent=e=>{
    	this.setState({
    		newHomeworkContent:e.target.value
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
    	if(this.state.newHomeworkContent===''||this.state.newHomeworkTitle===''){
    		this.setState({
    			isShowAddModal:false,
    			isShowTip:true,
    			tipInfo:'请填写完整哦!'
    		})
    	}else{
    		let params={
    			courseId:this.props.location.state.params.courseId,
    			courseSN:this.props.location.state.params.courseSN,
    			HTime:this.state.sysTime,
    			HTitle:this.state.newHomeworkTitle,
    			HContent:this.state.newHomeworkContent
    		}
    		http.post('/course/setHomework',params).then(res=>{
    			if(res.status !== '0'){
    				throw res.msg
    			}else{
    				let newItem={
    					HTime:that.state.sysTime,
		    			HTitle:that.state.newHomeworkTitle,
		    			HContent:that.state.newHomeworkContent
    				}
    				let newlist=that.state.list
    				newlist.push(newItem)
    				that.setState({
    					list:newlist,
    					isShowAddModal:false,
    					isShowTip:true,
    					tipInfo:'添加成功!'
    				})
    				return Promise.resolve()
    			}
    		})
    	}
    }
    addStudent=()=>{
    	this.setState({
    		isShowAddModal:true
    	})
    }
	render(){
		return(
				<div>
					<Row>
						<Button style={{float:'right',margin:'20px 130px'}} onClick={this.addStudent}>添加作业</Button>
					</Row>
					<Row>
						<Col span={3}></Col>
						<Col span={18} style={{margin:'30px 0px'}}>
							<List 
								itemLayout="horizontal"
								dataSource={this.state.list}
								renderItem={item => (
							      <List.Item>
							        <List.Item.Meta
							          avatar={<Avatar src={this.state.courseImg} />}
							          title={item.HTitle}
							          description={item.HContent}
							        />
							        <span>{item.HTime}</span>
							      </List.Item>
							    )}
							/>
						</Col>
						<Col span={3}></Col>
					</Row>
					<Modal
                    title="添加作业"
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
						      <Input addonBefore="标题:" onChange={e=>this.setHomeworkTitle(e)} value={this.state.newHomeworkTitle} placeholder='请输入作业标题'/>
						    </div>
						    <div style={{ marginBottom: 16 }}>
						      <TextArea rows={4} placeholder='请输入您的作业详情' value={this.state.newHomeworkContent} onChange={e=>this.setHomeworkContent(e)}/>
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