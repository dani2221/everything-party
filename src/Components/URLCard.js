import React from 'react'
import '../Containers/PartyPage.css'
import Draggable from 'react-draggable'

const URLCard = props =>{
    return(
        <Draggable bounds="body">
        <div className='card'>
            <p style={{fontSize:'20px',fontWeight:'900'}}>Queue</p>
            <div className='card-over'>
            {props.urls ? props.urls.map((url,index)=>{
                if(index===0){
                return(
                    <div>
                        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                        <p style={{fontWeight:'900'}}>Current</p>
                        <p style={{color:'orange'}}>{url}</p>
                    </div>
                )
                }else{
                    return(
                        <div>
                            <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
                            <p>{url}</p>
                        </div>
                    )
                }
            }):''}
        </div>
        <hr style={{border:'1px solid rgba(255,255,255,0.1)'}}/>
        <input onChange={props.changeInput} value={props.inputURL} placeholder='Your URL' className='input' style={{margin:'0px'}} type='text'/>
        <button style={{display:'inline-block', marginRight:'30px',color:'white',width:'130px',marginBottom:'20px'}} className='btn label' onClick={props.postURL}>Add</button>
        <button style={{display:'inline-block',color:'white',width:'130px',marginBottom:'20px'}} className='btn label' onClick={props.skipURL}>Skip</button>
    </div>
    </Draggable>
    )
}

export default URLCard;