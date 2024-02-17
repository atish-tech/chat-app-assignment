import React from 'react'
import ContactSkelton from '../Container/ChatArea/Skelton/ContactSkelton';

export const GroupList = ({data , currentGroup , toogleTheam , changeGroupChat}) => {
  return (
    <div className={`contact-items ${toogleTheam ? " white-bg1" : ""}`}>
      {data.length === undefined ? (
        <ContactSkelton />
      ) : (
        data.map((item, index) => {
          return (
            <>
              <div 
                key={index}
                onClick={() => changeGroupChat(item, index)}
                className={`contact-item ${
                  index === currentGroup && "selectedUser"
                } 
                                        ${
                                          toogleTheam && "txt-color1 white-bg2"
                                        } 
                                        ${
                                          index === currentGroup &&
                                          toogleTheam &&
                                          "white-bg4"
                                        }`}
              
              >
                <p className={`contact-img-icon ${toogleTheam && "white-bg3"}`}>
                  {item.groupName[0].toUpperCase()}
                </p>
                <p>{item.groupName}</p>
              </div>
            </>
          );
        })
      )}
    </div>
  )
}
