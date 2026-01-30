import { ArrowsOutSimpleIcon, CaretDownIcon, CaretUpIcon, CheckIcon, CopyIcon, MinusIcon, PencilIcon, SquareIcon, TrashSimpleIcon, XIcon } from "@phosphor-icons/react"
import ReactCodeMirror from "@uiw/react-codemirror";
import { EditorView } from '@codemirror/view';
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';


export default (props) => {
    //verifica se está armazenado antes de executar o parse
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    //define a linguagem do código de acordo o obj recebido
    const [codigo, setCodigo] = useState(props.prompt.formato == 0 ? ["Markdown", markdown()] : props.prompt.formato == 1 ? ["XML", xml()] : props.prompt.formato == 2 ? ["JSON", json()] : ["YAML", yaml()]);
    //prompt
    const [prompt, setPrompt] = useState(props.prompt.prompt)
    //qual icone deve ser exibido na parte de cópia
    const [isCopied, setIsCopied] = useState(false)
    //define se menu está aberto ou fechado
    const [menuCodeIcon, setMenuCodeIcon] = useState(false)
    //obs do prompt
    const [observacoes, setObservacoes] = useState(props.prompt.obs)
    //se o titulo for vazio, o editmode é true
    const [ isEditMode, setIsEditMode ] = useState(props.prompt.alteracao = '' ? true : false) 
    //titulo do bloco
    const [ alteracao, setAlteracao ] = useState(props.prompt.alteracao)
    

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

    //realiza a cópia do prompt
    async function copiarPrompt() {
        await navigator.clipboard.writeText(prompt)
        handleCopia()
    }

    //animação de cópia
    function handleCopia() {
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 800); 
    }

    //função de apagar prompt por completo
    function apagaHistorico(){
        const tempLista = localStorageRead
        tempLista[fluxoIndex].agentes[agenteIndex].historico.splice(historicoIndex, 1)
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }


    //salva ao alterar prompt
    useEffect(() => {
        const tempLista = localStorageRead
        tempLista[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].prompt = prompt
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }, [prompt]);

    //salva ao alterar obs
    useEffect(() => {
        const tempLista = localStorageRead
        tempLista[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].obs = observacoes
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }, [observacoes]);

    //salva ao alterar o nome
    useEffect(() => {
        const tempLista = localStorageRead
        tempLista[fluxoIndex].agentes[agenteIndex].historico[historicoIndex].alteracao = alteracao
        setLocalStorageRead(tempLista)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
    }, [alteracao]);



    return (
        <div className="relative">
            {/* Botões e título ficam como absolute para interação, se alterado, os botões não funcionam */}
            <div className="flex gap-2 absolute right-5 top-3 z-1">
                {isEditMode ? 
                <input type="text" placeholder="Alteração feita" value={alteracao} onChange={(e) => setAlteracao(e.target.value)} className="input text-primary text-xl font-primary mr-5 w-150" autoFocus onKeyDown={(e) => {e.key == 'Enter' ? setIsEditMode(!isEditMode) : e.key == 'Escape' ? setIsEditMode(!isEditMode) :null}}/> : 
                <h2 className="font-primary text-2xl text-base-100 mt-1 mr-5">{alteracao}</h2>}
                <button class="btn btn-base-100/70 w-15" onClick={() => setIsEditMode(!isEditMode)}><PencilIcon size={32} weight="thin" /></button>
                <button class="btn bg-red-100 text-red-600 w-15" onClick={()=>document.getElementById('modal_apaga').showModal()}><TrashSimpleIcon size={32} weight="thin" /></button>
            </div>
            <div tabindex="0" class="collapse bg-accent border-base-300 border mt-6 text-base-100" >
                <input type="checkbox" />
                <div class="collapse-title font-primary text-2xl">
                    <h2 className="self-center">{props.prompt.posicao}</h2>
                </div>
                <div class="collapse-content font-primary bg-secondary text-primary">
                    <div className="mt-2 flex gap-5">
                        <div className="w-full">
                            <p className="text-xl mb-2">Código</p>
                            <div className="relative">
                                {/* editor de código */}
                                <ReactCodeMirror
                                    theme="dark"
                                    extensions={[codigo[1], EditorView.lineWrapping]}
                                    height="360px"
                                    onChange={(value) => setPrompt(value)}
                                    value={prompt}
                                />
                                
                                <div className="absolute bottom-4 right-5">
                                    {/* Botão de fullscreen */}
                                    <button className="btn bg-base-100/70 w-15 text-primary mr-1" onClick={()=>document.getElementById('modal_codigo').showModal()}>
                                        <ArrowsOutSimpleIcon size={32} weight="thin" />
                                    </button>
                                    {/* Botão de cópia */}
                                    <button className="btn bg-base-100/70 w-15 text-primary">
                                        <AnimatePresence mode="wait">
                                            {isCopied ? (
                                            <motion.div
                                            key="copy"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <CheckIcon size={32} weight="thin" className="text-green-700"/>
                                            </motion.div>
                                            ) : (
                                                <motion.div
                                                key="copied"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                >
                                                <CopyIcon size={32} weight="thin" onClick={copiarPrompt} />
                                            </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    {/* Menu de escolher linguagem */}
                                    <div className="dropdown dropdown-top dropdown-end" onClick={() => setMenuCodeIcon(!menuCodeIcon)}>
                                        <div tabIndex={0} role="button" className="btn m-1 bg-base-100/70">
                                            {codigo[0]}
                                            {menuCodeIcon ? <CaretDownIcon size={16} weight="thin" /> : <CaretUpIcon size={16} weight="thin" />}
                                        </div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100/70 rounded-box z-1 w-52 p-2 shadow-sm">
                                            <li onClick={() => setCodigo(["YAML", yaml()])}><a>YAML</a></li>
                                            <li onClick={() => setCodigo(["JSON", json()])}><a>JSON</a></li>
                                            <li onClick={() => setCodigo(["XML", xml()])}><a>XML</a></li>
                                            <li onClick={() => setCodigo(["Markdown", markdown()])}><a>Markdown</a></li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Campo de obs */}
                        <div className="flex flex-col w-200">
                            <label htmlFor="obs_area" className="text-xl mb-2">Observações</label>
                            <textarea name="Obs" id="obs_area" className="bg-primary/10 textarea h-90 w-full text-primary" defaultValue={observacoes} onChange={(e) => setObservacoes(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>
            </div>





            {/* Modal de fullscreen do código */}
            <dialog id="modal_codigo" className="modal">
                <div className="modal-box w-11/12 max-w-500 bg-base-100">
                    <form method="dialog">
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-10 top-5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-red-50" >✕</button>
                    </form>
                    <h3 className="text-2xl font-primary">Código</h3>
                    <div className="relative mt-2">
                        <ReactCodeMirror
                            theme="dark"
                            extensions={[codigo[1], EditorView.lineWrapping]}
                            height="700px"
                            onChange={(value) => setPrompt(value)}
                            value={prompt}
                        />
                        
                        <div className="absolute bottom-4 right-5">
                            <button className="btn bg-base-100/70 w-15 text-primary">
                                <AnimatePresence mode="wait">
                                    {isCopied ? (
                                    <motion.div
                                    key="copy"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <CheckIcon size={32} weight="thin" className="text-green-700"/>
                                    </motion.div>
                                    ) : (
                                        <motion.div
                                        key="copied"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                        <CopyIcon size={32} weight="thin" onClick={copiarPrompt} />
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                            <div className="dropdown dropdown-top dropdown-end font-primary" onClick={() => setMenuCodeIcon(!menuCodeIcon)}>
                                <div tabIndex={0} role="button" className="btn m-1 bg-base-100/70">
                                    {codigo[0]}
                                    {menuCodeIcon ? <CaretDownIcon size={16} weight="thin" /> : <CaretUpIcon size={16} weight="thin" />}
                                </div>
                                <ul tabIndex="-1" className="dropdown-content menu bg-base-100/70 rounded-box z-1 w-52 p-2 shadow-sm">
                                    <li onClick={() => setCodigo(["YAML", yaml()])}><a>YAML</a></li>
                                    <li onClick={() => setCodigo(["JSON", json()])}><a>JSON</a></li>
                                    <li onClick={() => setCodigo(["XML", xml()])}><a>XML</a></li>
                                    <li onClick={() => setCodigo(["Markdown", markdown()])}><a>Markdown</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            
            
            {/* Modal de confirmação de apagamento */}
            <dialog id="modal_apaga" className="modal">
                <div className="modal-box bg-base-100">
                    <form method="dialog">
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-10 top-5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-red-50" >✕</button>
                    </form>
                    <h3 className="text-2xl font-primary mb-2">Código</h3>
                    <p>Deseja realmente apagar o histórico selecionado "{props.prompt.alteracao}"?</p>
                    <form method="dialog" className="flex gap-2 mt-2">
                        <button className="btn btn-secondary text-primary">Cancelar</button>
                        <button className="btn bg-red-50 text-red-600" onClick={apagaHistorico}>Apagar</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}