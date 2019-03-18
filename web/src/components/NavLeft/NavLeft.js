import React from 'react'
import {Menu} from 'antd'
import MenuList from './../../config/MenuConfig'
import {NavLink} from 'react-router-dom'
import './NavLeft.styl'
const SubMenu = Menu.SubMenu;
export default class NavLeft extends React.Component{

    constructor(){
        super()
        this.state={
            menuList:MenuList,
            
        }
    }
    componentWillMount(){
        let menutree=this.initList(this.state.menuList)
        this.setState({
            menutree:menutree
        })
    }
    initList=(data)=>{

        return data.map((item)=>{
            if(item.children){
                return <SubMenu key={item.key} title={item.title}>{this.initList(item.children)}</SubMenu>
            }
            else{
                return <Menu.Item key={item.key}>
                    <NavLink to={item.key}>{item.title}</NavLink>

                </Menu.Item>
            }
        })



    }

    render(){
        return(
            <div>
                <img src='http://bmob-cdn-19601.b0.upaiyun.com/2019/02/08/bb25dbfb40915a8680f1313d16f47597.png' className='logo' alt='logo'/>
                <Menu   mode="vertical" theme='dark'> 
                    {this.state.menutree}
                </Menu>
            </div>

        )
    }
}