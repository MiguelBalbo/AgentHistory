import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/placeholder.avif"
import { DotsThreeIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import imageCompression from 'browser-image-compression';

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
            maxWidthOrHeight: 100,   
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
                <div className="card bg-secondary w-60 shadow-sm">
                        <figure className="px-10 pt-10">
                            <img src={base64 ? base64 : Placeholder}
                            alt="Icone do fluxo"
                            className="rounded-xl w-25 h-25" />
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title text-primary font-primary">{fluxo}</h2>
                            <p className="font-primary">{contrato}</p>
                            <div className="card-actions">
                                <button className="btn font-primary " onClick={paginaAgentes}>Acessar</button>
                                <div class="dropdown -mt-1">
                                    <div tabindex="0" role="button" className="btn m-1 bg-base-100/50 w-15"><DotsThreeIcon size={32} weight="thin" /></div>
                                    <ul tabindex="-1" class="dropdown-content menu bg-base-100/75 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li><a className="font-primary text-primary" onClick={()=>document.getElementById(idModal).showModal()}><PencilIcon size={20} weight="thin"/> Renomear</a></li>
                                        <li><a className="font-primary text-error" onClick={deleteFluxo}><TrashIcon size={20} weight="thin" /> Apagar</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    
                    
                        {/* modal de editar fluxo */}
                        <dialog id={idModal} class="modal">
                            <div class="modal-box">
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                
                                <h3 class="text-2xl text-primary font-light">Novo fluxo</h3>
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
                                        <label htmlFor="fluxoinpt" className="text-primary font-primary">Nome do fluxo</label>
                                        <input defaultValue={fluxo} onChange={(e) => setFluxo(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do fluxo" className="input w-full text-primary font-primary" required />
                                    </div>

                                    <div className="mt-3">
                                        <label htmlFor="contratoinpt" className="text-primary font-primary">Nome do contrato</label>
                                        <input defaultValue={contrato} onChange={(e) => setContrato(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do contrato" className="input w-full text-primary font-primary" required />
                                    </div>
                                
                                    <div className="mt-3">
                                        <label htmlFor="iconinpt" class="text-primary font-primary">Ícone do fluxo</label>
                                        <div className="flex gap-1">
                                            <img src={base64 ? base64 : Placeholder} alt="Imagem do fluxo" className="h-10 w-10 rounded-sm border-primary/20 border"/>
                                            <input id="iconinpt" accept="image/*" onChange={handleImagem} type="file" class="file-input w-full text-primary font-primary"/>
                                        </div>
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