import React, { useEffect, useRef, useState } from "react";
import "./ChatArea.css";
import { allUserRoute, getGroupListRoute, host } from "../../Utils/ApiRoutes";
import { Welcome } from "./Welcome";
import { TextContainer } from "./TextContainer";
import { Outlet, useNavigate } from "react-router-dom";
import Contacts from "./Contacts";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import MediaQuery from "react-responsive";
import { TextContainerPhone } from "./Phone/TextContainerPhone";
import ContactsPhone from "./Phone/ContactsPhone";
import GetAllUsers from "../AllUser/GetAllUsers";
import axios from "axios";
import { GroupText } from "../../Component/GroupText";

const ChatContainer = () => {
  const navigateTo = useNavigate();
  const socket = useRef();

  const [contact, setContact] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [groupList, setGroupList] = useState([]);
  const [personalChat, setPersonalChat] = useState(false);
  const [groupChat, setGroupChat] = useState(false);
  const toogleTheam = useSelector((state) => state.toogle.value);

  // phone view port code
  const [userContact, setUserContact] = useState(true);
  const backButton = () => {
    setUserContact(true);
  };

  // discunnected user
  const discunnectedUser = () => {
    console.log("..........");
    socket.current.emit("disconnectServer", currentUser.data._id);
  };

  // Group List
  const getGroupList = async (id) => {
    try {
      const response = await axios.get(getGroupListRoute);
      setGroupList([...response.data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  // get all contact
  useEffect(() => {
    // if user not login
    if (!localStorage.getItem("userData")) {
      navigateTo("/register");
    }

    // set current user
    else {
      async function fun() {
        setCurrentUser(await JSON.parse(localStorage.getItem("userData")));
      }
      fun();
    }

    // get all contact
    const userData = JSON.parse(localStorage.getItem("userData"));

    fetch(allUserRoute, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setContact(data);
      })
      .catch((error) => console.log(error));
    getGroupList(userData.data._id);
  }, []);

  // add current user to socket server
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.data._id);
      // console.log("current user" ,socket.current);
    }
    // return socket.current.emit("disconnect" , "currentUser")
  }, [currentUser]);

  // Change user chat
  const handelUserChat = (chat) => {
    setCurrentChat(chat);
    setUserContact(false);
    setPersonalChat(true);
    setGroupChat(false);
  };
  // change group chat
  const handelGroupChat = (chat) => {
    setGroupChat(true);
    setPersonalChat(false);
    setCurrentChat(chat);
  };

  return (
    <>
      {/* Phone View port */}
      {/* <MediaQuery maxWidth={800}>
        <div
          className={`chat-area-container-phone ${
            toogleTheam ? " white-bg2" : ""
          }`}
        >
          {contact !== undefined && userContact && (
            <ContactsPhone data={contact} handelUserChat={handelUserChat} />
          )}
          {currentChat !== undefined && !userContact && (
            <TextContainerPhone
              backButton={backButton}
              currentChat={currentChat}
              socket={socket}
            />
          )}
        </div>
      </MediaQuery> */}

      {/* Desktop view port */}
      {/* <MediaQuery minWidth={801}> */}
        <div
          className={`chat-area-container ${toogleTheam ? " white-bg2" : ""}`}
        >
          {/* Side bar 0.3 */}
          {contact !== undefined && (
            <Contacts
              discunnectedUser={discunnectedUser}
              data={contact}
              groupList={groupList}
              handelUserChat={handelUserChat}
              handelGroupChat={handelGroupChat}
            />
          )}
          {/* Chat Area 0.7 */}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <>
              {personalChat && (
                <TextContainer currentChat={currentChat} socket={socket} />
              )}
              {groupChat && (
                <GroupText currentChat={currentChat} socket={socket} />
              )}
            </>
          )}
        </div>
      {/* </MediaQuery> */}
    </>
  );
};

export default ChatContainer;
