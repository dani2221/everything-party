import React, { Component } from 'react'
import firebase from 'firebase'
import PartyPage from './PartyPage'
import { withRouter } from 'react-router-dom'
import './JoinPage.css'
import Popup from 'reactjs-popup'
import {Beforeunload} from 'react-beforeunload';

class JoinPage extends Component{


    state={
        username: '',
        unconfirmed: true,
        showPopup: false,
        partyNum: this.props.match.params.partyNum
    }

    onUnload = ev => { // the method that will be used for both add and remove event
        ev.preventDefault();
        const db = firebase.firestore();
        db.collection('parties').doc(this.state.partyNum).get().then(res=>{
            const result = res.data();
            if(result.users.length===1){
                db.collection('parties').doc(this.state.partyNum).delete()
            }else{
                db.collection('parties').doc(this.state.partyNum).update({
                    users: firebase.firestore.FieldValue.arrayRemove(this.state.username)
                }).then(()=>{
                    this.setState({unconfirmed: false})
                })
            }
        }).catch(()=>{
            const pp = 'pp';
        })
    }

    usernameChanged = (event)=>{
        this.setState({username: event.target.value})
    }
    usernameConfirm = ()=>{
        if(this.state.username.length===0 || this.state.username.length>10){
            this.setState({
                showPopup:true
            })
        }else{
            const db = firebase.firestore();
            db.collection('parties').doc(this.props.match.params.partyNum).update({
                users: firebase.firestore.FieldValue.arrayUnion(this.state.username)
            }).then(()=>{
                this.setState({unconfirmed: false})
            })
        }
    }
    componentDidMount() {
        window.addEventListener("onunload", this.onUnload);
        const db = firebase.firestore();
        db.collection('parties').doc(this.props.match.params.partyNum).get().then(res=>{
            if(!res.exists){
                this.props.history.push('/404')
            }
        })
    }
 
    componentWillUnmount() {
        window.removeEventListener("onunload", this.onUnload);
    }
    closePopup=()=>{
        this.setState({showPopup:false})
    }
    render(){
        let rndr;
        let style;
        if(this.state.unconfirmed){
            rndr = (
                    <div>
                        {/* <Beforeunload onBeforeunload={event => this.onUnload(event)} /> */}
                        <Popup open={this.state.showPopup} onClose={()=>this.closePopup()}>
                                <p style={{color: 'black'}}>Your username must be more than 0 and less than 11 characters</p>
                        </Popup>
                        <pre className='h1'>Entering room {'\n'}{this.props.match.params.partyNum}</pre>
                        <input name='username' placeholder='Username' onChange={(event)=>this.usernameChanged(event)} className='input'/>
                        <button onClick={()=>this.usernameConfirm()} className='btn label'>Join room</button>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)',margin:'30px 0px'}}/>
                        <p className='h1' style={{fontSize:'15px'}}>Send this link to your friends to join{'\n\n'}</p>
                        <p className='h1' style={{fontSize:'15px',color:'orange'}}>https://everything-party.web.app/party/{this.props.match.params.partyNum}</p>
                    </div>
            )
            style='login-form';
        }
        else{
            rndr = <PartyPage user={this.state.username}/>
            style='fade black';
        }
    return (
            <div className={style}>
                {rndr}
            </div>
    )
}
}

export default withRouter(JoinPage)