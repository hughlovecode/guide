import React from 'react'
import http from './../../../axios/index'
import {Col,Row,Button} from 'antd'
import Type1 from './../../../components/echarts/type1'
import Type2 from './../../../components/echarts/type2'
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
                let students=detail.students;
                //对于按照课程次数的计数方法
                let len=students[0].signInCount.length;
                let arrY1=new Array()
                let arrX1=new Array()
                for(let i=0;i<len;i++){
                	arrY1[i]=0;
                	arrX1[i]='第'+(i+1)+'次'
                }
                for(let i=0;i<len;i++){
                	students.forEach(item=>{
                		if(item.signInCount[i].isSign==='true'){
                			arrY1[i]++
                		}
                	})
                }
                this.setState({
                	arrX1:arrX1,
                	arrY1:arrY1,
                })
                //对于按照人头计数的统计
                let len2=students.length;
                let arrX2=new Array()
                let arrY2=new Array()
                for(let i=0;i<len2;i++){
                	arrX2[i]=students[i].studentName
                }
                for(let i=0;i<len2;i++){
                	arrY2[i]=0
                }
                for(let i=0;i<len2;i++){
                	students[i].signInCount.forEach(item=>{
                		if(item.isSign==='true'){
                			arrY2[i]++
                		}
                	})
                }
                console.log(arrY2)
                this.setState({
                	arrX2:arrX2,
                	arrY2:arrY2,
                	len:len,
                	isInit:true
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
						{(this.state.mode==='1'&&this.state.isInit)?<section >
							<Type1 data={{
						        xdata: this.state.arrX1,
						        ydata: {
						          ydata1:this.state.arrY1,
						          
						        },
						        detail:this.state.detail
						      }}/>
						</section>:''}					
						{this.state.mode==='2'&&this.state.isInit?<section>
							<Type2 data={{
						        xdata: this.state.arrX2,
						        ydata: {
						          ydata1:this.state.arrY2,
						          
						        },
						        detail:this.state.detail,
						        len:this.state.len
						      }}/>
						</section>:''}					
					</Col>
					<Col span='5'></Col>
				</Row>
			</div>)
	}
}