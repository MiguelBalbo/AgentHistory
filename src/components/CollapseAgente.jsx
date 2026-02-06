import { ChatTextIcon, CheckIcon, CodeIcon, PencilIcon, PlusIcon } from "@phosphor-icons/react"
import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor.jsx";


export default (props) => {
    //verifica se está armazenado antes de executar o parse
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    //se o titulo for vazio, o editmode é true
    const [ isEditMode, setIsEditMode ] = useState(props.prompt.alteracao ? false : true) 
    //titulo do bloco
    const [ alteracao, setAlteracao ] = useState(props.prompt.alteracao)
    //se tooltip está ativa
    const [ tooltip, setTooltip ] = useState(false)
    //key do coiso
    let index = 0
    

    //fluxo para achar posição no vetor do fluxo, agente e histórico
    let fluxoIndex = -1;
    let agenteIndex = -1;
    let historicoIndex = -1;
    for (let fi = 0; fi < localStorageRead.length; fi++) {
        const agentes = localStorageRead[fi].agentes;
        //console.log(agentes);
        

        for (let ai = 0; ai < agentes.length; ai++) {
            const historicos = agentes[ai].historico;
            const hi = historicos.findIndex(h => h.id === props.prompt.id);
            //console.log(hi);
            //console.log(historicos);
            
            

            if (hi !== -1) {
                fluxoIndex = fi
                agenteIndex = ai
                historicoIndex = hi
                break
            }
        }
    }


    //aparecer tooltip de colocar titulo
    function fechaEdicao(){
        if (!alteracao.trim()) {
            setTooltip(true);
            //setTimeout(() => setTooltip(false), 3000);
        } else {
            setTooltip(false);
            setIsEditMode(!isEditMode);
        }
    }

    
    function novoTipoPrompt(){
        const tempLista = [...localStorageRead]
        tempLista[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].prompts.push({
            id: crypto.randomUUID(),
            conteudo:"",
            tipo: 0,
            formato: 0,
            obs: ""
        })
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }
    
    
    //salva ao alterar o nome
    useEffect(() => {
        setTooltip(false);
        const tempLista = [...localStorageRead]
        tempLista[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].alteracao = alteracao
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }, [alteracao]);
    


    return (
        <div className="relative">
            {/* Botões e título ficam como absolute para interação, se alterado, os botões não funcionam */}
            <div className="flex gap-2 absolute right-22 top-3 z-1">

                {isEditMode ? 
                <form className={`${tooltip ? `tooltip tooltip-warning tooltip-open font-secondary font-light` : null}`} data-tip="Digite um nome para o prompt">
                    <input 
                    type="text" 
                    placeholder="Alteração feita" 
                    value={alteracao} 
                    onChange={(e) => setAlteracao(e.target.value)} 
                    className={`input text-secondary font-secondary text-xl mr-5 w-150 ${tooltip ? `border border-orange-500` : null}`} 
                    autoFocus 
                    required
                    onKeyDown={(e) => {if (e.key == 'Enter' || e.key == 'Escape') fechaEdicao}} /> 
                </form> :

                <h2 className="font-primary text-secondary text-2xl mt-1 mr-5 ">{alteracao}</h2>}

                <button class="btn w-15 bg-linear-to-br from-gray-500/90 hover:from-gray-600 hover:to-gray-700 to-gray-600/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-500 dark:shadow-slate-100 text-white dark:text-gray-900 border-0" onClick={fechaEdicao}>
                    {isEditMode ? <CheckIcon size={32} weight="thin"/> :<PencilIcon size={32} weight="thin" />}
                </button>
                
            </div>
            <div tabindex="0" class="mt-5 collapse text-secondary font-primary bg-linear-to-br from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 hover:dark:from-gray-500 hover:dark:to-gray-600 dark:from-gray-600 dark:to-gray-700 dark:text-white border border-slate-300/70 dark:border-gray-700/70 shadow-sm hover:shadow-md hover:shadow-gray-500/20" >

                <input type="checkbox" />
                <div class="collapse-title text-2xl flex gap-2">
                    <ChatTextIcon size={32} weight="thin" className="-mt-0.5" /> 
                    <h2 className="self-center flex">{props.posicao}</h2>
                </div>
                <div class="collapse-content font-primary bg-primary text-primary">
                    <div class="tabs tabs-lift mt-2 pb-1">

                        {localStorageRead[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].prompts.map((prompt) => {
                            return (
                                <>
                                    <label className="tab text-secondary bg-gray-200 border-gray-300 mr-1" >
                                        <input type="radio" name="my_tabs_4" className="tab" />
                                        <CodeIcon size={32} weight="thin" /> {prompt.tipo == 0 ? "Sistema" : prompt.tipo == 1 ? "Agente" : prompt.tipo == 2 ? "Usuário" : "Tool"} 
                                    </label>
                                    <div className="tab-content bg-gray-200 border-gray-300 p-6 -mt-0.5">
                                        <CodeEditor 
                                        key={index++} 
                                        prompt={prompt}
                                        onUpdate={() => {setLocalStorageRead(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])}}/>
                                    </div>
                                </>
                            )
                        })}

                        <>
                            <button className="tab" onClick={novoTipoPrompt}>
                                <PlusIcon size={32} weight="thin" /> Adicionar
                            </button>
                        </>
                    </div>
                    
                </div>
            </div>            
        </div>
    )
}