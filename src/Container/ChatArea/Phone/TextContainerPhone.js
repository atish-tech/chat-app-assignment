import { IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { addMessage, getMessage } from '../../../Utils/ApiRoutes';
import { v4 as uuidv4 } from "uuid";
import { useSelector } from 'react-redux';
import ChatSkelton from '../Skelton/ChatSkelton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

export const TextContainerPhone = ({ currentChat, socket, backButton }) => {
  const [msg, setMsg] = useState("");
  const [userChat, setUserChats] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const scrollRef = useRef();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const toogleTheam = useSelector((state) => state.toogle.value);
  const navigateTo = useNavigate();

  // If user Not login
  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigateTo("/");
    }
  }, [])

  
   // get chat 
   const getChat = async () => {
    try {
      const getChat = async () => {
        const body = {
          from: userData.data._id,
          to: currentChat._id,
        }
        const response = await axios.post(getMessage, body);
        setUserChats(response.data);
      }
      getChat();
      setChatLoading(false);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  // Get current user Chat
  useEffect(() => {
    setChatLoading(true);
    // setInterval(getChat, 5000);
    getChat();
  }, [currentChat]);

  // recive message
  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-recive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
        // arrivalMessage && setUserChats((prev) => [...prev, arrivalMessage]);
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setUserChats((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userChat]);

  // send message
  const sendMessage = async (event) => {
    event.preventDefault();
    // msgs.push({ fromSelf: true, message: msg });

    try {
      const content = {
        from: userData.data._id,
        to: currentChat._id,
        message: msg,
      }
      socket.current.emit("send-message", {
        to: currentChat._id,
        from: userData.data._id,
        message: msg,
      })

      await axios.post(addMessage, content);

      const msgs = [...userChat];
      msgs.push({ fromSelf: true, message: msg });
      setUserChats(msgs);
      setMsg("");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='text-container-phone'>
      {/* Text Header */}
      <div className={`text-header ${toogleTheam && 'white-bg1 txt-color1'}`}>
        <div className='flex items-center gap-4'>
          <IconButton onClick={backButton}>
            <ArrowBackIosIcon fontSize='large' />
          </IconButton>
          <p className={`contact-img-icon ${toogleTheam && 'white-bg3'}`}>
            {currentChat.name[0].toUpperCase()}
          </p>
          <p>{currentChat.name}</p>
        </div>
        <div>
          <IconButton>
            <MoreVertIcon fontSize='large' />
          </IconButton>
        </div>
      </div>

      {/* Text Area */}
      {
        // skelton
        chatLoading &&
        <div className={`message-area ${toogleTheam && 'white-bg3'}`}>
          <ChatSkelton />
        </div>
      }
      {
        // no chat message
        userChat.length === 0 && !chatLoading &&
        <div className={`message-area-no-chat ${toogleTheam && 'white-bg3'}`}>
          <img className='no-message-img'
            src='https://cdn3.iconfinder.com/data/icons/social-media-tools/30/conversation-512.png'
            alt='no-chat' />
          <p className='text-emerald-800'>Start Your Conversation</p>
        </div>
      }
      {
        // all chats
        userChat.length > 0 && !chatLoading &&
        <div className={`message-area ${toogleTheam && 'white-bg3'}`}>
          {
            userChat.map((d) => {
              return (
                <div ref={scrollRef} key={uuidv4()}
                  className={d.fromSelf === true ? "send-chat" : "recive-chat"}
                >
                  {/* Recive chat icon */}
                  {
                    !d.fromSelf &&
                    <p className={`contact-img-icon ${toogleTheam && 'white-bg2 txt-color1'}`}>
                      {currentChat.name[0].toUpperCase()}
                    </p>
                  }
                  <p
                    className={`${d.fromSelf ? 'send-chat-content' : 'recive-chat-content'}
                    ${toogleTheam && 'white-bg1 txt-color1'}`}
                  >
                    {d.message}
                  </p>
                </div>)
            })
          }
        </div>
      }

      {/* Input */}
      <form onSubmit={sendMessage} className={`text-area ${toogleTheam && 'white-bg1'}`}>
        <input
          onChange={(e) => setMsg(e.target.value)}
          value={msg} name="message"
          className={`input-text-content ${toogleTheam && 'white-bg1 txt-color1'}`}
        />
        <IconButton type='submit'> <SendIcon fontSize='large' /> </IconButton>
      </form>
    </div>
  )
}
