import React from 'react'
import NavLeft from './../../../components/NavLeft/NavLeft'
import Header from './../../../components/Header/header'
import Footer from './../../../components/Footer/footer'
import './home.styl'



export default class Login extends React.Component{
    render(){

        return(

            <div className='all'>
                <section className='navLeft'>
                    <NavLeft/>
                </section>
                <section className='right'>
                    <div className='header'><Header /></div>
                    <div className='container'>
                        {this.props.children}

                    </div>
                    <div className='header'><Footer className='footer'/></div>
                </section>

            </div>

        )
    }
}