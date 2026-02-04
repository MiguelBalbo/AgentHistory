import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/placeholder.avif"
import { ArrowRightIcon, DotsThreeIcon, DotsThreeVerticalIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import imageCompression from 'browser-image-compression';
import { Squircle } from "@squircle-js/react";


export default (props) => {
    const navigate = useNavigate();
    const [localStorageRead, setLocalStorageRead] = useState(localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : [])
    const [fluxo, setFluxo] = useState(props.item.nomeFluxo);
    const [contrato, setContrato] = useState(props.item.contrato);
    const [base64, setBase64] = useState(props.item.icone); 
    const [isDeleted,setIsDeleted] = useState(false)
    const idModal = `modal_ren_${props.item.id}`

    function paginaAgentes(){
        navigate(`/fluxo?id=${props.item.id}`)
    }

    //função de apagar fluxo
    function deleteFluxo(){
        const lsrTemp = localStorageRead
        //console.log(lsrTemp);
        lsrTemp.splice(fi, 1)
        setLocalStorageRead(lsrTemp)
        localStorage.setItem("fluxos", JSON.stringify(localStorageRead));
        setIsDeleted(true)
    }

    async function handleImagem(e) {
        const file = e.target.files[0];
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
                                className="btn bg-linear-to-b from-gray-700/90 to-gray-800/90 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light" 
                                onClick={paginaAgentes}>
                                    Acessar <ArrowRightIcon size={24} weight="thin" />
                                </button>
                                <div class="dropdown dropdown-bottom dropdown-end -mt-1 absolute top-2 right-2">
                                    <div tabindex="0" role="button" className="btn btn-square bg-base-100/80 dark:bg-base-100/50 backdrop-blur-sm"><DotsThreeVerticalIcon size={32} weight="thin" className="w-10" /></div>
                                    <ul tabindex="-1" class="dropdown-content menu bg-base-100/80 backdrop-blur-sm rounded-box z-1 w-40 p-2 shadow-sm">
                                        <li><a className="" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Renomear</a></li>
                                        <li><a className="text-error" onClick={deleteFluxo}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* modal de editar fluxo */}
                    <dialog id={idModal} class="modal">
                        <div class="modal-box bg-gray-100 dark:bg-gray-700  dark:text-gray-50 text-gray-900">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            
                            <h3 class="text-2xl font-primary"> Novo fluxo</h3>
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
                                    <div className="flex gap-1">
                                        <img src={base64 ? base64 : Placeholder} alt="Imagem do fluxo" className="h-10 w-10 rounded-sm border-primary/20 border"/>
                                        <input id="iconinpt" accept="image/*" onChange={handleImagem} type="file" class="file-input w-full font-secondary "/>
                                    </div>
                                </div>
                            
                                <button class="btn bg-linear-to-b from-gray-700/90 to-gray-800/90 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light mt-3" type="submit">Salvar</button>
                            </form>
                        </div>
                    </dialog>
                </>      
            }
        </>
    )
}