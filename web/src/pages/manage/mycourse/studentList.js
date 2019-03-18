import React from 'react'
import {
    List, message, Avatar, Spin,
} from 'antd';
import './studentList.styl'
import InfiniteScroll from 'react-infinite-scroller';
export default class InfiniteListExample extends React.Component {
    constructor(props){
        super(props)
        let students=this.props.studentList
        this.state={
            list:this.getStudentList(students)
        }
        console.log(this.state.list)
    }
    getStudentList=(students)=>{
        let newArr=[]
        students.forEach((item,index)=>{
            let newItem={
                studentName:item.studentName,
                studentId:item.studentId,
                studentSN:item.studentSN,
                studentImg:item.studentImg,
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
                            <List.Item >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.studentImg} />}
                                    title={<a href="https://ant.design">{item.studentName}</a>}
                                    description={'这名学生在全部的'+item.count+'次课程中,一共签到了'+item.signInCount.length+'次'}
                                />
                                <div>{item.studentId}</div>
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

