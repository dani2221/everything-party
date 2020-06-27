import React,{Component} from 'react';
import PlayerWindow from './PlayerWindow';
import Chat from '../Components/Chat';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase'
import './PartyPage.css'
import URLCard from '../Components/URLCard';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player';

class PartyPage extends Component {
    state={
        err: '',
        updated: {
            url: '',
            users: [],
            chats: [{name:'',msg:''}],
            events: [],
            urlList: []
        }
    }
    latency=0
    componentDidMount(){
        const db = firebase.firestore();
        const startTime = new Date().getTime();
        db.collection('parties').doc(this.props.match.params.partyNum).get().then(res=>{
            this.latency = new Date().getTime()-startTime;
            const updated = {...res.data()};
            updated.nowSeconds=parseFloat(updated.nowSeconds);
            updated.prevSeconds = updated.nowSeconds;
            this.setState({updated:updated});
            console.log(this.latency);
        })
        const unsub = db.collection('parties').doc(this.props.match.params.partyNum)
        .onSnapshot((doc)=>{
            console.log("Current data: ", doc.data());
            const updated = {...doc.data()};
            if(this.state.updated.users.length===updated.users.length){
                updated.nowSeconds=parseFloat(updated.nowSeconds);
                updated.prevSeconds = updated.nowSeconds;
                updated.seek = true;
                this.setState({updated: updated})
            }else{
                db.collection('parties').doc(this.props.match.params.partyNum).update({
                    nowSeconds: this.state.updated.nowSeconds,
                    prevSeconds: this.state.updated.prevSeconds,
                })
                updated.nowSeconds=this.state.updated.nowSeconds;
                updated.prevSeconds = this.state.updated.nowSeconds;
                updated.seek = true;
                this.setState({updated: updated})
            }
        })
    }
    chatChanged=(e)=>{
        this.setState({chatText: e.target.value})
    }
    chatPost=(e)=>{
        const chat={
            name: this.props.user,
            msg: this.state.chatText
        }
        if(!chat.msg){
            return;
        }
        if(chat.msg.length===0 || chat.msg.length>500){
            this.setState({err: 'Chat messages have to be 500 characters or less'})
        }else{
            const db = firebase.firestore();
            db.collection('parties').doc(this.props.match.params.partyNum).update({
                chats: firebase.firestore.FieldValue.arrayUnion(chat),
                nowSeconds: this.state.updated.nowSeconds,
                prevSeconds: this.state.updated.prevSeconds,
            })
            this.setState({chatText: ''})
        }
    }
    closePopup=()=>{
        this.setState({err:''})
    }

    urlChanged=(e)=>{
        this.setState({urlText: e.target.value})
    }
    urlPost=(e)=>{
        if(ReactPlayer.canPlay(this.state.urlText)){
            const db = firebase.firestore();
            db.collection('parties').doc(this.props.match.params.partyNum).update({
                urlList: firebase.firestore.FieldValue.arrayUnion(this.state.urlText),
                nowSeconds: this.state.updated.nowSeconds,
                prevSeconds: this.state.updated.prevSeconds,
            })
            this.setState({urlText:''})
        }else{
            this.setState({err:'This URL cannot be played, maybe a typo?'})
        }
    }
    urlSkip = ()=>{
        const updState = {...this.state.updated};
        updState.urlList.splice(0,1);
        if(updState.urlList.length<1){
            updState.url='https://www.youtube.com/watch?v=VNcVz8uBC_w';
            updState.urlList.push('https://www.youtube.com/watch?v=VNcVz8uBC_w');
        }else{
            updState.url = this.state.updated.urlList[0];
        } 
        updState.nowSeconds=0;
        updState.prevSeconds=0;
        updState.playing=true;
        updState.seek=false;
        this.setState({updated:updState});

        const pp = {
            value: this.props.user+' has skipped to the next URL',
            timestamp: new Date().getTime()
        }
        const db = firebase.firestore();
        const userRef = db.collection('parties').doc(this.props.match.params.partyNum).update({
            ...updState,
            events: firebase.firestore.FieldValue.arrayUnion(pp)
        });
    }
    updateSeconds = sec =>{
        const updState = {...this.state.updated};
        updState.nowSeconds=sec;
        updState.prevSeconds=sec;
        this.setState({updated: updState});
        console.log(this.state.updated.nowSeconds);
    }

    render(){
        return(
            <div style={{background: 'rgba(0,0,0,0.8)', width:'100%', height:'100%'}}>
                        <Popup open={this.state.err.length>0} onClose={()=>this.closePopup()}>
                            <p style={{color: 'black', textAlign: 'center'}}>{this.state.err}</p>
                        </Popup>
                    <PlayerWindow  partyRoom={this.props.match.params.partyNum} st={this.state.updated} user={this.props.user} videoEnd={()=>this.urlSkip()} nowSecondsHandler={(sec)=>this.updateSeconds(sec)}/>
                    <URLCard  urls={this.state.updated.urlList} changeInput={(e)=>this.urlChanged(e)} postURL={()=>this.urlPost()} skipURL={()=>this.urlSkip()} inputURL={this.state.urlText}/>
                    <Chat chats={this.state.updated.chats} changeInput={e=>this.chatChanged(e)} postChat={(e)=>this.chatPost(e)} chatval={this.state.chatText}/>
                <Draggable bounds='body'>
                <div className='card'>
                    <p style={{fontSize:'20px',fontWeight:'900'}}>Members</p>
                    <div className='card-over' style={{maxHeight:'280px'}}>
                    {this.state.updated.users.map(el=>{
                        return(
                            <div>
                                <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                                <p>{el}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
                </Draggable>
                <Draggable  bounds='body'>
                <div className='card'>
                    <p style={{fontSize:'20px',fontWeight:'900'}}>Events</p>
                    <div className='card-over' style={{overflow: 'hidden',maxHeight:'300px'}}>
                    {this.state.updated.events.reverse().map(el=>{
                        return(
                            <div>
                                <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                                <p>{el.value}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
                </Draggable>
            </div>
        )
    }
}

export default withRouter(PartyPage);