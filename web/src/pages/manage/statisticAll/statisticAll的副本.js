import React from 'react'
import http from './../../../axios/index'
import {Button} from 'antd'
export default class StatisticAll extends React.Component {
	constructor(){
		super()
		let userId=localStorage.getItem('userId')
		let signIn=new Array();
		let params={
			userId:userId
		}
		http.post('/userInfo/info',params).then(res=>{
			console.log(res)
			if(res.status !=='0'){
				throw res.msg
			}else{
				this.setState({
					courseList:res.result.info.courseList
				})
				return new Promise((resolve,reject)=>{
					resolve(res.result.info.courseList)
				})
			}
		}).then(res=>{
			let courseList=res
				for(let i=0;i<courseList.length;i++){
					let params={
						courseId:courseList[i].courseId,
						courseSN:courseList[i].courseSN
					}
					http.post('/course/detail',params).then(res2=>{
						if(res2.status!=='0'){
							throw res.msg
						}else{
							signIn.push(res2.result.courseDetail)
							this.setState({
								allCourse:signIn
							})

						}
					})
				}
			
			
		}).catch(err=>{
			console.log(err)
		})
	}
	getData=()=>{
		console.log(this.state.allCourse)
	}
	render(){
		return(<div><Button onClick={this.getData}>getData</Button></div>)
	}
}