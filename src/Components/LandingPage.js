import React from 'react'
import './LandingPage.css'
import '../Containers/JoinPage.css'
import Draggable from 'react-draggable'
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';

const LandingPage = props => {

    const makeId=length=>{
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
    }
    const custom = ()=>{
        props.history.push("/create/")
    }
    const quick = ()=>{
        const postObject = {
            chats: [],
            events: [],
            nowSeconds: 0,
            prevSeconds: 0,
            playing: false,
            seek: false,
            url: 'https://www.youtube.com/watch?v=Wl959QnD3lM',
            urlList: ['https://www.youtube.com/watch?v=Wl959QnD3lM'],
            users: []
        }
        const id = makeId(10);
        const db = firebase.firestore();
        db.collection('parties').doc(id).set(postObject).then(()=>{
            props.history.push("/party/"+id);
        })
    }


    return(
        <div>
            <div className='section' style={{backgroundColor:'#3d405b'}}>
                <p className='title'>Watch synchronized videos with your friends whenever and wherever</p>
                <p className='subtitle' style={{margin: '60px 0px 40px 0px',color:'rgba(255,255,255,0.7)'}}>Create a room now. It's free!</p>
                <button className='btn label' style={{display:'inline-block', width:'200px',marginRight:'25px'}} onClick={()=>quick()}>Quick create</button>
                <button className='btn label' style={{display:'inline-block', width:'200px'}} onClick={()=>custom()}>Create custom</button>
            </div>
            <div className='section' style={{backgroundColor:'rgba(0,0,0,0.8)'}}>
                <p className='subtitleN'>Features</p>
                <Draggable bounds="body">
                    <div className='smolCard'>
                        <p className='subtitle' style={{color:'orange'}}>Sync up</p>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                        <p>The videos are automaticly synced up and play at the same time for everyone</p>
                    </div>
                </Draggable>
                <Draggable bounds="body">
                    <div className='smolCard'>
                        <p className='subtitle' style={{color:'#BB86FC'}}>Customizable room</p>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                        <p>Drag elements anywhere to create the perfect setup for you. Try on me, drag me anywhere!</p>
                    </div>
                </Draggable>
                <Draggable bounds="body">
                    <div className='smolCard'>
                        <p className='subtitle' style={{color:'#03DAC5'}}>Dark mode</p>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                        <p>Your room is now 100% dark themed</p>
                    </div>
                </Draggable>
                <Draggable bounds="body">
                    <div className='smolCard'>
                        <p className='subtitle' style={{color:'#FF0266'}}>Queue</p>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                        <p>Queue up your favorite videos and they will automaticly keep playing</p>
                    </div>
                </Draggable>
            </div>
            <div className='section' style={{backgroundColor:'#84a59d'}}>
                <p className='subtitleN'>Supported platforms:</p>
                <div>
                    <p className='listItems' style={{display: 'inline-block',marginLeft:'0px'}}>Youtube</p>
                    <p className='listItems' style={{display: 'inline-block'}}>Twitch</p>
                    <p className='listItems' style={{display: 'inline-block'}}>Vimeo</p>
                    <p className='listItems' style={{display: 'inline-block'}}>Soundcloud</p>
                    <p className='listItems' style={{display: 'inline-block'}}>MixCloud</p>
                    <p className='listItems' style={{display: 'inline-block'}}>DailyMotion</p>
                    <p className='listItems' style={{display: 'inline-block'}}>Facebook</p>
                    <p className='listItems' style={{display: 'inline-block'}}>Netflix<pre style={{fontSize:'10px',color:'rgba(255,255,255,0.6)'}}> (Coming soon {'\n'}- Chorme Add-on)</pre></p>
                </div>
            </div>
        </div>
    )
}

export default withRouter(LandingPage);