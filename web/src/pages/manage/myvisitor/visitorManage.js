import React from 'react'
import {Row,Col,List,Button,Avatar} from 'antd'
import http from './../../../axios/index'

export default class VisitorManage extends React.Component{
	constructor(){
		super()
		var that=this
		this.state={
			guideList:[
				{
				guideName:'',
				guideInfo:'',
				guideId:'',
				guideSN:'',
				guideImg:''
			}
			],
			userImg:window.localStorage.getItem('userImg')
		}
		let userId=window.localStorage.getItem('userId')
		let params={
			userId:userId
		}
		http.post('/userInfo/info',params).then(res=>{
			if(res.status==='0'){
				console.log(res)
				this.setState({
					guideList:res.info.guideList
				})
				return Promise.resolve()
			}else{
				throw 'info接口出问题'
			}
		}).then(res=>{
			for(let i=0;i<that.state.guideList.length;i++){
				let params={
					guideId:that.state.guideList[i].guideId,
					guideSN:that.state.guideList[i].guideSN,
				}
				http.post('/guide/detail',params).then(res=>{
					if(res.status==='0'){
						//that.state.guideList[i].guideImg=res.result.courseDetail.guideImg
						let guideList=that.state.guideList;
						guideList[i].guideImg=res.result.guideDetail.guideImg
						that.setState({
							guideList:guideList
						})
					}else{
						throw 'detail接口出问题'
					}
				})
			}
		}).catch(err=>{console.log(err)})
	}
	toTourists=(e)=>{
        let params={
            guideId:e.target.dataset.guideId,
            guideSN:e.target.dataset.guideSN
        }
        this.props.history.push({pathname: '/guide/myVisitor', state: {params: params}})
    }
	render(){
		return(
				<Row>
					<Col span={3}></Col>
					<Col span={18}>
						<List 
						style={{marginTop:'30px'}}
							itemLayout="horizontal"
							dataSource={this.state.guideList}
							renderItem={item => (
						      <List.Item>
						        <List.Item.Meta
						          avatar={<Avatar src={item.guideImg} />}
						          title={item.guideName}
						          description={item.guideInfo}
						        />
						        <Button data-guideId={item.guideId} data-guideSN={item.guideSN} onClick={e=>this.toTourists(e)}>游客管理</Button>
						      </List.Item>
						    )}
						/>
					</Col>
					<Col span={3}></Col>
				</Row>
			)
	}
}