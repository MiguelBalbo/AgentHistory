import { CheckIcon, CodeIcon, PencilIcon, PlusIcon } from "@phosphor-icons/react"
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
                <div className={`${tooltip ? `tooltip tooltip-warning tooltip-open` : null}`} data-tip="Digite um nome para o prompt">
                    <input 
                    type="text" 
                    placeholder="Alteração feita" 
                    value={alteracao} 
                    onChange={(e) => setAlteracao(e.target.value)} 
                    className={`input text-primary text-xl font-primary mr-5 w-150 ${tooltip ? `border border-orange-500` : null}`} 
                    autoFocus 
                    onKeyDown={(e) => {if (e.key == 'Enter' || e.key == 'Escape') fechaEdicao}} /> 
                </div> :

                <h2 className="font-primary text-2xl text-base-100 mt-1 mr-5">{alteracao}</h2>}

                <button class="btn btn-base-100/70 w-15" onClick={fechaEdicao}>
                    {isEditMode ? <CheckIcon size={32} weight="thin"/> :<PencilIcon size={32} weight="thin" />}
                </button>
                
            </div>
            <div tabindex="0" class="collapse bg-accent border-base-300 border mt-6 text-base-100" >
                <input type="checkbox" />
                <div class="collapse-title font-primary text-2xl">
                    <h2 className="self-center">{props.posicao}</h2>
                </div>
                <div class="collapse-content font-primary bg-secondary text-primary">
                    <div class="tabs tabs-lift mt-2 pb-1">

                        {localStorageRead[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].prompts.map((prompt) => {
                            return (
                                <>
                                    <label className="tab">
                                        <input type="radio" name="my_tabs_4" className="tab" />
                                        <CodeIcon size={32} weight="thin" /> {prompt.tipo == 0 ? "Sistema" : prompt.tipo == 1 ? "Agente" : prompt.tipo == 2 ? "Usuário" : "Tool"} 
                                    </label>
                                    <div className="tab-content bg-base-100 border-base-300 p-6 -mt-1">
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