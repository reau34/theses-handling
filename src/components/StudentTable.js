import  Axios  from "axios";
import React, { useEffect,useState,useContext } from "react";
import {LoginContext} from "./LoginContext"

export default function StudentTable(){
    const {user}=useContext(LoginContext);
    const[thesis,setThesis]=useState([]);
    const[file,setFile]=useState(null);
    const[path,setPath]=useState("")
    const[review,setReview]=useState("")

    const handleChange=event=>{
        setFile(event.target.files[0]);
    };
    const getThesis=()=>{
        Axios.post("http://localhost:3001/student_thesis",{userId:user[0].iduser}).then((response)=>{
            setThesis(response.data)
            setPath(response.data[0].path)
            setReview(response.data[0].review)
        })
    }
    useEffect(()=>{
        getThesis()
    },[])
    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData=new FormData();
        formData.append("file",file);
        Axios.post("http://localhost:3001/upload_file",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }).then((response)=>{
            const fileName="./files/"+file.name;
            Axios.post("http://localhost:3001/set_path",{path:fileName,id:thesis[0].idtheses});
        })
    }
    return(
        <>
        <table className="content-table">
            <thead>
                <tr>
                    <th>Temat pracy</th>
                    <th>Promotor</th>
                    <th>Stopień</th>
                    <th>Wydział</th>
                    <th>Kierunek</th>
                    <th>Typ</th>
                    <th>Recenzent</th>
                    <th>Ocena promotora</th>
                    <th>Ocena recenzenta</th>
                </tr>
            </thead>
            <tbody>
                {
                    thesis.map((val,key)=>{
                        return(
                            <tr key={val.idtheses+100}>
                                <td>{val.topic}</td>
                                <td>{val.promoter}</td>
                                <td>{val.degree}</td>
                                <td>{val.faculty}</td>
                                <td>{val.fieldofstudy}</td>
                                <td>{val.type}</td>
                                {val.fullname?<td>{val.fullname}</td>:<td>Brak</td>}
                                {val.promotergrade?<td>{val.promotergrade}</td>:<td>Brak</td>}
                                {val.reviewergrade?<td>{val.reviewergrade}</td>:<td>Brak</td>}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        <h2>Prześlij plik</h2>
        {(!path)?
            <><p>Nazwa pliku Imię_Nazwisko_nrAlbumu</p>
            <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                <input className="form" type="file" onChange={handleChange} />
                <button className="form-button" type="submit">Zatwierdź</button>
            </form></>:<p>Plik został przesłany</p>

        }
        <h2>Opinia recenzenta</h2>
        {
            review?<p>{thesis[0].review}</p>:<p>Brak</p>
        }
        </>
    )
}