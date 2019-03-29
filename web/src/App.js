import React, { Component } from 'react';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import FirstPage from './firstPage'
import './App.css';
import Login from './components/Login/login'
import Home from './pages/manage/home/home'
import MyInfo from './pages/manage/myInfo/myInfo'
//import changeMyInfo from './pages/manage/changeMyInfo/changeMyInfo'
import changeMyInfo from './pages/manage/changeMyInfo/changeMyInfo'
import MyGuide from './pages/manage/myguide/myGuide'
import Detail from './pages/manage/myguide/detail'
import modifyGuide from './pages/manage/modifyGuide/modifyGuide'
import statistic from './pages/manage/statistic/statistic'
import statisticAll from './pages/manage/statisticAll/statisticAll'
import AddMyGuide from './pages/manage/addMyGuide/addMyGuide'
import myVisitor from './pages/manage/myvisitor/myVisitor'
import myNotice from './pages/manage/myNotice/myNotice'
import visitorManage from './pages/manage/myvisitor/visitorManage'
import modifyManage from './pages/manage/modifyGuide/modifyManage'
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
                                <Route path='/guide/myguide' component={()=><Home>
                                    <Route path='/guide/myguide' component={MyGuide}/>
                                </Home>}></Route>
                                <Route path='/guide/detail' component={()=><Home>
                                    <Route path='/guide/detail' component={Detail}/>
                                </Home>}></Route>
                                <Route path='/guide/addMyGuide' component={()=><Home>
                                    <Route path='/guide/addMyGuide' component={AddMyGuide}/>
                                </Home>}></Route>
                                <Route path='/guide/modifyGuide' component={()=><Home>
                                    <Route path='/guide/modifyGuide' component={modifyGuide}/>
                                </Home>}></Route>
                                <Route path='/guide/statistic' component={()=><Home>
                                    <Route path='/guide/statistic' component={statistic}/>
                                </Home>}></Route>
                                <Route path='/guide/statisticAll' component={()=><Home>
                                    <Route path='/guide/statisticAll' component={statisticAll}/>
                                </Home>}></Route>
                                <Route path='/guide/myVisitor' component={()=><Home>
                                    <Route path='/guide/myVisitor' component={myVisitor}/>
                                </Home>}></Route>
                                <Route path='/guide/myNotice' component={()=><Home>
                                    <Route path='/guide/myNotice' component={myNotice}/>
                                </Home>}></Route>
                                <Route path='/guide/modifyManage' component={()=><Home>
                                    <Route path='/guide/modifyManage' component={modifyManage}/>
                                </Home>}></Route>
                                <Route path='guide//visitorManage' component={()=><Home>
                                    <Route path='guide/visitorManage' component={visitorManage}/>
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
