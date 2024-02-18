import { IconButton, Snackbar, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../Assect/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import ChatSkelton from "../Container/ChatArea/Skelton/ChatSkelton";
import { getGroupDataRoute, sendMessageinGroupRoute } from "../Utils/ApiRoutes";

export const GroupText = ({ currentChat, socket }) => {
  const [msg, setMsg] = useState("");
  const [userChat, setUserChats] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const scrollRef = useRef();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const user_id = userData.data._id;
  const toogleTheam = useSelector((state) => state.toogle.value);
  const navigateTo = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const [socketMessage, setSocketMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [groupChat, setGroupChat] = useState([]);

  //   get chat from database
  const getGroupMessage = async () => {
    try {
      const body = {
        groupId: currentChat._id,
        userId: userData.data._id,
      };
      const response = await axios.post(getGroupDataRoute, body);
      setGroupChat([...response.data.data]);
      // join in a group
      socket.current.emit("join" , ({group : body.groupId}));
    } catch (error) {
      console.log(error);
    }
  };

  // send message in group
  const sendMessage = async (e) => {
    e.preventDefault();
    if (msg == "") return;
    try {
      setGroupChat([...groupChat, { _id: user_id, message: msg }]);

      const body = {
        groupId: currentChat._id,
        userId: user_id,
        message: msg,
      };

      socket.current.emit(`send-group-message`,( {message : msg , group: body.groupId}));

      setMsg("");

      await axios.post(sendMessageinGroupRoute, body);
    } catch (error) {}
  };

//   recive message from socket
  useEffect(() => {
    socket.current.on(`recive-group-message` , (data) => {
        if(data.group === currentChat._id) {
          setGroupChat((prev) => [...prev , {message : data.message}])
        }
    })
  } , [socket])

  useEffect(() => {
    getGroupMessage();
  }, [currentChat]);

  // Set scrool behavior
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupChat]);

  return (
    <div className="text-container">
      {/* Text Header */}

      <div className={`text-header ${toogleTheam && "white-bg1 txt-color1"}`}>
        <div className="flex items-center gap-4">
          <p className={`contact-img-icon ${toogleTheam && "white-bg3"}`}>
            {currentChat.groupName[0].toUpperCase()}
          </p>
          <div className="flex flex-col items-start">
            {/* user Name */}
            <p className="text-4xl">{currentChat.groupName}</p>
            {/* Typing indicater */}
            <p className="text-sm text-green-400">
              {" "}
              {isTyping ? "Typing..." : ""}{" "}
            </p>
          </div>
        </div>

        <div>
          <IconButton>
            <MoreVertIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
      {
        // all chats

        <div className={`message-area ${toogleTheam && "white-bg3"}`}>
          {groupChat.map((item) => {
            return (
              <div
                ref={scrollRef}
                key={uuidv4()}
                className={
                  item._id === userData.data._id ? "send-chat" : "recive-chat"
                }
              >
                <p
                  className={`recive-chat-content 
                    ${toogleTheam && " white-bg1 txt-color1"}`}
                >
                  <div
                    className="flex overflow-auto"
                    style={{ maxWidth: "300px" }}
                  >
                    <p>{item.message}</p>
                  </div>
                </p>
              </div>
            );
          })}
        </div>
      }

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className={`text-area ${toogleTheam && "white-bg1"}`}
      >
        <input
          onChange={(e) => {
            setMsg(e.target.value);
            // typingMsg();
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
