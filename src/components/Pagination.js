import React from "react";
import "./../css/table.css";

export default function Pagination({activePage,totalPages,setActivePage}){
    return(
        <div>
            <div>
                <button className="pag-button" disabled={activePage===1} onClick={()=>setActivePage(activePage-1)}>Wstecz</button>
                <button className="pag-button" disabled={activePage===totalPages} onClick={()=>setActivePage(activePage+1)}>Następna</button>
                <button className="pag-button" disabled={activePage===1} onClick={()=>setActivePage(1)}>Pierwsza</button>
                <button className="pag-button" disabled={activePage===totalPages} onClick={()=>setActivePage(totalPages)}>Ostatnia</button>
            </div>
        </div>
    )
}