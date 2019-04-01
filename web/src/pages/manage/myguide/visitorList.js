import React from 'react'
import {
    List, message, Avatar, Spin,
} from 'antd';
import './visitorList.styl'
import InfiniteScroll from 'react-infinite-scroller';
export default class VisitorList extends React.Component {
    constructor(props){
        super(props)
        let visitors=this.props.visitorList
        this.state={
            list:this.getVisitorList(visitors)
        }
    }
    getVisitorList=(visitors)=>{
        console.log(visitors)
        let newArr=[]
        visitors.forEach((item,index)=>{
            let newItem={
                touristName:item.touristName,
                touristId:item.touristId,
                guideSN:item.guideSN,
                guideImg:item.guideImg,
                count:item.signInCount.length,
                signInCount:this.getSignInCount(item.signInCount)
            }
            newArr.push(newItem)
        })
        return newArr
    }
    getSignInCount=(arr)=>{
        let signInWeeks=[];
        arr.forEach((item)=>{
            if(item.isSign==='true'){
                signInWeeks.push(item.tag)
            }
        })
        return signInWeeks
    }
    state = {
        data: [],
        loading: false,
        hasMore: true,
    }

    componentDidMount() {

            this.setState({
                data: this.state.list,
            });

    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    }

    render() {
        return (
            <div className="demo-infinite-container list-guideList">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.guideImg} />}
                                    title={<a href="https://ant.design">{item.touristName}</a>}
                                    description={'这游客在全部的'+item.count+'次签到中,一共签到了'+item.signInCount.length+'次'}
                                />
                                <div>{item.touristId}</div>
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

