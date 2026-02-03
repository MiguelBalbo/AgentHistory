import { DownloadIcon, GearIcon, RobotIcon, UploadIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    
    
    function baixarJSON () {
        const localStorageRead = localStorage.getItem("fluxos")
        console.log(localStorageRead);
        const blob = new Blob([localStorageRead], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "fluxos_exp.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url)
    };

    function importarJSON (event) {
        const arquivo = event.target.files[0]; // Pega o primeiro arquivo selecionado
        if (!arquivo) return;
        const leitor = new FileReader();

        leitor.onload = (e) => {
            try {
                const conteudo = JSON.parse(e.target.result);
                localStorage.setItem("fluxos", JSON.stringify(conteudo));
                window.location.reload();
            } catch (erro) {
            console.error(erro);
            }
        };

        leitor.readAsText(arquivo); // Inicia a leitura do arquivo como texto
    };

    function irParaHome() {
        navigate("/");
    }

    return (
        <div class="navbar bg-accent shadow-sm h-22.5">
            <div class="flex-1">
                <button class="btn btn-ghost btn-accent" onClick={irParaHome}>
                    <RobotIcon size={40} weight="fill" className="text-base-100" />
                </button>
            </div>
            <div class="flex-none">
                <button class="btn btn-ghost btn-accent">
                    <h1 className="font-light text-base-100 text-xl">Agent History</h1>
                </button>

                <button class="btn btn-ghost btn-accent">
                    <h1 className="font-light text-base-100 text-xl" onClick={()=>document.getElementById('modal_config').showModal()}><GearIcon size={32} weight="thin" /></h1>
                </button>
            </div>


            {/* Modal de config */}
            <dialog id="modal_config" className="modal">
                <div className="modal-box bg-base-100">
                    <form method="dialog">
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-10 top-5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-red-50" >✕</button>
                    </form>
                    <h3 className="text-2xl font-primary mb-2">Configurações</h3>
                    <p>Importar/Exportar</p>
                    <div className="flex gap-2 mt-2">
                        <input type="file" className="file-input bg-secondary/40 text-primary" onChange={importarJSON}/>
                        <button className="btn bg-secondary/40 text-primary" onClick={() => baixarJSON()}><DownloadIcon size={32} weight="thin" /> Exportar</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}