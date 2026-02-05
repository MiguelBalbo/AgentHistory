import { BrainIcon, DotsThreeIcon, PencilIcon, SparkleIcon, TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Squircle } from "@squircle-js/react";

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
                    <>
                        <div className="bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-800 dark:text-white w-80 h-55 border border-slate-300/70 dark:border-gray-700/70 shadow-sm hover:shadow-md hover:shadow-gray-500/20 rounded-xl py-7 px-5">
                            <div className="flex gap-6 h-28">
                                <div className="w-12 self-center">
                                    <SparkleIcon size={60} weight="thin" className="text-secondary" />
                                </div>
                                <div className="items-center text-secondary font-secondary self-center">
                                    <div class="badge badge-soft badge-accent border border-accent font-light">{subfluxoF}</div>
                                    <h2 className="font-primary text-xl mt-2">{agenteF}</h2>
                                </div>
                            </div>
                            <div className="flex mt-3">
                                <button className="btn w-59 bg-linear-to-b from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light" onClick={() => paginaAgentes()}>Acessar</button>
                                <div class="dropdown dropdown-top dropdown-end -mt-1">
                                    <div tabindex="0" role="button" className="btn btn-square m-1 bg-base-100"><DotsThreeIcon size={32} weight="thin" /></div>
                                    <ul tabindex="-1" class="dropdown-content menu bg-base-100/80 backdrop-blur-xs rounded-box z-1 w-52 p-2 shadow-sm text-secondary font-secondary font-light">
                                        <li><a className="" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Renomear</a></li>
                                        <li><a className="text-error" onClick={deleteAgente}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
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
                            
                                <h3 class="text-2xl text-primary font-secondary">Novo agente</h3>
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
                    </>               
            }
            
        </>
    )
}