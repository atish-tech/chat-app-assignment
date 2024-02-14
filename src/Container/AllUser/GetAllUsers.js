import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheam } from '../../Features/Theam/toggleSlice';
import { useNavigate } from 'react-router-dom';
import ContactSkelton from '../ChatArea/Skelton/ContactSkelton';

const GetAllUsers = ({ data, handelUserChat, setGetAllUsersBtn }) => {
  const navigateTo = useNavigate();
  const toogleTheam = useSelector((state) => state.toogle.value);
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser] = useState(undefined);

  // Set Current contact
  const changeCurrentChat = (item, index) => {
    handelUserChat(item);
    setCurrentUser(index);
  }

  // If user Not login
  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigateTo("/");
    }
  }, [])

  return (
    <div className='contact-container'>
      {/* top bar */}
      <div className='contact-header'>
        <IconButton onClick={() => setGetAllUsersBtn(false)} >
          <PersonIcon className='text-slate-950' fontSize='large' />
        </IconButton>
        <div className='flex'>
          {/* Get All User Button */}
          <IconButton onClick={() => setGetAllUsersBtn(true)}>
            <GroupAddIcon fontSize='large' />
          </IconButton>
          {/* toggle button */}
          <IconButton onClick={() => dispatch(changeTheam())}>
            {
              toogleTheam ? <NightlightIcon fontSize='large' />
                : <LightModeIcon fontSize='large' />
            }
          </IconButton>
          {/* Logout Button */}
          <IconButton>
            <ExitToAppIcon className='text-slate-950' fontSize='large' />
          </IconButton>
        </div>
      </div>

      {/* All Contact container */}
      <div className={`contact-items ${toogleTheam ? " white-bg1" : ""}`}>
        {
          data.length === 0 ? <ContactSkelton />
            : data.map((item, index) => {
              return (
                <>
                  <div
                    onClick={() => changeCurrentChat(item, index)}
                    className={`contact-item ${index === currentUser && "selectedUser"} 
                                        ${toogleTheam && 'txt-color1 white-bg2'} 
                                        ${index === currentUser && toogleTheam && "white-bg4"}`}
                    key={item._id}>
                    <p className={`contact-img-icon ${toogleTheam && 'white-bg3'}`}>{item.name[0].toUpperCase()}</p>
                    <p>{item.name}</p>
                  </div>
                </>
              )
            })
        }
      </div>

    </div>
  )
}

export default GetAllUsers