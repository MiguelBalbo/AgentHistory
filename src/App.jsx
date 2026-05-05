import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Fluxo from './pages/Fluxo.jsx'
import Agente from "./pages/Agente.jsx"
import { FluxosProvider } from "./context/FluxosContext.jsx"

function App() {
return (
    <FluxosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fluxo" element={<Fluxo />} />
          <Route path="/agente" element={<Agente />} />
        </Routes>
      </BrowserRouter>
    </FluxosProvider>
  )
}

export default App