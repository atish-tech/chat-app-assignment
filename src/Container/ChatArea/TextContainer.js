import { IconButton, Snackbar, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { addMessage, getMessage } from "../../Utils/ApiRoutes";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import ChatSkelton from "./Skelton/ChatSkelton";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assect/logo.png";
import CloseIcon from "@mui/icons-material/Close";

export const TextContainer = ({ currentChat, socket }) => {
  const [msg, setMsg] = useState("");
  const [userChat, setUserChats] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const scrollRef = useRef();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const toogleTheam = useSelector((state) => state.toogle.value);
  const navigateTo = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const [socketMessage, setSocketMessage] = useState("");
  const [isTyping , setIsTyping] = useState(false);
  // If user Not login
  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigateTo("/login");
    }
  }, []);

  // get chat
  const getChat = async () => {
    try {
      const getChat = async () => {
        const body = {
          from: userData.data._id,
          to: currentChat._id,
        };
        const response = await axios.post(getMessage, body);
        setUserChats(response.data);
      };
      getChat();
      setChatLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get current user Chat
  useEffect(() => {
    setChatLoading(true);
    // setInterval(getChat, 5000);
    getChat();
  }, [currentChat]);

  // recive message
  useEffect(() => {
    if (socket.current) {
      // current message
      socket.current.on("message-recive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
        setSocketMessage(msg);
        setOpenNotification(true);
      });
      // if user typing
      socket.current.on("typing", () => {
        setIsTyping(true);
        setTimeout(() => {setIsTyping(false)} , 2000);
      });
    }
  }, [socket]);

  // if any msg arive
  useEffect(() => {
    arrivalMessage && setUserChats((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  // Set scrool behavior
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userChat]);

  // send message
  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      const msgs = [...userChat];
      msgs.push({ fromSelf: true, message: msg });
      setUserChats(msgs);
      setMsg("");

      const content = {
        from: userData.data._id,
        to: currentChat._id,
        message: msg,
      };
      socket.current.emit("send-message", {
        to: currentChat._id,
        from: userData.data._id,
        message: msg,
      });

      await axios.post(addMessage, content);
    } catch (error) {
      console.log(error.message);
    }
  };

  // typing indicator
  const typingMsg = () => {
    socket.current.emit("typing", {
      to: currentChat._id,
      from: userData.data._id,
    });
  };

  // close notofication
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotification(false);
  };

  // Socket Action
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="text-container">
      {/* Text Header */}
      <Snackbar
        open={openNotification}
        autoHideDuration={2000}
        message={socketMessage}
        onClose={handleClose}
        action={action}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
      <div className={`text-header ${toogleTheam && "white-bg1 txt-color1"}`}>
        <div className="flex items-center gap-4">
          <p className={`contact-img-icon ${toogleTheam && "white-bg3"}`}>
            {currentChat.name[0].toUpperCase()}
          </p>
       <div className="flex flex-col items-start">
        {/* user Name */}
       <p className="text-4xl">{currentChat.name}</p>
          {/* Typing indicater */}
        <p className="text-sm text-green-400"> {isTyping ? "Typing..." : ""} </p>
       </div>
        </div>
        
        <div>
          <IconButton>
            <MoreVertIcon fontSize="large" />
          </IconButton>
        </div>
      </div>

      {/* Text Area */}
      {
        // skelton
        chatLoading && (
          <div className={`message-area ${toogleTheam && "white-bg3"}`}>
            <ChatSkelton />
          </div>
        )
      }
      {
        // no chat message
        userChat.length === 0 && !chatLoading && (
          <div className={`message-area-no-chat ${toogleTheam && "white-bg3"}`}>
            <img className="no-message-img" src={Logo} alt="no-chat" />
            <p className="text-emerald-800">Start Your Conversation</p>
          </div>
        )
      }
      {
        // all chats
        userChat.length > 0 && !chatLoading && (
          <div className={`message-area ${toogleTheam && "white-bg3"}`}>
            {userChat.map((d) => {
              return (
                <div
                  ref={scrollRef}
                  key={uuidv4()}
                  className={d.fromSelf === true ? "send-chat" : "recive-chat"}
                >
                  {/* Recive chat icon */}
                  {!d.fromSelf && (
                    <p style={{maxWidth: "250px"}}
                      className={`contact-img-icon ${
                        toogleTheam && "white-bg2 txt-color1"
                      }`}
                    >
                      {currentChat.name[0].toUpperCase()}
                    </p>
                  )}
                  <p 
                    className={`${
                      d.fromSelf ? "send-chat-content" : "recive-chat-content"
                    }
                    ${toogleTheam && "white-bg1 txt-color1"}`}
                  >
                   <div className="flex overflow-auto" style={{maxWidth: "300px"}}> <p>{d.message}</p></div>
                  </p>
                </div>
              );
            })}
          </div>
        )
      }

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className={`text-area ${toogleTheam && "white-bg1"}`}
      >
        <input
          onChange={(e) => {
            setMsg(e.target.value);
            typingMsg();
          }}
          value={msg}
          name="message"
          className={`input-text-content ${
            toogleTheam && "white-bg1 txt-color1"
          }`}
        />
        <IconButton type="submit">
          {" "}
          <SendIcon fontSize="large" />{" "}
        </IconButton>
      </form>
    </div>
  );
};
