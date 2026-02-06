import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/placeholder.avif"
import { ArrowRightIcon, WarningIcon, DotsThreeVerticalIcon, PencilIcon, TrashIcon, UploadIcon, ImageIcon } from "@phosphor-icons/react";
import { useState } from "react";
import imageCompression from 'browser-image-compression';
import { Squircle } from "@squircle-js/react";
import { useDropzone } from "react-dropzone";


export default (props) => {
    const navigate = useNavigate();
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    const [fluxo, setFluxo] = useState(props.item.nomeFluxo);
    const [contrato, setContrato] = useState(props.item.contrato);
    const [base64, setBase64] = useState(props.item.icone); 
    const [isDeleted,setIsDeleted] = useState(false)
    const idModal = `modal_ren_${props.item.id}`
    const [cliquesApaga, setCliquesApaga] = useState(0);
    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({accept: {"image/*": []}, maxFiles: 1, onDrop: (files) => {handleImagem(files)}});

    function paginaAgentes(){
        navigate(`/fluxo?id=${props.item.id}`)
    }

    //função de apagar fluxo
    function deleteFluxo(){
        if (cliquesApaga < 1){
            setCliquesApaga(cliquesApaga+1)
        } else {
            const lsrTemp = localStorageRead
            //console.log(lsrTemp);
            lsrTemp.splice(fi, 1)
            setLocalStorageRead(lsrTemp)
            localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
            setIsDeleted(true)
            setCliquesApaga(0)
        }
    }

    async function handleImagem(e) {
        const file = e[0];
        const options = {
            maxSizeMB: 0.1,          
            maxWidthOrHeight: 200,   
            useWebWorker: true,     
            fileType: 'image/webp'  
        };
        const compressedFile = await imageCompression(file, options)
        setBase64(await imageCompression.getDataUrlFromFile(compressedFile));
        console.log(base64);
    }

    //console.log(props);
    //console.log(props.id);

    let fi;
    fi = localStorageRead.findIndex(f => f.id === props.item.id);
    

    return(
        <>
            {isDeleted ? null :   
                <> 
                    <div
                    className="rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-800 dark:text-white w-50 relative border border-slate-300/70 dark:border-gray-700/70 shadow-sm hover:shadow-md hover:shadow-gray-500/20">
                        <img src={base64 ? base64 : Placeholder}
                        alt="Icone do fluxo"
                        className="rounded-t-xl w-full h-40 object-cover" />
                        <div className="font-primary mt-3 text-center items-center flex flex-col gap-2">
                            <div class="badge badge-soft badge-accent border border-accent">{contrato}</div>
                            <p className="font-primary text-2xl">{fluxo}</p>
                            <div>
                                <button 
                                className="btn bg-linear-to-br from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light" 
                                onClick={paginaAgentes}>
                                    Acessar <ArrowRightIcon size={24} weight="thin" />
                                </button>
                                <div class="dropdown dropdown-bottom dropdown-end -mt-1 absolute top-2 right-2">
                                    <div tabindex="0" role="button" className="btn btn-square bg-base-100/80 dark:bg-base-100/50 backdrop-blur-sm"><DotsThreeVerticalIcon size={32} weight="thin" className="w-10" /></div>
                                    <ul tabindex="-1" class="dropdown-content menu bg-base-100/80 backdrop-blur-sm rounded-box z-1 w-40 p-2 shadow-sm">
                                        <li><a className="" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Editar</a></li>
                                        <li><a className="text-error" onClick={()=>document.getElementById(`modal_apaga_${props.item.id}`).showModal()}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    


                    {/* modal de editar fluxo */}
                    <dialog id={idModal} class="modal">
                        <div class="modal-box bg-gray-100 dark:bg-gray-700  dark:text-gray-50 text-gray-900">
                                <div className="flex gap-2">
                                    <div className="p-2 bg-accent/20 rounded-full"><PencilIcon size={28} weight="thin" className=""/></div>
                                    <h3 className="text-2xl font-primary mt-2"> Editar fluxo</h3>
                                </div>
                            <form method="dialog">
                                <button class="btn btn-md btn-circle btn-ghost absolute right-4 top-6">✕</button>
                            </form>

                            <hr className="text-secondary/20 mt-3.5 -mx-6" />
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const lsrTemp = localStorageRead
                                lsrTemp[fi].icone = base64
                                lsrTemp[fi].nomeFluxo = fluxo
                                lsrTemp[fi].contrato = contrato
                                
                                setLocalStorageRead(lsrTemp)
                                console.log(localStorageRead);
                                
                                localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
                                document.getElementById(idModal).close()
                            }} className="">
                                <div className="mt-3">
                                    <label htmlFor="fluxoinpt" className="font-secondary ">Nome do fluxo</label>
                                    <input defaultValue={fluxo} onChange={(e) => setFluxo(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do fluxo" className="input w-full font-secondary " required />
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="contratoinpt" className="font-secondary ">Nome do contrato</label>
                                    <input defaultValue={contrato} onChange={(e) => setContrato(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do contrato" className="input w-full font-secondary " required />
                                </div>
                            
                                <div className="mt-3">
                                    <label htmlFor="iconinpt" class="font-secondary ">Ícone do fluxo</label>
                                    <div className="flex gap-5 mt-2">
                                        <img src={base64 ? base64 : Placeholder} alt="Imagem do fluxo" className="w-full max-w-48 rounded-xl border-primary/20 border aspect-square object-cover"/>
                                        <div
                                        {...getRootProps()}
                                        className={`
                                            card w-full mt-1 p-6 cursor-pointer
                                            border-2 border-dashed rounded-xl
                                            transition bg-gray-200 dark:bg-gray-800
                                            hover:shadow-xl hover:shadow-gray-500/6
                                            ${isDragActive ? "border-accent" : "border-base-300"}
                                            ${isDragReject ? "border-error bg-error/10" : ""}
                                        `}>
                                            <input {...getInputProps()} />
                                            
                                            {
                                                base64 ?
                                                <div className="flex flex-col items-center gap-1 text-center" onClick={() => setBase64('')}>
                                                    <ImageIcon size={32} weight="thin" />
                                                    <p className="font-bold font-primary">Imagem selecionada, clique para remover</p>
                                                </div>:
                                                <div className="flex flex-col items-center gap-1 text-center">
                                                    <span className="text-2xl"><UploadIcon size={32} weight="thin" /></span>
                                                    <p className="font-bold font-primary">Arraste arquivos aqui</p>
                                                    <p className="text-sm opacity-70 font-light font-secondary">ou clique para selecionar</p>
                                                </div> 
                                            }
                                            </div>
                                    </div>
                                </div>

                                <hr className="text-secondary/20 mt-3.5 -mx-6" />
                                <button class="btn bg-linear-to-b from-gray-700/90 to-gray-800/90 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light mt-3 w-full" type="submit">Salvar</button>
                            </form>
                        </div>
                    </dialog>



                    {/* Modal de confirmação de exclusão */}
                    <dialog id={`modal_apaga_${props.item.id}`} className="modal">
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
                                
                                <button className="btn bg-linear-to-b from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 hover:dark:from-red-700 hover:dark:to-red-800 dark:from-red-600 dark:to-red-700 shadow-inner shadow-red-400 dark:shadow-red-500 text-red-200 font-secondary font-light mt-3 w-full" onClick={deleteFluxo}> {cliquesApaga > 0 ? "Clique novamente para apagar" : "Apagar"}</button>

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