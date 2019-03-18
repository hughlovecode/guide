import React from 'react'
import {Row,Col,List,Button,Avatar} from 'antd'
import http from './../../../axios/index'

export default class statisticAll extends React.Component{
	constructor(){
		super()
		var that=this
		this.state={
			courseList:[
				{
				courseName:'',
				courseInfo:'',
				courseId:'',
				courseSN:'',
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
					courseList:res.result.info.courseList
				})
				return Promise.resolve()
			}else{
				throw 'info接口出问题'
			}
		}).then(res=>{
			for(let i=0;i<that.state.courseList.length;i++){
				let params={
					courseId:that.state.courseList[i].courseId,
					courseSN:that.state.courseList[i].courseSN,
				}
				http.post('/course/detail',params).then(res=>{
					if(res.status==='0'){
						//that.state.courseList[i].courseImg=res.result.courseDetail.courseImg
						let courseList=that.state.courseList;
						courseList[i].courseImg=res.result.courseDetail.courseImg
						that.setState({
							courseList:courseList
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
            courseId:e.target.dataset.courseid,
            courseSN:e.target.dataset.coursesn
        }
        this.props.history.push({pathname: '/course/statistic', state: {params: params}})
    }
	render(){
		return(
				<Row>
					<Col span={3}></Col>
					<Col span={18}>
						<List 
						style={{marginTop:'30px'}}
							itemLayout="horizontal"
							dataSource={this.state.courseList}
							renderItem={item => (
						      <List.Item>
						        <List.Item.Meta
						          avatar={<Avatar src={item.courseImg} />}
						          title={item.courseName}
						          description={item.courseInfo}
						        />
						        <Button data-courseid={item.courseId} data-coursesn={item.courseSN} onClick={e=>this.toStatistic(e)}>查看</Button>
						      </List.Item>
						    )}
						/>
					</Col>
					<Col span={3}></Col>
				</Row>
			)
	}
}