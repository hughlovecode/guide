import React from 'react'
import http from './../../../axios/index'
export default class Statistic extends React.Component {
	constructor(params){
		super(params)
		http.post('/course/detail',this.props.location.state.params).then(res=>{
			this.setState({
				detail:res.result.courseDetail //detail里面的students记录了学生签到情况,每一个item有tag和isSign两个属性,tag表示第几节课,isSign表示是否签到
			})
		}).then(()=>{
			console.log(this.state.detail)
		})
	}
	render(){
		return(<div>statistic</div>)
	}
}