import React, {useContext, useEffect, useState} from "react";
import ReactModal from "react-modal";
import Axios from "axios";
import "./../css/table.css";
import fileDownload from "js-file-download";
import "./../css/modal.css";
import { LoginContext } from "./LoginContext";

export default function ThesisOptionsModal({thesisId,thesisTopic}){
    const[isOpen,setIsOpen]=useState(false)
    const[promoters,setPromoters]=useState([])
    const[reviewer,setReviewer]=useState("Brak")
    const[newReviewer,setNewReviewer]=useState("")
    const[reviewerId,setReviewerId]=useState("")
    const[grade,setGrade]=useState(0.0)
    const[promoterGrade,setPromoterGrade]=useState(0.0)
    const[reviewerGrade,setReviewerGrade]=useState(0.0)
    const[path,setPath]=useState("")
    const[review,setReview]=useState("")

    const openModal=()=>{setIsOpen(true)}
    const closeModal=()=>{setIsOpen(false)}
    const{user}=useContext(LoginContext)
    const modalStyle = {
        content: {
          backgroundColor:"#9ecef0",
          width:"700px",
          height:"500px",
          margin:"auto",
        }
    }
    const handleChange=(e)=>{
        setReviewerId(e.target.value);
        setNewReviewer(e.target.selectedOptions[0].text);
    }
    const download=(path)=>{
        Axios.post("http://localhost:3001/download",{path:path}).then((response)=>{
            const name=path.replace("./files/","");
            fileDownload(response.data,name);
        })
    }
    const getThesis=()=>{
        Axios.post("http://localhost:3001/get_thesis",{id:thesisId}).then((response)=>{
            setPromoterGrade(response.data[0].promoterGrade)
            setReviewerGrade(response.data[0].reviewerGrade)
            setReviewer(response.data[0].fullname)
            setPath(response.data[0].path)
            setReview(response.data[0].review)
        })
    }
    const update=()=>{
        Axios.post("http://localhost:3001/setreviewer",{id:thesisId,reviewer:newReviewer,reviewerId:reviewerId});
        Axios.post("http://localhost:3001/creategrades",{id:thesisId});
        Axios.post("http://localhost:3001/getemail",{id:reviewerId}).then((response)=>{
          const email=response.data[0].email;
          sendEmail(email,thesisTopic);
      });
      setReviewer(newReviewer);
    }
    const updateGrade=()=>{
        Axios.put("http://localhost:3001/setpromotergrade",{id:thesisId,promotergrade:grade});
        setPromoterGrade(grade);       
    }
    const sendEmail=(email,thesisTopic)=>{
        Axios.post("http://localhost:3001/send",{to:email,subject:"Recenzent",
        text:`Promotor ${user[0].name} ${user[0].surname} wyznaczył Pana/Panią jako recenzenta tematu:${thesisTopic}`
        })
    }
    const getPromoters=()=>{
        Axios.post("http://localhost:3001/get_promoters",{id:user[0].iduser}).then((response)=>{
            setPromoters(response.data)
        })
    }
    useEffect(()=>{
        getThesis()
        getPromoters()
    },[])
    return(
        <>
        <td><button className="reservation-button" onClick={openModal}>Pokaż</button></td>
        
        <ReactModal style={modalStyle} isOpen={isOpen} onRequestClose={closeModal} ariaHideApp={false}>            
            <h3>Status pracy</h3>
            {(path)?
                <button className="download-button" onClick={()=>{download(path)}}>Pobierz plik</button>:<p>Brak pliku</p>
            }
            <h3>Wybierz recenzenta</h3>
            {!(path)?
                <p>Potrzebna jest praca, w celu wybrania recenzenta</p>:(!reviewer)?
                <>
                    <select className="select-value" onChange={handleChange}>
                    {promoters.map((val,key)=>(
                        <option key={val.iduser} value={val.iduser}>{val.name+" "+val.surname}</option>
                    ))}
                    </select>
                    <button className="download-button" onClick={update}>Zatwierdź</button>
                </>:<p>{reviewer}</p>
            }
            <h3>Opinia recenzenta</h3>
            {(!review)?
                <p>Brak</p>:<p>{review}</p>

            }
            <h3>Wystaw ocenę</h3>
            {!(path)?<p>Nie można jeszcze wystawić</p>:
                (!promoterGrade)?
                <>
                    <select className="select-value" onChange={(event)=>{setGrade(event.target.value);}}>
                        <option>2</option>
                        <option>3</option>
                        <option>3.5</option>
                        <option>4</option>
                        <option>4.5</option>
                        <option>5</option>
                    </select>
                    <button className="download-button" onClick={updateGrade}>Zatwierdź</button>
                </>:<p>{promoterGrade}</p>
            }
            <h3>Ocena recenzenta</h3>
            {!(reviewerGrade)?<p>Brak</p>:<p>{reviewerGrade}</p>}
            <button className="download-button" onClick={closeModal}>Wyjdź</button>
        </ReactModal>
    </>
    )
}