import React from 'react'
import { Row,Col,Card,Button,Modal } from 'antd';
import http from './../../../axios/index'
import './myGuide.styl'



export default class MyGuide extends React.Component{
    componentWillMount(){
        this.getData();
        this.setState({
            status:'',//必须写上status,否则下面this.state.status会报错,其他无所谓
            guideTree:'',
            isShowTip:false,
            tipInfo:''
        })
    }
    handleCancel=()=>{
        this.setState({
            isShowTip:false
        })
    }
    getData=()=>{
        let userId=localStorage.getItem('userId')
        http.post('/guide',{userId:userId}).then((res)=>{
            if(res.status!=='0'){
               // alert('好像出了点以外刷新看看')
               this.setState({
                isShowTip:true,
                tipInfo:res.msg
               })
            }else{
                let temp=res.result.guidelist;
                console.log('test:')
                console.log(temp)
                this.setState({

                    guideTree:this.getguideTree(temp)
                })
                //console.log(this.state.status)

            }
        })
    }
    getRouterAddress=(e)=>{
        //console.log(e.target.dataset.guideId)
        let guideId=e.target.dataset.guideid;
        let guideSN=e.target.dataset.guidesn;
        let params={
            guideId:guideId,
            guideSN:guideSN
        }
        this.props.history.push({pathname: '/guide/detail', state: {params: params}})



    }
    getguideTree=(data)=>{
        if(data.length>0){
            return data.map((item,index)=>{
                return <Row gutter={16} key={index}><Card title={item.guideName} bordered={false}  style={{width:'calc(100% - 50px)'}}>
                    简介: <b>{item.guideInfo}</b>
                    <p/>
                    <p className='guide'>
                        <span >旅程号:  <b>{item.guideId}</b>  </span>
                        <span >序号:  <b>{item.guideSN}</b>  </span>
                    </p>
                    <Button onClick={(e)=>{this.getRouterAddress(e)}} style={{float:'right'}} data-guideId={item.guideId} data-guideSN={item.guideSN}>详情</Button>
                    </Card>
                </Row>
            })
        }else{
            return ''
        }
    }


    render(){
        return(
            <Row className='guide-all'>

                <Col span='6' />
                <Col span='12' className='guide-center'>
                    <div className='guideInfo'>
                        <span style={{fontSize:'20px',fontWeight:900,paddingLeft:'10px'}}>我的行程</span>
                        {this.state.guideTree}

                    </div>
                </Col>
                <Col span='6' />
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


            </Row>
        )
    }
}



