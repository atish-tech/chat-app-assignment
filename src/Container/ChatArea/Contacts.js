import { Avatar, IconButton, Popover, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useDispatch, useSelector } from "react-redux";
import { changeTheam } from "../../Features/Theam/toggleSlice";
import { useNavigate } from "react-router-dom";
import ContactSkelton from "./Skelton/ContactSkelton";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import GroupIcon from "@mui/icons-material/Group";
import { UserList } from "../../Component/UserList";
import { GroupList } from "../../Component/GroupList";

const Contacts = ({ data, handelUserChat, handelGroupChat ,  groupList }) => {
  const navigateTo = useNavigate();
  const toogleTheam = useSelector((state) => state.toogle.value);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [accountInfo, setAccountInfo] = useState(undefined);
  const [groupChatPersonalChat, setGroupChatPersonalChat] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(undefined);

  // Set Current contact
  const changeCurrentChat = (item, index) => {
    handelUserChat(item);
    setCurrentUser(index);
  };

  // Set Current group
  const changeGroupChat = (item, index) => {
    setCurrentGroup(index);
    handelGroupChat(item)
  };

  // If user Not login
  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigateTo("/register");
    }
    const accountInfo = async () => {
      setAccountInfo(await JSON.parse(localStorage.getItem("userData")).data);
    };
    accountInfo();
  }, []);

  // Logout Button Function
  const logoutHandler = () => {
    localStorage.removeItem("userData");
    navigateTo("/login");
  };

  // Get account detail
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="contact-container">
      {/* top bar */}
      <div className="contact-header">
        {/* Account information  */}
        <div className="flex justify-center">
          <IconButton onClick={handleClick}>
            <PersonIcon className="text-slate-950" fontSize="large" />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {accountInfo !== undefined && (
              <div
                className={`account-info ${
                  toogleTheam ? " white-bg1" : " bg-slate-900 text-purple-50 "
                }`}
              >
                <div className="flex  gap-5 p-5">
                  <p
                    className={`contact-img-icon ${toogleTheam && "white-bg3"}`}
                  >
                    {accountInfo.name[0].toUpperCase()}
                  </p>
                  <p> {accountInfo.name} </p>
                </div>
                <Typography sx={{ p: 2 }}>
                  Email: {accountInfo.email}{" "}
                </Typography>
              </div>
            )}
          </Popover>
        </div>
        <div className="flex">
          {/* Personal chat icon */}
          <IconButton onClick={() => setGroupChatPersonalChat(false)}>
            <LockPersonIcon fontSize="large" />
          </IconButton>
          {/* Group Chat Icon */}
          <IconButton onClick={() => setGroupChatPersonalChat(true)}>
            <GroupIcon fontSize="large" />
          </IconButton>
          {/* toggle button */}
          <IconButton onClick={() => dispatch(changeTheam())}>
            {toogleTheam ? (
              <NightlightIcon fontSize="large" />
            ) : (
              <LightModeIcon fontSize="large" />
            )}
          </IconButton>
          {/* Logout Button */}
          <IconButton>
            <ExitToAppIcon
              onClick={logoutHandler}
              className="text-slate-950"
              fontSize="large"
            />
          </IconButton>
        </div>
      </div>

      {/* All Contact container */}
      {groupChatPersonalChat ? (
        <GroupList
          data={groupList}
          currentGroup={currentGroup}
          changeGroupChat={changeGroupChat}
          toogleTheam={toogleTheam}
        />
      ) : (
        <UserList
          changeCurrentChat={changeCurrentChat}
          toogleTheam={toogleTheam}
          currentUser={currentUser}
          data={data}
        />
      )}
    </div>
  );
};

export default Contacts;
