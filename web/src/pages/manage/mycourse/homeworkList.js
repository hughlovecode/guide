import React from 'react'
import {
    List, message, Avatar, Spin,
} from 'antd';
import reqwest from 'reqwest';
import './studentList.styl'
import InfiniteScroll from 'react-infinite-scroller';
export default class HomeworkList extends React.Component {
    constructor(props){
        super(props)
        let t1=this.props.homeworkList.HContent.split('@#$%')
        let t2=this.props.homeworkList.HTime.split('@#$%')
        let t3=this.props.homeworkList.HTitle.split('@#$%')
        this.state={
            list:this.getList(t1,t2,t3),
            isShowList:false
        }
        //console.log(this.state.list)

    }
    getList=(t1,t2,t3)=>{
        let tempArr=[]
        t2.forEach((item,index)=>{
            let tempObj;
            tempObj={
                HContent:t1[index],
                HTime:t2[index],
                HTitle:t3[index],
                id:index
            }
            tempArr.push(tempObj)
        })
        return tempArr

    }
    state = {
        data: [],
        loading: false,
        hasMore: true,
    }
    componentWillMount(){
        //alert(this.props.homeworkList.HContent)
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
            <div className="demo-infinite-container list-studentList">
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
                                    title={<a href="https://ant.design">{item.HTitle}</a>}
                                    description={item.HContent}
                                />
                                <div>{item.HTime}</div>
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

