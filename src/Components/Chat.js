import React, { Component } from 'react';
import '../Containers/PartyPage.css'
import Draggable from 'react-draggable';
import '../Containers/PartyPage.css'
class Chat extends Component{
    // scrollToBottom = () => {
    //     this.messagesEnd.scrollIntoView({ behavior: 'smooth'});
    // }
      
    // componentDidMount() {
    //     this.scrollToBottom();
    // }
      
    // componentDidUpdate() {
    //     this.scrollToBottom();
    //  }
    render(){
    return (
    <Draggable bounds="body">
    <div className='card'>
        <p style={{fontSize:'20px',fontWeight:'900'}}>Chat</p>
    <div className='card-over' style={{display: 'flex',flexDirection: 'column-reverse'}}>
        {this.props.chats ? this.props.chats.reverse().map(msg=>{
            return(
                <div>
                    <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                    <p style={{fontWeight: '900'}}>{msg.name}</p>
                    <p>{msg.msg}</p>
                </div>
            )
            
        }):'Start chatting!'}
    </div>
            <input style={{display:'inline-block'}} placeholder='Say hi!' className='input' style={{textAlign:'end'}} onChange={this.props.changeInput} value={this.props.chatval}/>
            <button style={{width:'90px', display:'inline-block',paddingBottom:'-5px',marginLeft:'10px'}} className='btn label' onClick={this.props.postChat}>Send</button>
        <div ref={el => (this.messagesEnd = el)}  />
    </div>
    </Draggable>
    );
    }
}

export default Chat;