import { DownloadIcon, FileIcon, GearIcon, RobotIcon, UploadIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDropzone } from "react-dropzone";


export default () => {
    const navigate = useNavigate();
    const {getRootProps, getInputProps, isDragActive, isDragReject} = 
    useDropzone({accept: {"application/json": []}, maxFiles: 1, onDrop: (files) => {setArquivo(files)}});
    const [ arquivo, setArquivo ] = useState()
    
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

    function importarJSON (files) {
        const arquivo = files[0]; // Pega o primeiro arquivo selecionado
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
                    <RobotIcon size={40} weight="fill" className="text-white" />
                </button>
            </div>
            <div class="flex-none">
                <button class="btn btn-ghost btn-accent">
                    <h1 className="font-primary text-white text-xl">Agent History</h1>
                </button>

                <button class="btn btn-ghost btn-accent">
                    <h1 className="font-secondary text-white text-xl" onClick={()=>document.getElementById('modal_config').showModal()}><GearIcon size={32} weight="thin" /></h1>
                </button>
            </div>


            {/* Modal de config */}
            <dialog id="modal_config" className="modal">
                <div className="modal-box bg-base-100">
                    <form method="dialog">
                        <button class="btn btn-md btn-circle btn-ghost absolute right-4 top-6">✕</button>
                    </form>
                    <div className="flex gap-2">
                        <div className="p-2 bg-accent/20 rounded-full"><GearIcon size={28} weight="thin" /></div>
                        <h3 class="text-2xl font-primary mt-2"> Configurações</h3>
                    </div>

                    <hr className="text-secondary/20 mt-3.5 -mx-6" />

                    <div className="mt-3.5 text-secondary font-secondary">
                        <p>Importar/Exportar</p>
                            <div className="flex flex-col gap-2">
                                <div className="mt-3">
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
                                        arquivo ?
                                        <div className="flex flex-col items-center gap-1 text-center" onClick={() => setBase64('')}>
                                            <FileIcon size={32} weight="thin" />
                                            <p className="font-bold font-primary">Arquivo selecionado, clique para remover</p>
                                        </div>:
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <span className="text-2xl"><UploadIcon size={32} weight="thin" /></span>
                                            <p className="font-bold font-primary">Arraste arquivos aqui</p>
                                            <p className="text-sm opacity-70 font-light font-secondary">ou clique para selecionar</p>
                                        </div> 
                                    }
                                </div>
                            </div>
                            {/* <input type="file" className="file-input bg-secondary/40 text-primary" onChange={importarJSON}/> */}


                            <button className="btn bg-linear-to-br from-gray-500/90 hover:from-gray-600 hover:to-gray-600 to-gray-700/90 hover:dark:from-slate-600 hover:dark:to-slate-700 dark:from-slate-400 dark:to-slate-500 shadow-inner shadow-gray-400 dark:shadow-slate-300 text-white dark:text-gray-900 font-secondary font-light w-full mt-3" onClick={() => baixarJSON()}><DownloadIcon size={32} weight="thin" /> Exportar</button>
                        </div>
                    </div>

                    <hr className="text-secondary/20 mt-3.5 -mx-6" />

                    <button className="btn bg-linear-to-br from-gray-700/90 hover:from-gray-800 hover:to-gray-900 to-gray-800/90 hover:dark:from-slate-300 hover:dark:to-slate-400 dark:from-slate-200 dark:to-slate-300 shadow-inner shadow-gray-600 dark:shadow-slate-100 text-white dark:text-gray-900 font-secondary font-light w-full mt-3.5" onClick={() => importarJSON(arquivo)}>Salvar</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}