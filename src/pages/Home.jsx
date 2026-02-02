import Navbar from "../components/Navbar.jsx"
import Card from "../components/Card.jsx"
import { useState } from "react"
import { MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import imageCompression from 'browser-image-compression';


export default () => {

    const localStorageRead = localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : []

    const contrato = new Set()
    const [cards, setCards] = useState(localStorageRead)
    const [filtro, setFiltro] = useState('tudo')
    const [fluxo, setFluxo] = useState();
    const [contratoF, setContratoF] = useState();
    const [base64, setBase64] = useState();
    const [busca,setBusca] = useState('')
    
    
    {cards.map(item => {
        contrato.add(item.contrato)
    })}

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


    return (
        <div>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <h1 className="font-primary text-4xl">Home</h1>
                    
                    <div className="flex gap-5">
                        <label class="input w-100 rounded-full bg-secondary/50">
                            <MagnifyingGlassIcon size={24} className="text-primary"/>
                            <input type="search" class="grow" placeholder="Buscar" className="font-primary text-primary" onChange={(e) => setBusca(e.target.value)}/>
                        </label>
                        <select onChange={(e) => setFiltro(e.target.value)} class="select font-primary text-primary rounded-full bg-secondary/50">
                            <option selected value='tudo'>Todos os contratos</option>
                            {Array.from(contrato).map(item => {
                                return(
                                    <option value={item}>{item}</option>
                                )
                            })}
                        </select>
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
                    <div className="card bg-secondary/50 w-60 h-73 shadow-sm" onClick={()=>document.getElementById('my_modal_3').showModal()}>
                        <div className="card-body items-center justify-center text-center">
                            <PlusCircleIcon size={44} weight="thin" />
                            <h2 className="card-title text-primary font-primary">Adicionar</h2>
                        </div>
                    </div>
                </div>
            
            </div>

            {/* modal de criar fluxo */}
            <dialog id="my_modal_3" class="modal">
                <div class="modal-box">
                    <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 class="text-2xl text-primary font-light">Novo fluxo</h3>
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
                            <label htmlFor="fluxoinpt" className="text-primary font-primary">Nome do fluxo</label>
                            <input onChange={(e) => setFluxo(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do fluxo" className="input w-full text-primary font-primary" required />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="contratoinpt" className="text-primary font-primary">Nome do contrato</label>
                            <input onChange={(e) => setContratoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do contrato" className="input w-full text-primary font-primary" required />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="iconinpt" class="text-primary font-primary">Ícone do fluxo</label>
                            <input id="iconinpt" accept="image/*" onChange={handleImagem} type="file" class="file-input w-full text-primary font-primary"/>
                        </div>

                        <button class="btn btn-secondary text-primary font-primary mt-3" type="submit">Salvar</button>
                    </form>


                </div>
            </dialog>
        </div>
        
    )
}