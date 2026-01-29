import Navbar from "../components/Navbar.jsx"
import Card from "../components/CardAgent.jsx"
import { useState } from "react"
import { ArrowCircleLeftIcon, MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { useSearchParams, useNavigate } from "react-router-dom"

export default () => {
    
    const localStorageRead = localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : []
    const [filtro, setFiltro] = useState('tudo')
    const [busca,setBusca] = useState('')
    const [agenteF,setAgenteF] = useState('')
    const [subfluxoF,setSubfluxoF] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();
    const fluxoSel = localStorageRead.find(f => f.id === searchParams.get("id"))
    const vetAgentes = fluxoSel.agentes
    const navigate = useNavigate();

    const subfluxo = new Set()
    {vetAgentes.map(item => {
        subfluxo.add(item.subfluxo)
    })}


    function irParaHome() {
        navigate(-1);
    }

    return (
        <>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <ArrowCircleLeftIcon size={40} weight="thin" onClick={irParaHome}/>
                        <h1 className="font-primary text-4xl">{fluxoSel.nomeFluxo}</h1>
                    </div>
                    <div className="flex gap-5">
                        <label class="input w-100 rounded-full bg-secondary/50">
                            <MagnifyingGlassIcon size={24} className="text-primary"/>
                            <input type="search" class="grow" placeholder="Buscar" className="font-primary text-primary" onChange={(e) => setBusca(e.target.value)}/>
                        </label>
                        <select onChange={(e) => setFiltro(e.target.value)} class="select font-primary text-primary rounded-full bg-secondary/50">
                            <option selected value='tudo'>Todos os subfluxos</option>
                            {Array.from(subfluxo).map(item => {
                                return(
                                    <option value={item}>{item}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                <div className="mt-5 flex gap-5 flex-wrap">
                    {vetAgentes
                        .filter(card => filtro === 'tudo' || card.subfluxo === filtro)
                        .filter(card => filtro === '' || card.nomeAgente.toLowerCase().includes(busca.toLowerCase()))
                        .map(item => {
                            return (
                                <Card key={item.id} id={item.id} titulo={item.nomeAgente} subtitulo={item.subfluxo}/>
                            )
                    })}
                    <div className="card bg-secondary/50 w-60 h-60 shadow-sm" onClick={()=>document.getElementById('modal_add_agente').showModal()}>
                        <div className="card-body items-center justify-center text-center">
                            <PlusCircleIcon size={44} weight="thin" />
                            <h2 className="card-title text-primary font-primary">Adicionar</h2>
                        </div>
                    </div>
                </div>
            </div>



            {/* modal de criar fluxo */}
            <dialog id="modal_add_agente" class="modal">
                <div class="modal-box">
                    <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 class="text-2xl text-primary font-light">Novo agente</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        vetAgentes.push({
                            id: crypto.randomUUID(),
                            nomeAgente: agenteF,
                            subfluxo: subfluxoF,
                            historico: []
                        })
                        
                        console.log(localStorageRead)
                        const index = localStorageRead.findIndex(obj => obj.id === fluxoSel.id);

                        console.log(index)
                        localStorageRead[index].agentes = vetAgentes
                        localStorage.setItem("fluxos", JSON.stringify(localStorageRead))

                        window.location.reload();

                    }} className="">
                        <div className="mt-3">
                            <label htmlFor="fluxoinpt" className="text-primary font-primary">Nome do Agente</label>
                            <input onChange={(e) => setAgenteF(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do agente" className="input w-full text-primary font-primary" required />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="contratoinpt" className="text-primary font-primary">Nome do subfluxo</label>
                            <input onChange={(e) => setSubfluxoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do subfluxo" className="input w-full text-primary font-primary" required />
                        </div>

                        <button class="btn btn-secondary text-primary font-primary mt-3" type="submit">Salvar</button>
                    </form>
                </div>
            </dialog>
        </>
    )
}