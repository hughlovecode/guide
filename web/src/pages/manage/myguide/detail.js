import React from 'react'
import http from './../../../axios/index'
import './detail.styl'
import { List, Avatar,Icon,Button } from 'antd';
import VisitorList from './visitorList'
import NoticeList from './noticeList'
export default class Detail extends React.Component{

    constructor(params){
        super(params);
        this.state={
            teacherImg:localStorage.getItem('userImg'),
            guideName:'',
            guideId:'',
            guideSN:'',
            guideAddress:'',
            guideCount:'',
            guideInfo:'',
            guideState:'',
            guiderName:'',
            tourists:'',
            guiderId:'',
            isGuideLoading:true,
            isTouristLoading:true,//这上下两个是react异步传值所需要的
            noticeList:[]

        }
        http.post('/guide/detail',this.props.location.state.params).then((res)=>{
            console.log(this.props.location.state.params)
            if(res.status!=='0'){
                alert('抱歉,出问题了!')
                console.log(res)
            }else{
                console.log('ress:')
                console.log(res)
                let detail=res.result.guideDetail;
                this.setState({
                    guideName:detail.guideName,
                    guideId:detail.guideId,
                    guideSN:detail.guideSN,
                    guideAddress:detail.guideAddress,
                    guideCount:detail.guideCount,
                    guideInfo:detail.guideInfo,
                    guideState:detail.guideState,
                    guiderName:detail.guiderName,
                    tourists:detail.tourists,
                    guiderId:detail.guiderId,
                    guideImg:detail.guideImg,
                    noticeList:detail.notice
                })

            }
        }).then(()=>{
            this.setState({
                isGuideLoading:false,
                isTouristLoading:false
            })
        })


    }
    homework=()=>{
        return <span>通知</span>
    }
    goToModifyInfo=()=>{
        let params={
            guideId:this.state.guideId,
            guideSN:this.state.guideSN
        }
        this.props.history.push({pathname: '/guide/modifyGuide', state: {params: params}})
    }
    goToStatistic=()=>{
        let params={
            guideId:this.state.guideId,
            guideSN:this.state.guideSN
        }
        this.props.history.push({pathname: '/guide/statistic', state: {params: params}})
    }
    goToNotice=()=>{
        let params={
            guideId:this.state.guideId,
            guideSN:this.state.guideSN,
            guideImg:this.state.guideImg,
        }
        console.log(params)
        this.props.history.push({pathname: '/guide/myNotice', state: {params: params}})

    }
    goToVisitor=()=>{
        let params={
            guideId:this.state.guideId,
            guideSN:this.state.guideSN,
        }
        console.log(params)
        this.props.history.push({pathname: '/guide/myVisitor', state: {params: params}})

    }




    render(){


        return(
            <div className='detail-all'>
                <span style={{fontSize:'20px',fontWeight:'900'}}><Icon type="double-right" style={{margin:'20px 5px 0px 20px'}}/>{this.state.guideName}</span>
                <Button style={{float:'right',margin:'20px 30px 0px 20px'}} onClick={this.goToModifyInfo}>修改信息</Button>
                <Button style={{float:'right',margin:'20px 10px 0px 20px'}} onClick={this.goToStatistic}>签到统计</Button>
            <div className='detail-container'>

                <List className="detail-list">

                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar
                                src={this.state.teacherImg}/>}
                            title={<span>{this.state.guiderName}</span>}
                            description={this.state.guiderId}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>简介</span>}
                            description={this.state.guideInfo}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>旅程号</span>}
                            description={this.state.guideId}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>序号</span>}
                            description={this.state.guideSN}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta

                            title={<span>出发地</span>}
                            description={this.state.guideAddress}
                        />
                    </List.Item>
                    <List.Item >
                        <List.Item.Meta
                            title={<span>通知<Button style={{marginLeft:'100px'}} onClick={this.goToNotice}>详情</Button></span> }
                            description={this.state.isGuideLoading?'loading':<NoticeList noticeList={this.state.noticeList}/>}
                        />
                    </List.Item>
                    <List.Item className='guideListDiv'>
                        <List.Item.Meta

                            title={<span>游客<Button style={{marginLeft:'100px'}} onClick={this.goToVisitor}>详情</Button></span>}
                            description={this.state.isTouristLoading?'loading':<VisitorList visitorList={this.state.tourists}/>}
                        />
                    </List.Item>
                </List>


                

            </div>
            </div>
        )
        }
        }