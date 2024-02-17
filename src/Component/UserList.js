import React from "react";
import ContactSkelton from "../Container/ChatArea/Skelton/ContactSkelton";

export const UserList = ({data , changeCurrentChat , currentUser , toogleTheam}) => {
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
                <p className={`contact-img-icon ${toogleTheam && "white-bg3"}`}>
                  {item.name[0].toUpperCase()}
                </p>
                <p>{item.name}</p>
              </div>
            </>
          );
        })
      )}
    </div>
  );
};
