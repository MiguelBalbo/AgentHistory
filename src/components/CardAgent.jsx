import { BrainIcon, DotsThreeIcon, PencilIcon, SparkleIcon, TrashIcon, WarningIcon } from "@phosphor-icons/react"
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
    const [cliquesApaga, setCliquesApaga] = useState(0);

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
        if(cliquesApaga < 1){
            setCliquesApaga(cliquesApaga+1)
        } else {
            const lsrTemp = localStorageRead
            //console.log(lsrTemp);
            lsrTemp[fi].agentes.splice(ai, 1)
            setLocalStorageRead(lsrTemp)
            localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
            setIsDeleted(true)
            //window.location.reload()
        }
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
                                        <li><a className="" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Editar</a></li>
                                        <li><a className="text-error" onClick={()=>document.getElementById(`modal_apaga_${props.id}`).showModal()}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>





                        
                        {/* modal de editar agente */}
                        <dialog id={idModal} class="modal">
                            <div class="modal-box">
                                <form method="dialog">
                                    <button class="btn btn-md btn-circle btn-ghost absolute right-5 top-6">✕</button>
                                </form>
                            
                                <div className="flex gap-2">
                                    <div className="p-2 bg-accent/20 rounded-full"><PencilIcon size={28} weight="thin" className=""/></div>
                                    <h3 className="text-2xl font-primary mt-2"> Editar fluxo</h3>
                                </div>

                                <hr className="text-secondary/20 mt-3.5 -mx-6" />


                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const lsrTemp = localStorageRead
                                    lsrTemp[fi].agentes[ai].nomeAgente = agenteF
                                    lsrTemp[fi].agentes[ai].subfluxo = subfluxoF
                                    
                                    setLocalStorageRead(lsrTemp)
                                    console.log(localStorageRead);
                                    localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
                                    document.getElementById(idModal).close()
                                }} className="text-secondary font-secondary">
                                    <div className="mt-3">
                                        <label htmlFor="fluxoinpt" className="">Nome do Agente</label>
                                        <input defaultValue={agenteF} onChange={(e) => setAgenteF(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do agente" className="input w-full" required />
                                    </div>
                                
                                    <div className="mt-3">
                                        <label htmlFor="contratoinpt" className="">Nome do subfluxo</label>
                                        <input defaultValue={subfluxoF} onChange={(e) => setSubfluxoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do subfluxo" className="input w-full" required />
                                    </div>

                                    <hr className="text-secondary/20 mt-3.5 -mx-6" />
                                    <button class="btn bg-linear-to-b from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light mt-3 w-full" type="submit">Salvar</button>
                                </form>
                            </div>
                        </dialog>



                        {/* Modal de confirmação de exclusão */}
                        <dialog id={`modal_apaga_${props.id}`} className="modal">
                            <div className="modal-box bg-base-100">
                                <form method="dialog">
                                    <button className="btn btn-md btn-circle btn-ghost absolute right-5 top-5" onClick={() => setCliquesApaga(0)} >✕</button>
                                </form>
                                <div className="flex gap-2">
                                    <div className="bg-red-100 dark:bg-red-600 p-2 rounded-full">
                                        <WarningIcon size={28} weight="thin" className="text-red-600 dark:text-red-100"/> 
                                    </div> 
                                    <h3 className="text-2xl font-primary text-secondary mt-2">Apagar Prompts</h3>
                                </div>
                                <hr className="text-secondary/20 mt-3.5 -mx-6" />
                                
                                <div className="mt-3.5 text-secondary font-secondary">
                                    <p>Deseja realmente apagar o prompt selecionado?</p>
                                    
                                    <button className="btn bg-linear-to-b from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 hover:dark:from-red-700 hover:dark:to-red-800 dark:from-red-600 dark:to-red-700 shadow-inner shadow-red-400 dark:shadow-red-500 text-red-200 font-secondary font-light mt-3 w-full" onClick={deleteAgente}> {cliquesApaga > 0 ? "Clique novamente para apagar" : "Apagar"}</button>

                                    <form method="dialog" className="flex flex-col gap-2 mt-2 font-light">
                                        <button className="btn bg-linear-to-b from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light w-full" onClick={() => setCliquesApaga(0)}>Cancelar</button>
                                    </form>
                                </div>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    </>               
            }
            
        </>
    )
}