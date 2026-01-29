import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/placeholder.avif"

export default (props) => {
    const navigate = useNavigate();
    
    function paginaAgentes(){
        navigate(`/fluxo?id=${props.item.id}`)
    }

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
                    <button className="btn font-primary" onClick={paginaAgentes}>Acessar</button>
                </div>
            </div>
        </div>
    )
}