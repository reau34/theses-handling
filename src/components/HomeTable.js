import React, {useEffect,useState,useMemo,useContext} from "react";
import "./../css/table.css"
import Pagination from "./Pagination";
import ConfirmReservationModal from "./ConfirmReservationModal"
import Axios from "axios"
import { LoginContext } from "./LoginContext";

export default function HomeTable({role}){
    const{reservation}=useContext(LoginContext)
    const sortRows=(rows,sort)=>{
      return rows.sort((a,b)=>{
          const { order, orderBy } = sort;
          const aOrderBy=""+a[orderBy]
          const bOrderBy=""+b[orderBy]
          if (order === 'asc') {
            return aOrderBy.toString().localeCompare(bOrderBy.toString())
          } else {
            return bOrderBy.toString().localeCompare(aOrderBy.toString())
          }
      })
    }
    const handleSearch = (value, accessor) => {
        setActivePage(1)
        if (value) {
          setFilters(prevFilters => ({
            ...prevFilters,
            [accessor]: value,
          }))
        } else {
          setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters }
            delete updatedFilters[accessor]
      
            return updatedFilters
          })
        }
    }
    const handleSort=(accessor)=>{
        setActivePage(1)
        setSort({order:(sort.order==="asc"&&sort.orderBy===accessor)?"desc":"asc",orderBy:accessor})
    }
    const filterRows=(rows, filters)=> {
        return rows.filter(row => {
          return Object.keys(filters).every(accessor => {
            const value = row[accessor]
            const searchValue = filters[accessor]
            return value.toLowerCase().includes(searchValue.toLowerCase())
        
          })
        })
    }
    const rowsPerPage=5
    const[accessor,setAccessor]=useState("promoter")
    const[theses,setTheses]=useState([])
    const[activePage,setActivePage]=useState(1)
    const [filters, setFilters] = useState({})
    const [sort, setSort] = useState({ order: "asc", orderBy: "id" })
    const filteredRows = useMemo(() => filterRows(theses, filters), [theses, filters])
    const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort])
    const calculatedRows=[...sortedRows].slice((activePage-1)*rowsPerPage,activePage*rowsPerPage)
    const count=filteredRows.length
    const totalPages=Math.ceil(count/rowsPerPage)

    const getTheses=()=>{
      Axios.get("http://localhost:3001/get_theses").then((response)=>{
        setTheses(response.data)
      })
    }
    
    useEffect(()=>{
        getTheses()
    },[])

    return(
        <div>
          <select id="accessor" className="input" onChange={(event)=>{setAccessor(event.target.value)}}>
            <option value="promoter">Promotor</option>
            <option value="degree">Stopień</option>
            <option value="faculty">Wydział</option>
            <option value="fieldofstudy">Stopień</option>
            <option value="type">Typ</option>
          </select>
          <input type="text" className="input" onChange={(event)=>{handleSearch(event.target.value, accessor)}}/>
          <table className="content-table">
            <thead>
              <tr>   
                <th>Temat pracy</th>
                <th>Promotor
                  <button className="sort-button" onClick={()=>{handleSort("promoter")}}>↕️</button>
                </th>
                <th>Stopień
                  <button className="sort-button" onClick={()=>{handleSort("degree")}}>↕️</button>
                </th>
                <th>Wydział
                  <button className="sort-button" onClick={()=>{handleSort("faculty")}}>↕️</button>
                </th>
                <th>Kierunek
                  <button className="sort-button" onClick={()=>{handleSort("fieldofstudy")}}>↕️</button>
                </th>
                <th>Typ
                  <button className="sort-button" onClick={()=>{handleSort("type")}}>↕️</button>
                </th>
                <th>Status
                  <button className="sort-button" onClick={()=>{handleSort("status")}}>↕️</button>
                </th>
              </tr>
            </thead>
            <tbody>              
                {calculatedRows.map((val,key)=>{
                    return(
                        <tr key={val.idtheses+100}>
                            <td>{val.topic}</td>
                            <td>{val.promoter}</td>
                            <td>{val.degree}</td>
                            <td>{val.faculty}</td>
                            <td>{val.fieldofstudy}</td>
                            <td>{val.type}</td>
                            {(val.status==="Zarezerwowane"||reservation===true||role==="lecturer") ?<td>{val.status}</td>:<ConfirmReservationModal thesisId={val.idtheses} thesisTopic={val.topic} status={val.status} addedby={val.addedby}/>}
                        </tr>
                    );
                })}
            </tbody>
          </table>
            <Pagination activePage={activePage} totalPages={totalPages} setActivePage={setActivePage}/>
        </div>
    )
}