import Navbar from "../components/Navbar"
import { ArrowCircleLeftIcon } from "@phosphor-icons/react"
import { useNavigate, useSearchParams } from "react-router-dom";
import CollapseAgente from "../components/CollapseAgente";


export default () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const localStorageRead = localStorage.getItem("fluxos") ? JSON.parse(localStorage.getItem("fluxos")) : []
    const fluxoAchado = localStorageRead.find(f =>
        f.agentes.some(a => a.id === searchParams.get("id"))
    );
    const agenteAchado = fluxoAchado?.agentes.find(
        a => a.id === searchParams.get("id")
    );
    const vetHistorico = agenteAchado.historico

    function voltarPag() {
        navigate(-1);
    }


    return (
        <>
            <Navbar />
            <div className="p-10">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <ArrowCircleLeftIcon size={40} weight="thin" onClick={voltarPag}/>
                        <h1 className="font-primary text-4xl">{fluxoAchado.nomeFluxo} / {agenteAchado.nomeAgente}</h1>
                    </div>
                </div>

                <div>
                    {vetHistorico.map(item => {
                        return(
                            <CollapseAgente prompt={item} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}