import React from 'react'
import {Link,Route,HashRouter} from 'react-router-dom'
import MyInfo from './myInfo'
export default class Test extends React.Component{
    render(){
        return(
            <HashRouter>
                <div>
                    <Link to='/info' >to</Link>
                    <Route path='/info' component={MyInfo}/>
                </div>

            </HashRouter>
        )
    }
}