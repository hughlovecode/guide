import React from 'react'
import http from './../../../axios/index'
import {Col,Row,Button} from 'antd'
import Type1 from './../../../components/echarts/type1'
import './statistic.styl'
export default class Statistic extends React.Component {
	constructor(params){
		super(params)
	}
	componentWillMount(){
		this.setState({
			mode:'1'
		})
	}
	componentDidMount(){
		http.post('/course/detail',this.props.location.state.params).then(res=>{
            if(res.status !== '0'){
                this.setState({
                    isVisible:true,
                    modalInfo:'服务器出错,查不到对应数据'
                })
            }else{
                let detail=res.result.courseDetail;
                console.log(detail)
                this.setState({
                    detail:detail,
                })
            }
        }).then(()=>{console.log('1111')})
	}
	changeMode=()=>{
		this.setState({
			mode:'2'
		})
	}
	changeMode2=()=>{
		this.setState({
			mode:'1'
		})
	}

	render(){
		return(<div className='statisticDiv'>
				<div className='modeFather'>
					<Button className='changeMode' onClick={this.changeMode}>总数模式</Button>
					<Button className='changeMode' onClick={this.changeMode2}>人头模式</Button>

				</div>
				<Row>
					<Col span='5'></Col>
					<Col span='14' >
						{this.state.mode==='1'?<section >
							<Type1 data={{
						        xdata: ['第一次','第二次','第三次','第四次'],
						        ydata: {
						          ydata1:[4,3,1,4],
						          
						        }
						      }}/>
						</section>:''}					
						{this.state.mode==='2'?<section>mode2</section>:''}					
					</Col>
					<Col span='5'></Col>
				</Row>
			</div>)
	}
}