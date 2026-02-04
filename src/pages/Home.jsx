import Navbar from "../components/Navbar.jsx"
import Card from "../components/Card.jsx"
import { useState } from "react"
import { ImageIcon, MagnifyingGlassIcon, PlusCircleIcon, UploadIcon, XIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import imageCompression from 'browser-image-compression';
import { Squircle } from "@squircle-js/react"
import { useDropzone } from "react-dropzone";
import { Label, FileInput, Select, TextInput } from "flowbite-react";



export default () => {

    const localStorageRead = localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : []

    const contrato = new Set()
    const [cards, setCards] = useState(localStorageRead)
    const [filtro, setFiltro] = useState('tudo')
    const [fluxo, setFluxo] = useState();
    const [contratoF, setContratoF] = useState();
    const [base64, setBase64] = useState('');
    const [busca,setBusca] = useState('')
    const {getRootProps, getInputProps, isDragActive, isDragReject} = 
    useDropzone({accept: {"image/*": []}, maxFiles: 1, onDrop: (files) => {handleImagem(files)}});
    
    
    
    {cards.map(item => {
        contrato.add(item.contrato)
    })}

    

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


    return (
        <div>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <h1 className="font-primary text-4xl">Home</h1>
                    
                    <div className="flex gap-5">
                        <div className="w-100">
                            <TextInput className="text-secondary font-secondary font-light" type="text" icon={MagnifyingGlassIcon} placeholder="Buscar" onChange={(e) => setBusca(e.target.value)} />
                        </div>
                        <Select onChange={(e) => setFiltro(e.target.value)} className="font-primary text-secondary font-light w-75">
                            <option selected value='tudo'>Todos os contratos</option>
                            {Array.from(contrato).map(item => {
                                return(
                                    <option value={item}>{item}</option>
                                )
                            })}
                        </Select>
                    </div>
                </div>

                <div className="mt-5 flex gap-5 flex-wrap">
                    {cards
                    .filter(card => filtro === 'tudo' || card.contrato === filtro)
                    .filter(card => filtro === '' || card.nomeFluxo.toLowerCase().includes(busca.toLowerCase()) )
                    .map(item => {
                        return (
                            <Card key={item.id} item={item} />
                        )
                    })}
                    <button
                        className="bg-linear-to-br from-accent/30 to-accent/50 w-50 h-75 shadow-sm hover:shadow-xl hover:shadow-accent/25 rounded-2xl cursor-pointer"
                        onClick={()=>document.getElementById('my_modal_3').showModal()}>
                        <div className="flex flex-col items-center justify-center text-center font-primary text-gray-900 dark:text-gray-50">
                            <PlusCircleIcon size={44} weight="thin" />
                            <h2 className="text-xl">Adicionar</h2>
                        </div>
                    </button>
                </div>
            
            </div>



            {/* modal de criar fluxo */}
            <dialog id="my_modal_3" class="modal">
                <div class="modal-box bg-gray-100 dark:bg-gray-700  dark:text-gray-50 text-gray-900">
                    <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 class="text-2xl font-primary">Novo fluxo</h3>
                    <form onSubmit={(e) => {
                        localStorageRead.push({
                            id: crypto.randomUUID(),
                            icone: base64,
                            nomeFluxo: fluxo,
                            contrato: contratoF,
                            agentes: []
                        })

                        localStorage.setItem("fluxos", JSON.stringify(localStorageRead))
                    }} className="">
                        <div className="mt-3">
                            <label htmlFor="fluxoinpt" className="font-secondary">Nome do fluxo</label>
                            <input onChange={(e) => setFluxo(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do fluxo" className="input w-full font-secondary bg-gray-200 dark:bg-gray-800" required />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="contratoinpt" className="font-secondary">Nome do contrato</label>
                            <input onChange={(e) => setContratoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do contrato" className="input w-full font-secondary bg-gray-200 dark:bg-gray-800" required />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="iconinpt" class="font-secondary">Ícone do fluxo</label>
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

                        <button className="btn bg-linear-to-b from-gray-700/90 to-gray-800/90 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light mt-3" type="submit">Salvar</button>
                        {/* <button class="btn btn-accent text-primary font-primary mt-3" type="submit">Salvar</button> */}
                    </form>


                </div>
            </dialog>
        </div>
        
    )
}