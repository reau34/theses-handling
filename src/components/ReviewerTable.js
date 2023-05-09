import React, { useEffect, useState, useContext } from "react"
import {LoginContext} from "./LoginContext"
import fileDownload from "js-file-download"
import Axios from "axios"
import "./../css/table.css"

export default function ReviewerTable(){
    const{user}=useContext(LoginContext)
    const[theses,setTheses]=useState([])
    const[grade,setGrade]=useState(0.0);
    const[review,setReview]=useState("");
    const reviewerTheses=()=>{
        Axios.post("http://localhost:3001/reviewer_theses",{userId:user[0].iduser}).then((response)=>{
            setTheses(response.data)
        })
    }
    useEffect(()=>{
        reviewerTheses()
        console.log(theses)
    },[])
    const updateGrade=(thesisId)=>{
        Axios.put("http://localhost:3001/setreviewergrade",{id:thesisId,reviewergrade:grade});
    };
    const updateReview=(thesisId)=>{
        Axios.put("http://localhost:3001/setreview",{id:thesisId,review:review});
    };
    const download=(path)=>{
        Axios.post("http://localhost:3001/download",{path:path}).then((response)=>{
            const name=path.replace("./files/","");
            fileDownload(response.data,name);
        })
    };
    return(
        <table className="content-table">
            <thead>
                <tr>
                    <th>Temat pracy</th>
                    <th>Promotor</th>
                    <th>Stopień</th>
                    <th>Wydział</th>
                    <th>Kierunek</th>
                    <th>Ocena promotora</th>
                    <th>Ocena recenzenta</th>
                    <th>Opinia recenzenta</th>
                    <th>Praca</th>
                </tr>
            </thead>
            <tbody>
                {theses.map((val,key)=>{
                    return(
                        <tr key={val.idtheses+101}>
                            <td>{val.topic}</td>
                            <td>{val.promoter}</td>
                            <td>{val.degree}</td>
                            <td>{val.faculty}</td>
                            <td>{val.fieldofstudy}</td>
                            {(val.promotergrade===null || val.promotergrade===undefined)?
                                <td>Brak</td>:<td>{val.promotergrade}</td>
                            }
                            {(val.reviewergrade===null || val.reviewergrade===undefined)?
                                <td>
                                    <select className="input" onChange={(event)=>{setGrade(event.target.value);}}>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>3.5</option>
                                        <option>4</option>
                                        <option>4.5</option>
                                        <option>5</option>
                                    </select>
                                    <button className="confirm-button" onClick={()=>{updateGrade(val.idtheses)}}>Zatwierdź</button>
                                </td>:<td>{val.reviewergrade}</td>
                            }
                            {(val.review===null || val.review===undefined)?
                                <td><input type="input" placeholder="Recenzja" onChange={(event)=>{setReview(event.target.value)}}/><button className="confirm-button" onClick={()=>{updateReview(val.idtheses)}}>Zatwierdź</button></td>:
                                <td>{val.review}</td>
                            }
                            {(val.path===null || val.path===undefined)?
                                <td>Brak</td>:<td><button className="download-button" onClick={()=>{download(val.path);}}>Pobierz</button></td>
                            }
                        </tr>
                    )
                })
                
                }
            </tbody>
        </table>
    )
}