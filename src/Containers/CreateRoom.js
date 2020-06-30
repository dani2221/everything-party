import React,{Component} from 'react';
import firebase from 'firebase'
import { withRouter } from 'react-router-dom';
import './JoinPage.css'
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player';

class CreateRoom extends Component{

    state={
        roomText : '',
        urlText : '',
        queue : [],
        err: ''
    }

    roomTextChange = event=>{
            this.setState({roomText: event.target.value});
    }
    urlTextChange = event=>{
        this.setState({urlText: event.target.value});
    }
    addUrl = ()=>{
        if(this.state.urlText.length===0){
            this.setState({err:'Please enter a URL'});
            return;
        }
        if(ReactPlayer.canPlay(this.state.urlText)){
            const upd = {...this.state};
            upd.queue.push(this.state.urlText);
            upd.urlText='';
            this.setState(upd);
        }else{
            this.setState({err:'This URL cannot be played, maybe a typo?'})
        }
    }
    createRoom = ()=>{
        const postObject = {
            chats: [],
            events: [],
            nowSeconds: 0,
            prevSeconds: 0,
            playing: false,
            seek: false,
            url: this.state.queue[0],
            urlList: this.state.queue,
            users: []
        }
        if(postObject.urlList.length===0){
            postObject.url='https://www.youtube.com/watch?v=Wl959QnD3lM&t=3s';
            postObject.urlList.push(postObject.url);
        }

        if(this.state.roomText.length===0 || this.state.roomText.length>20){
            this.setState({err:'Room names need to be between 0 and 21 characters'})
        }else{
            const db = firebase.firestore();
            db.collection('parties').doc(this.state.roomText).get().then((res)=>{
                if(res.exists){
                    this.setState({err:'This room is unavailable at the moment please try another room name'})
                }else{
                    db.collection('parties').doc(this.state.roomText).set(postObject).then(()=>{
                        this.props.history.push("/party/"+this.state.roomText);
                    })
                }
            })
        }
    }
    closePopup=()=>{
        this.setState({err:''})
    }


    render(){
        return(
            <div className='login-form'>
                        <Popup open={this.state.err.length>0} onClose={()=>this.closePopup()}>
                            <p style={{color: 'black'}}>{this.state.err}</p>
                        </Popup>
                <div style={{display:'inline-block'}}>
                    <input placeholder='Enter room name' className='input' style={{margin:'0px',marginBottom:'30px'}} type='text' onChange={(e)=>this.roomTextChange(e)} value={this.state.roomText}/>
                    <p className='h1' style={{fontSize:'25px'}}>Create Queue</p>
                    <input className='input' placeholder='Add urls' style={{margin:'0px',marginBottom:'20px'}} type='text' onChange={(e)=>this.urlTextChange(e)} value={this.state.urlText}/>

                    <button className='btn label' onClick={()=>this.addUrl()}>Add</button>
                </div>
                <div style={{height:'100%',borderLeft:'3px solid white',display:'inline-block'}}/>
                <div className='queue' style={{verticalAlign:'top',maxHeight:'270px',overflow:'auto',overflowX:'hidden',width:'200px'}}>
                    <p className='h1' style={{fontSize:'25px'}}>Queue</p>
                    {this.state.queue.length>0 ? this.state.queue.map(el=>{
                        return(
                            <div>
                                <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                                <p>{el}</p>
                            </div>
                        )
                    }):
                            <div>
                                <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                                <p><i>Such empty</i></p>
                            </div>}
                </div>
                <button className='btn label' style={{marginTop:'20px'}} onClick={()=>this.createRoom()}>Create room</button>
            </div>
        )
    }
}

export default withRouter(CreateRoom);