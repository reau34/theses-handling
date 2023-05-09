import React, { useContext, useEffect, useState } from "react";
import Axios from "axios"
import { LoginContext } from "./LoginContext";
import DeleteThesisModal from "./DeleteThesisModal";
import ThesisOptionsModal from "./ThesisOptionsModal";
import "./../css/table.css"

export default function PromoterTable(){
    const{user}=useContext(LoginContext)
    const promoter=user[0].name+" "+user[0].surname
    const status="Zarezerwuj"
    const[topic,setTopic]=useState("")
    const[degree,setDegree]=useState("Licencjat")
    const[faculty,setFaculty]=useState("Leśny")
    const[fieldOfStudy,setFieldOfStudy]=useState("Informatyka")
    const[type,setType]=useState("Stacjonarnie")
    const[theses,setTheses]=useState([])
    const[students,setStudents]=useState([])
    const[student,setStudent]=useState("")
    const[studentId,setStudentId]=useState("")

    const getPromoterTheses=()=>{
        Axios.post("http://localhost:3001/promoter_theses",{addedby:user[0].iduser}).then((response)=>{
            setTheses(response.data)
        })
    }
    const getStudents=()=>{
        Axios.get("http://localhost:3001/students").then((response)=>{
            setStudents(response.data);
        })
    }
    useEffect(()=>{
        getPromoterTheses()
        getStudents()
    },[theses,students])
    const addTopic=()=>{
        Axios.post("http://localhost:3001/create",{
            topic:topic,
            promoter:promoter,
            degree:degree,
            faculty:faculty,
            fieldOfStudy:fieldOfStudy,
            type:type,
            status:status,
            addedby:user[0].iduser
        }).then(()=>{console.log("success");});
    }
    const addStudentTopic=()=>{
        Axios.post("http://localhost:3001/create",{
            topic:topic,
            promoter:promoter,
            degree:degree,
            faculty:faculty,
            fieldOfStudy:fieldOfStudy,
            type:type,
            status:status,
            addedby:user[0].iduser
        }).then((response)=>{
            const thesisId=response.data.insertId;
            Axios.put("http://localhost:3001/update",{reservedby:student,id:thesisId,userId:studentId,status:"Zarezerwowane"});
        })
    }
    const handleChange=(e)=>{
        setStudentId(e.target.value);
        setStudent(e.target.selectedOptions[0].text);
    }
    return(
        <div>
            <div>
                <h2>Dodaj temat</h2>
                <table className="content-table">
                    <thead>
                    <tr>       
                        <th>Temat pracy</th>
                        <th>Promotor</th>
                        <th>Stopień</th>
                        <th>Wydział</th>
                        <th>Kierunek</th>
                        <th>Typ</th>
                        <th>Student</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" className="input" placeholder="Temat pracy" onChange={(event)=>{setTopic(event.target.value);}}/></td>
                            <td>{promoter}</td>
                            <td>       
                                <select id="degree" className="input" onChange={(event)=>{setDegree(event.target.value);}}>
                                    <option val="l">Licencjat</option>
                                    <option val="i">Inżynier</option>
                                </select>
                            </td>
                            <td>
                                <select id="faculty" className="input"  onClick={(event)=>{setFaculty(event.target.value);}}>
                                    <option val="forest">Leśny</option>
                                    <option val="garden">Ogrodniczy</option>
                                    <option val="business">Ekonomiczny</option>
                                    <option val="it">Zastosowań Informatyki i Matematyki</option>
                                    <option val="food">Technologi żywności</option>
                                </select>
                            </td>
                            <td>
                                <select id="fieldOfStudy" className="input" onChange={(event)=>{setFieldOfStudy(event.target.value);}}>
                                    <option>Informatyka</option>
                                    <option>Informatyka i Ekonometria</option>
                                    <option>Ogrodnictwo</option>
                                    <option>Ogrodnictwo miejskie i arborystyka</option>
                                    <option>Ochrona zdrowia roślin</option>
                                    <option>Technologia żywności i żywienie człowieka</option>
                                    <option>Bezpieczeństwo żywności</option>
                                    <option>Towaroznawstwo i marketing żywności</option>
                                    <option>Towaroznawstwo w biogospodarce</option>
                                    <option>Ekonomia</option>
                                    <option>Finanse i rachunkowość</option>
                                    <option>Zarządzanie</option>
                                    <option>Logistyka</option>
                                    <option>Turystyka i rekreacja</option>
                                    <option>Leśnictwo</option>  
                                    <option>Gospodarka przestrzenna</option>                  
                                </select>
                            </td>
                            <td>
                                <select id="type" className="input" onChange={(event)=>{setType(event.target.value);}}>
                                    <option val="s">Stacjonarnie</option>
                                    <option val="n">Niestacjonarnie</option>
                                </select>
                            </td>
                            <td>
                                <select className="input" onChange={handleChange}>
                                    {students.map((val,key)=>(
                                     <option key={val.iduser} value={val.iduser}>{val.name+" "+val.surname}</option>
                                    ))}
                            </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="pag-button" onClick={addTopic}>Dodaj</button>
                <button className="student" onClick={addStudentTopic}>Dodaj z przypisanym studentem</button>
            </div>
            <div>
            <h2>Moje tematy</h2>
                <table className="content-table">
                    <thead>
                        <tr>       
                            <th>Temat pracy</th>
                            <th>Promotor</th>
                            <th>Stopień</th>
                            <th>Wydział</th>
                            <th>Kierunek</th>
                            <th>Typ</th>
                            <th>Status</th>
                            <th>Usuń</th>
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theses.map((val,key)=>{
                        return(
                            <tr key={val.idtheses+100}>
                                <td>{val.topic}</td>
                                <td>{val.promoter}</td>
                                <td>{val.degree}</td>
                                <td>{val.faculty}</td>
                                <td>{val.fieldofstudy}</td>
                                <td>{val.type}</td>
                                <td>{val.status}</td>
                                {<DeleteThesisModal id={val.idtheses}/>}
                                {(val.status==="Zarezerwowane")?<ThesisOptionsModal thesisId={val.idtheses} thesisTopic={val.topic}/>:<td>Brak</td>}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}