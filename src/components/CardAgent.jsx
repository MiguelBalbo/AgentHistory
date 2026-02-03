import { BrainIcon, DotsThreeIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default (props) => {
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    const [agenteF,setAgenteF] = useState(props.titulo)
    const [subfluxoF,setSubfluxoF] = useState(props.subtitulo)
    const navigate = useNavigate();
    const idModal = `modal_ren_${props.id}`
    const [isDeleted,setIsDeleted] = useState(false)

    let fi;
    let ai;
    for (fi = 0; fi < localStorageRead.length; fi++) {
        const agentes = localStorageRead[fi].agentes;
        ai = agentes.findIndex(a => a.id === props.id);
        if (ai !== -1) {
            break
        }
    }

    function paginaAgentes(){
        navigate(`/agente?id=${props.id}`)
    }

    function deleteAgente(){
        const lsrTemp = localStorageRead
        //console.log(lsrTemp);
        lsrTemp[fi].agentes.splice(ai, 1)
        setLocalStorageRead(lsrTemp)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
        setIsDeleted(true)
        //window.location.reload()
    }

    return(
        <>
            {
                isDeleted ? true :                
                <div className="card bg-secondary w-60 h-60 shadow-sm">
                    <figure className="px-8 pt-8">
                    <BrainIcon size={72} weight="thin" className="text-primary" />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-primary font-primary">{agenteF}</h2>
                        <p className="font-primary">{subfluxoF}</p>
                            <div className="card-actions">
                                <button className="btn font-primary" onClick={() => paginaAgentes()}>Acessar</button>
                                <div class="dropdown -mt-1">
                                    <div tabindex="0" role="button" className="btn m-1 bg-base-100/50 w-15"><DotsThreeIcon size={32} weight="thin" /></div>
                                    <ul tabindex="-1" class="dropdown-content menu bg-base-100/75 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li><a className="font-primary text-primary" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Renomear</a></li>
                                        <li><a className="font-primary text-error" onClick={deleteAgente}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                    </div>
                    
                    {/* modal de criar agente */}
                    <dialog id={idModal} class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                        
                            <h3 class="text-2xl text-primary font-light">Novo agente</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const lsrTemp = localStorageRead
                                lsrTemp[fi].agentes[ai].nomeAgente = agenteF
                                lsrTemp[fi].agentes[ai].subfluxo = subfluxoF
                                
                                setLocalStorageRead(lsrTemp)
                                console.log(localStorageRead);
                                localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
                                document.getElementById(idModal).close()
                            }} className="">
                                <div className="mt-3">
                                    <label htmlFor="fluxoinpt" className="text-primary font-primary">Nome do Agente</label>
                                    <input defaultValue={agenteF} onChange={(e) => setAgenteF(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do agente" className="input w-full text-primary font-primary" required />
                                </div>
                            
                                <div className="mt-3">
                                    <label htmlFor="contratoinpt" className="text-primary font-primary">Nome do subfluxo</label>
                                    <input defaultValue={subfluxoF} onChange={(e) => setSubfluxoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do subfluxo" className="input w-full text-primary font-primary" required />
                                </div>
                            
                                <button class="btn btn-secondary text-primary font-primary mt-3" type="submit">Salvar</button>
                            </form>
                        </div>
                    </dialog>
                </div>
            }
            
        </>
    )
}