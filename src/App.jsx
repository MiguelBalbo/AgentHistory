import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Fluxo from './pages/Fluxo.jsx'
import Agente from "./pages/Agente.jsx"

function App() {
return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fluxo" element={<Fluxo />} />
        <Route path="/agente" element={<Agente />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App