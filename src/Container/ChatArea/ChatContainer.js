import React, { useEffect, useRef, useState } from 'react'
import "./ChatArea.css"
import { allUserRoute, host } from '../../Utils/ApiRoutes';
import { Welcome } from './Welcome';
import { TextContainer } from './TextContainer';
import { Outlet, useNavigate } from 'react-router-dom';
import Contacts from './Contacts';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive'
import { TextContainerPhone } from './Phone/TextContainerPhone';
import ContactsPhone from './Phone/ContactsPhone';
import GetAllUsers from '../AllUser/GetAllUsers';

const ChatContainer = () => {
  const navigateTo = useNavigate();
  const socket = useRef();

  const [contact, setContact] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const toogleTheam = useSelector((state) => state.toogle.value);

  // phone view port code
  const [userContact, setUserContact] = useState(true);
  const backButton = () => {
    setUserContact(true);
  }
 
  // get all contact
  useEffect(() => {
    // if user not login
    if (!localStorage.getItem("userData")) {
      navigateTo("/register");
    }

    // set current user
    else {
      async function fun() {
        setCurrentUser(await JSON.parse(localStorage.getItem('userData')));
      }
      fun();
    }

    // get all contact
    const userData = JSON.parse(localStorage.getItem('userData'));

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
  }, []);

  // add current user to socket server
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.data._id);
    }
  }, [currentUser]);

  // Change user chat
  const handelUserChat = (chat) => {
    setCurrentChat(chat);
    setUserContact(false)
  }

  return (
    <>
      {/* Phone View port */}
      <MediaQuery maxWidth={800}>
        <div className={`chat-area-container-phone ${toogleTheam ? " white-bg2" : ""}`}>
          {
            contact !== undefined && userContact &&
            <ContactsPhone data={contact} handelUserChat={handelUserChat} />
          }
          {
            currentChat !== undefined && !userContact &&
            <TextContainerPhone backButton={backButton} currentChat={currentChat} socket={socket} />
          }
        </div>
      </MediaQuery>

      {/* Desktop view port */}
      <MediaQuery minWidth={801}>
        <div className={`chat-area-container ${toogleTheam ? " white-bg2" : ""}`}>
          {/* Side bar 0.3 */}
          { 
            contact !== undefined &&
            <Contacts data={contact} handelUserChat={handelUserChat} />
          }
          {/* Chat Area 0.7 */}
          {
            currentChat === undefined ? <Welcome />
              : <TextContainer currentChat={currentChat} socket={socket} />
          }
        </div>
      </MediaQuery>
    </>
  )
}

export default ChatContainer