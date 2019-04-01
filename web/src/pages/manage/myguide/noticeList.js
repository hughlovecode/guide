import React from 'react'
import {
    List, message, Avatar, Spin,
} from 'antd';
import reqwest from 'reqwest';
import './visitorList.styl'
import InfiniteScroll from 'react-infinite-scroller';
export default class NoticeList extends React.Component {
    constructor(props){
        super(props)
        this.state={
            list:this.props.noticeList,
            isShowList:false
        }
        //console.log(this.state.list)

    }
    state = {
        data: [],
        loading: false,
        hasMore: true,
    }

    componentDidMount() {

        this.setState({
            data:this.state.list
        })
    }


    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        if (data.length > 5) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }

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
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description={item.content}
                                />
                                <div>{item.time}</div>
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

