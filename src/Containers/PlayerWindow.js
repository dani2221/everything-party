import React,{ Component } from "react";
import ReactPlayer from 'react-player';
import firebase from 'firebase'
import { withRouter } from "react-router-dom";
import Draggable from "react-draggable";


class PlayerWindow extends Component{
    ref = player => {
        this.player = player
      }
    latency = 0;
    canUpdate = false;
    uploadState = (eventType)=>{
        const pp = {
            value: eventType,
            timestamp: new Date().getTime()
        }
        const db = firebase.firestore();
        let arr = [];
        const userReff = db.collection('parties').doc(this.props.partyRoom).get().then(res=>{
            arr = [...res.data().events];
            arr.push(pp);
            if(arr.length>4){
                arr.splice(0,arr.length-5);
            }
        }).then(()=>{
        const userRef = db.collection('parties').doc(this.props.partyRoom).update({
            ...this.state,
            events: arr
        });  
        })
    }
    componentDidMount(){
        this.setState(this.props.st );
    }
    componentWillUpdate(){
        if(this.props.st.seek){
            this.setState(this.props.st )
            this.player.seekTo(this.props.st.nowSeconds,'seconds');
            this.props.st.seek=false;
        }
    }



    seek = (e)=>{
        this.setState({
            prevSeconds: this.state.nowSeconds,
            nowSeconds: e.playedSeconds
        })
        this.props.nowSecondsHandler(e.playedSeconds);
        if(Math.abs(this.state.nowSeconds-this.state.prevSeconds)>2){
            this.canUpdate=false;
            this.setState({prevSeconds: this.state.nowSeconds,playing: true});
            const eventType = this.props.user +" changed the player's timestamp";
            this.uploadState(eventType)
            console.log(this.props.st);
        }
    }

    play = ()=>{
        this.canUpdate=false;
        if(!this.props.st .playing){
            this.setState({playing: true});
            const eventType = this.props.user +' continued the player';
            this.uploadState(eventType)
            console.log(this.props.st );  
        }
    }
    pause = ()=>{
        if(this.props.st .playing){
            this.canUpdate=false;
            this.setState({playing: false});
            const eventType = this.props.user +' paused the player';
            this.uploadState(eventType)
            console.log(this.props.st );
        }
    }
    render(){
        return(
            <ReactPlayer url={this.props.st.url}
            ref = {this.ref}
            controls={true}
            playing={this.props.st.playing}
            onPlay={(e)=>this.play()}
            onPause={(e) => this.pause()}
            onEnded={this.props.videoEnd}
            progressInterval={500}
            onProgress={(e) => this.seek(e)}
            width='80%'
            height='400px'
            style={{maxWidth:'710px',display:'inline-block',margin:'40px'}}
            />
        )
    }
}

export default withRouter(PlayerWindow);