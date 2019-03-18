import React, { Component } from 'react';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import FirstPage from './firstPage'
import './App.css';
import Login from './components/Login/login'
import Home from './pages/manage/home/home'
import MyInfo from './pages/manage/myInfo/myInfo'
//import changeMyInfo from './pages/manage/changeMyInfo/changeMyInfo'
import changeMyInfo from './pages/manage/changeMyInfo/changeMyInfo'
import MyCourse from './pages/manage/mycourse/myCourse'
import Detail from './pages/manage/mycourse/detail'
import modifyCourse from './pages/manage/modifyCourse/modifyCourse'
import statistic from './pages/manage/statistic/statistic'
import statisticAll from './pages/manage/statisticAll/statisticAll'
import AddMyCourse from './pages/manage/addMyCourse/addMyCourse'
import myStudents from './pages/manage/mystudents/myStudents'
import myHomework from './pages/manage/myHomework/myHomework'
import studentManage from './pages/manage/mystudents/studentManage'
import modifyManage from './pages/manage/modifyCourse/modifyManage'
class App extends Component {
    constructor(){
        super()
        this.state={
            isLogin:true,

        }
    }


  render() {

            return (
                <div className='body'>
                    <BrowserRouter>

                        <FirstPage>
                            <Switch>
                                <Route path='/login' exact={true} component={Login}></Route>
                                <Route path='/Info/myInfo' component={()=><Home>
                                    <Route path='/Info/myInfo' component={MyInfo}/>
                                </Home>}></Route>
                                <Route path='/Info/changeMyInfo' component={()=><Home>
                                    <Route path='/Info/changeMyInfo' component={changeMyInfo}/>
                                </Home>}></Route>
                                <Route path='/course/mycourse' component={()=><Home>
                                    <Route path='/course/mycourse' component={MyCourse}/>
                                </Home>}></Route>
                                <Route path='/course/detail' component={()=><Home>
                                    <Route path='/course/detail' component={Detail}/>
                                </Home>}></Route>
                                <Route path='/course/addMyCourse' component={()=><Home>
                                    <Route path='/course/addMyCourse' component={AddMyCourse}/>
                                </Home>}></Route>
                                <Route path='/course/modifyCourse' component={()=><Home>
                                    <Route path='/course/modifyCourse' component={modifyCourse}/>
                                </Home>}></Route>
                                <Route path='/course/statistic' component={()=><Home>
                                    <Route path='/course/statistic' component={statistic}/>
                                </Home>}></Route>
                                <Route path='/course/statisticAll' component={()=><Home>
                                    <Route path='/course/statisticAll' component={statisticAll}/>
                                </Home>}></Route>
                                <Route path='/course/myStudents' component={()=><Home>
                                    <Route path='/course/myStudents' component={myStudents}/>
                                </Home>}></Route>
                                <Route path='/course/myHomework' component={()=><Home>
                                    <Route path='/course/myHomework' component={myHomework}/>
                                </Home>}></Route>
                                <Route path='/course/modifyManage' component={()=><Home>
                                    <Route path='/course/modifyManage' component={modifyManage}/>
                                </Home>}></Route>
                                <Route path='/studentManage' component={()=><Home>
                                    <Route path='/studentManage' component={studentManage}/>
                                </Home>}></Route>
                                <Redirect path="/" to={{pathname: '/login'}} />
                            </Switch>


                        </FirstPage>

                    </BrowserRouter>
                </div>
            );



  }
}

export default App;
