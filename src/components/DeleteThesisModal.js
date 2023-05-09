import ReactModal from "react-modal";
import React, { useState } from "react";
import "./../css/modal.css"
import Axios from "axios"

export default function DeleteThesisModal({id}){
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
    const deleteThesis=(thesisId)=>{
      Axios.delete(`http://localhost:3001/delete/${thesisId}`)
    }
    return(
        <>
        <td><button className="reservation-button" onClick={openModal}>Usuń</button></td>
          <ReactModal style={modalStyle} isOpen={isOpen} onRequestClose={closeModal} ariaHideApp={false}>
              <h4 className="center-align">Potwierdasz operacje?</h4>
              <div className="center-align">
                <button className="approve-button" onClick={()=>{deleteThesis(id)}}>Tak</button>
                <button className="reject-button" onClick={closeModal}>Nie</button>
              </div>
          </ReactModal>
      </>
    )
}