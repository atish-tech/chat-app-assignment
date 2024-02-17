import { IconButton, Popover, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { useDispatch, useSelector } from "react-redux";
import { changeTheam } from "../../../Features/Theam/toggleSlice";
import { useNavigate } from "react-router-dom";
import ContactSkelton from "../Skelton/ContactSkelton";

const ContactsPhone = ({ data, handelUserChat }) => {
  const navigateTo = useNavigate();
  const toogleTheam = useSelector((state) => state.toogle.value);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [accountInfo, setAccountInfo] = useState(undefined);

  // Set Current contact
  const changeCurrentChat = (item, index) => {
    handelUserChat(item);
    setCurrentUser(index);
  };

  // If user Not login
  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigateTo("/login");
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
    <div className="contact-container-phone">
      {/* top bar */}
      <div className="contact-header">
        {/* Account information  */}
        <div key={Math.random()} className="flex justify-center">
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
                className={`account-info p-5 ${
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
                <p>Email: {accountInfo.email} </p>
              </div>
            )}
          </Popover>
        </div>
        {/* toggle button */}
        <div key={Math.random()} className="flex">
          <IconButton onClick={() => dispatch(changeTheam())}>
            {toogleTheam ? (
              <NightlightIcon fontSize="large" />
            ) : (
              <LightModeIcon fontSize="large" />
            )}
          </IconButton>
          {/* Logout Button */}
          <IconButton onClick={logoutHandler}>
            <ExitToAppIcon className="text-slate-950" fontSize="large" />
          </IconButton>
        </div>
      </div>

      {/* All Contact container */}
      <div className={`contact-items ${toogleTheam ? " white-bg1" : ""}`}>
        {data.length === 0 ? (
          <ContactSkelton />
        ) : (
          data.map((item, index) => {
            return (
              <>
                <div
                  key={index}

                  onClick={() => changeCurrentChat(item, index)}
                  className={`contact-item ${
                    index === currentUser && "selectedUser"
                  } 
                                        ${
                                          toogleTheam && "txt-color1 white-bg2"
                                        } 
                                        ${
                                          index === currentUser &&
                                          toogleTheam &&
                                          "white-bg4"
                                        }`}
                >
                  <p
                    className={`contact-img-icon ${toogleTheam && "white-bg3"}`}
                  >
                    {item.name[0].toUpperCase()}
                  </p>
                  <p>{item.name}</p>
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactsPhone;
