import Navbar from "../components/Navbar"
import { ArrowCircleLeftIcon, ChatTextIcon, PlusCircleIcon, TrashSimpleIcon, WarningIcon } from "@phosphor-icons/react"
import { useNavigate, useSearchParams } from "react-router-dom";
import CollapseAgente from "../components/CollapseAgente";
import { useState, useEffect } from "react";


export default () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    const [isHovered, setIsHovered] = useState(false);    
    const [cliquesApaga, setCliquesApaga] = useState(0);

    //salva temporariamente pra apagar
    const [promptPos,setPromptPos] = useState([0,""]);

    //fluxo para achar posição no vetor do fluxo e agente
    let fi;
    let ai;
    for (fi = 0; fi < localStorageRead.length; fi++) {
        const agentes = localStorageRead[fi].agentes;
        ai = agentes.findIndex(a => a.id === searchParams.get("id"));
        if (ai !== -1) {
            break
        }
    }

    //Var para geração de posição
    let i = localStorageRead[fi].agentes[ai].historico.length;
    
    //Função de voltar
    function voltarPag() {
        navigate(-1);
    }

    //Função de criar novo objeto de prompt
    function novoPrompt(){
        const vetHistoricoNew = [{
            id: crypto.randomUUID(),
            alteracao: "",
            prompts: [{
                id: crypto.randomUUID(),
                tipo: 0,
                conteudo:"",
                formato: 1,
                obs: ""
            }],
            status: 0
        }]

        {localStorageRead[fi].agentes[ai].historico.map(item => {
                vetHistoricoNew.push(item);
            })
        }

        const lhrTemp = [...localStorageRead]
        lhrTemp[fi].agentes[ai].historico = vetHistoricoNew
        setLocalStorageRead(lhrTemp)
        localStorage.setItem("fluxos", JSON.stringify(lhrTemp));
    }


    //função de apagar prompt por completo
    function apagaHistorico(){
        if (cliquesApaga < 1){
            setCliquesApaga(cliquesApaga+1)
        } else {
            const tempLista = [...localStorageRead]
            tempLista[fi].agentes[ai].historico.splice(Number(promptPos[0]), 1)
            setLocalStorageRead(tempLista)
            localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
            setCliquesApaga(0)
            document.getElementById('modal_apaga').close()
        }
    }


    return (
        <>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <ArrowCircleLeftIcon size={40} weight={isHovered ? "fill" : "thin"} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer" onClick={voltarPag}/>
                        <h1 className="font-primary text-4xl">{localStorageRead[fi].nomeFluxo} / {localStorageRead[fi].agentes[ai].nomeAgente}</h1>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex justify-center items-center bg-linear-to-br from-accent/60 to-accent/80 hover:from-accent/80 hover:to-accent h-15.5 rounded-md text-secondary font-primary cursor-pointer" onClick={() => novoPrompt()}>
                        <PlusCircleIcon size={32} weight="thin" />
                        <p className="text-xl">Novo prompt</p>
                    </div>
                    {localStorageRead[fi].agentes[ai].historico.map((item, index) => {
                
                            return(
                                <div className="relative">
                                    <button class="btn bg-linear-to-br from-red-100 to-red-200 dark:from-red-600/60 dark:to-red-700/60 text-red-600 dark:text-red-300 hover:from-red-200 hover:to-red-300 hover:dark:from-red-500/60 hover:dark:to-red-600/60 shadow-inner shadow-red-100 dark:shadow-red-600/75 w-15 absolute right-5 top-3 z-1" onClick={()=>{document.getElementById('modal_apaga').showModal(); setPromptPos([index, item.alteracao]) }}><TrashSimpleIcon size={32} weight="thin" /></button>
                                    <CollapseAgente prompt={item} posicao={index+1} key={i} />
                                </div>
                            )
                        })}
                </div>
            </div>


            {/* Modal de confirmação de exclusão */}
            <dialog id="modal_apaga" className="modal">
                <div className="modal-box bg-base-100">
                    <form method="dialog">
                        <button className="btn btn-md btn-circle btn-ghost absolute right-5 top-5" onClick={() => setCliquesApaga(0)} >✕</button>
                    </form>
                    <div className="flex gap-2">
                        <div className="bg-red-100 dark:bg-red-600 p-2 rounded-full">
                            <WarningIcon size={28} weight="thin" className="text-red-600 dark:text-red-100"/> 
                        </div> 
                        <h3 className="text-2xl font-primary mt-2"> Apagar Prompts</h3>
                    </div>
                    <hr className="text-secondary/20 mt-3.5 -mx-6" />
                    
                    <div className="mt-3.5 text-secondary font-secondary">
                        <p>Deseja realmente apagar o histórico selecionado "{promptPos[1]}"?</p>
                        
                        <button className="btn bg-linear-to-b from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 hover:dark:from-red-700 hover:dark:to-red-800 dark:from-red-600 dark:to-red-700 shadow-inner shadow-red-400 dark:shadow-red-500 text-red-200 font-secondary font-light mt-3 w-full" onClick={apagaHistorico}> {cliquesApaga > 0 ? "Clique novamente para apagar" : "Apagar"}</button>

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
    )
}