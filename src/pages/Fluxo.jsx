import Navbar from "../components/Navbar.jsx"
import Card from "../components/CardAgent.jsx"
import { useState } from "react"
import { ArrowCircleLeftIcon, MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { TextInput, Select } from "flowbite-react"


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
                        <div className="w-100">
                            <TextInput className="text-secondary font-secondary font-light" type="text" icon={MagnifyingGlassIcon} placeholder="Buscar" onChange={(e) => setBusca(e.target.value)} />
                        </div>
                        <Select onChange={(e) => setFiltro(e.target.value)} className="font-secondary font-light text-secondary w-75">
                            <option selected value='tudo'>Todos os subfluxos</option>
                            {Array.from(subfluxo).map(item => {
                                return(
                                    <option value={item}>{item}</option>
                                )
                            })}
                        </Select>
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
                    <button 
                    className="bg-linear-to-br from-accent/30 to-accent/50 hover:from-accent/50 hover:to-accent/70 w-40 h-55 shadow-sm hover:shadow-xl hover:shadow-accent/25 rounded-2xl cursor-pointer" 
                    onClick={()=>document.getElementById('modal_add_agente').showModal()}>
                        <div className="flex flex-col items-center justify-center text-center font-primary text-gray-900 dark:text-gray-50 border-accent/70">
                            <PlusCircleIcon size={44} weight="thin" />
                            <h2 className="card-title">Adicionar</h2>
                        </div>
                    </button>
                </div>
            </div>



            {/* modal de criar agente */}
            <dialog id="modal_add_agente" class="modal">
                <div class="modal-box px-0">
                    <div className="flex">
                        <h3 class="text-2xl text-secondary font-primary ml-6 mt-1">Novo agente</h3>
                        <form method="dialog">
                            <button class="btn btn-md btn-circle btn-ghost ml-72">✕</button>
                        </form>
                    </div>
                    <hr className="text-secondary/20 mt-3.5 -my-2" />

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

                    }} className="px-6 mt-5">

                        <div className="mt-3 text-secondary font-secondary">
                            <label htmlFor="fluxoinpt" className="">Nome do Agente</label>
                            <input onChange={(e) => setAgenteF(e.target.value)} type="text" id="fluxoinpt" placeholder="Digite o nome do agente" className="input w-full" required />
                        </div>

                        <div className="mt-3 text-secondary font-secondary">
                            <label htmlFor="contratoinpt" className="">Nome do subfluxo</label>
                            <input onChange={(e) => setSubfluxoF(e.target.value)} type="text" id="contratoinpt" placeholder="Digite o nome do subfluxo" className="input w-full" required />
                        </div>

                        <hr className="text-secondary/20 mt-4 -mx-6 " />
                        <button class="btn bg-linear-to-b from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light mt-3 w-full" type="submit">Salvar</button>
                    </form>
                </div>
            </dialog>
        </>
    )
}