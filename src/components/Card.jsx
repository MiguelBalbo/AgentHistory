import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/placeholder.avif"
import { DotsThreeIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default (props) => {
    const navigate = useNavigate();
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])

    function paginaAgentes(){
        navigate(`/fluxo?id=${props.item.id}`)
    }

    //função de apagar fluxo
    function deleteFluxo(){
        const lsrTemp = localStorageRead
        //console.log(lsrTemp);
        lsrTemp.splice(fi, 1)
        setLocalStorageRead(lsrTemp)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
        window.location.reload()
    }

    //console.log(props);
    //console.log(props.id);

    let fi;
    fi = localStorageRead.findIndex(f => f.id === props.item.id);
    

    return(
        <div className="card bg-secondary w-60 shadow-sm">
            <figure className="px-10 pt-10">
                <img src={props.item.icone ? props.item.icone : Placeholder}
                alt="Icone do fluxo"
                className="rounded-xl w-25 h-25" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title text-primary font-primary">{props.item.nomeFluxo}</h2>
                <p className="font-primary">{props.item.contrato}</p>
                <div className="card-actions">
                    <button className="btn font-primary " onClick={paginaAgentes}>Acessar</button>
                    <div class="dropdown -mt-1">
                        <div tabindex="0" role="button" className="btn m-1 bg-base-100/50 w-15"><DotsThreeIcon size={32} weight="thin" /></div>
                        <ul tabindex="-1" class="dropdown-content menu bg-base-100/75 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li><a className="font-primary text-primary"><PencilIcon size={20} weight="thin"/> Renomear</a></li>
                            <li><a className="font-primary text-error" onClick={deleteFluxo}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}