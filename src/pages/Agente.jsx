import Navbar from "../components/Navbar"
import { ArrowCircleLeftIcon, PlusCircleIcon, TrashSimpleIcon } from "@phosphor-icons/react"
import { useNavigate, useSearchParams } from "react-router-dom";
import CollapseAgente from "../components/CollapseAgente";
import { useState, useEffect } from "react";


export default () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])

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
        const tempLista = [...localStorageRead]
        tempLista[fi].agentes[ai].historico.splice(Number(promptPos[0]), 1)
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }


    return (
        <>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <ArrowCircleLeftIcon size={40} weight="thin" onClick={voltarPag}/>
                        <h1 className="font-primary text-4xl">{localStorageRead[fi].nomeFluxo} / {localStorageRead[fi].agentes[ai].nomeAgente}</h1>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex justify-center items-center bg-accent/30 h-15.5 rounded-md text-primary font-primary" onClick={() => novoPrompt()}>
                        <PlusCircleIcon size={32} weight="thin" />
                        <p className="text-xl">Novo prompt</p>
                    </div>
                    {localStorageRead[fi].agentes[ai].historico.map((item, index) => {
                
                            return(
                                <div className="relative">
                                    <button class="btn bg-red-100 text-red-600 w-15 absolute right-5 top-3 z-1" onClick={()=>{document.getElementById('modal_apaga').showModal(); setPromptPos([index, item.alteracao]) }}><TrashSimpleIcon size={32} weight="thin" /></button>
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
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-10 top-5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-red-50" >✕</button>
                    </form>
                    <h3 className="text-2xl font-primary mb-2">Código</h3>
                    <p>Deseja realmente apagar o histórico selecionado "{promptPos[1]}"?</p>
                    <form method="dialog" className="flex gap-2 mt-2">
                        <button className="btn btn-secondary text-primary">Cancelar</button>
                        <button className="btn bg-red-50 text-red-600" onClick={apagaHistorico}>Apagar</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}