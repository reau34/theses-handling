import ReactModal from "react-modal";
import React, { useState,useContext } from "react";
import { LoginContext } from "./LoginContext";
import Axios from "axios"
import "./../css/modal.css"

export default function ConfirmReservationModal({thesisId,thesisTopic,addedby,status}){
     
    const{user,setReservation}=useContext(LoginContext)
    const newStatus="Zarezerwowane";
    const reservedBy=user[0].name+" "+user[0].surname;
    const[isOpen,setIsOpen]=useState(false)
    const openModal=()=>{setIsOpen(true)}
    const closeModal=()=>{setIsOpen(false)} 
    const modalStyle = {
        content: {
          backgroundColor:"#9ecef0",
          width:"200px",
          height:"150px",
          margin:"auto",
        }
    }
    const makeReservation = () =>{
        setReservation(true)
        Axios.put("http://localhost:3001/update",{reservedby:reservedBy,id:thesisId,userId:user[0].iduser,status:newStatus});
        Axios.post("http://localhost:3001/getemail",{id:addedby}).then((response)=>{
          const email=response.data[0].email;
          sendEmail(email);
      })
      }
      const sendEmail=(email)=>{
        Axios.post("http://localhost:3001/send",{to:email,subject:"Rezerwacja",
        text:`Student ${user[0].name} ${user[0].surname} dokonał rezerwacji tematu:${thesisTopic}`
        })
      }
    return(
        <>
            <td><button className="reservation-button" onClick={openModal}>{status}</button></td>
            <ReactModal style={modalStyle} isOpen={isOpen} onRequestClose={closeModal} ariaHideApp={false}>
                <h4 className="center-align">Potwierdasz operacje?</h4>
                <div className="center-align">
                    <button className="approve-button" onClick={makeReservation}>Tak</button>
                    <button className="reject-button" onClick={closeModal}>Nie</button>
                </div>
            </ReactModal>
      </>
    )
}