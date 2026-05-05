import { createContext, useContext, useState, useEffect } from "react";

const FluxosContext = createContext();

export function FluxosProvider({ children }) {
    const [fluxos, setFluxos] = useState(() => {
        const saved = localStorage.getItem("fluxos");
        return saved ? JSON.parse(saved) : [];
    });

    // Sincroniza com o localStorage sempre que o estado mudar
    useEffect(() => {
        localStorage.setItem("fluxos", JSON.stringify(fluxos));
    }, [fluxos]);

    // Função para atualizar os fluxos de forma segura
    const updateFluxos = (newFluxos) => {
        setFluxos(newFluxos);
    };

    return (
        <FluxosContext.Provider value={{ fluxos, updateFluxos }}>
            {children}
        </FluxosContext.Provider>
    );
}

export function useFluxos() {
    return useContext(FluxosContext);
}
