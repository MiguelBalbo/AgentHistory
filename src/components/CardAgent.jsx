import { BrainIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom";

export default (props) => {

    const navigate = useNavigate();
    
    function paginaAgentes(){
        navigate(`/agente?id=${props.id}`)
    }

    return(

        <div className="card bg-secondary w-60 h-60 shadow-sm">
            <figure className="px-8 pt-8">
                <BrainIcon size={72} weight="thin" className="text-primary" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title text-primary font-primary">{props.titulo}</h2>
                <p className="font-primary">{props.subtitulo}</p>
                <div className="card-actions">
                    <button className="btn font-primary" onClick={() => paginaAgentes()}>Acessar</button>
                </div>
            </div>
        </div>
    )
}