import React from 'react'
import {Row,Col,List,Button,Avatar} from 'antd'
import http from './../../../axios/index'

export default class statisticAll extends React.Component{
	constructor(){
		super()
		var that=this
		this.state={
			guideList:[
				{
				courseName:'',
				courseInfo:'',
				guideId:'',
				guideSN:'',
				courseImg:''
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
					guideList:res.result.info.guideList
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
						//that.state.guideList[i].courseImg=res.result.courseDetail.courseImg
						let guideList=that.state.guideList;
						guideList[i].courseImg=res.result.courseDetail.courseImg
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
	toStatistic=(e)=>{
        let params={
            guideId:e.target.dataset.guideid,
            guideSN:e.target.dataset.guidesn
        }
        this.props.history.push({pathname: '/guide/statistic', state: {params: params}})
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
						          avatar={<Avatar src={item.courseImg} />}
						          title={item.courseName}
						          description={item.courseInfo}
						        />
						        <Button data-guideid={item.guideId} data-guidesn={item.guideSN} onClick={e=>this.toStatistic(e)}>查看</Button>
						      </List.Item>
						    )}
						/>
					</Col>
					<Col span={3}></Col>
				</Row>
			)
	}
}