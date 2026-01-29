import BlipLogo from "../assets/blip.svg"
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();

    function irParaHome() {
        navigate("/");
    }

    return (
        <div class="navbar bg-accent shadow-sm h-22.5">
            <div class="flex-1">
                <button class="btn btn-ghost btn-accent" onClick={irParaHome}>
                    <img src={BlipLogo} alt="" className="w-20" />
                </button>
            </div>
            <div class="flex-none">
                <button class="btn btn-ghost btn-accent">
                    <h1 className="font-light text-base-100 text-xl">Agent History</h1>
                </button>
            </div>
        </div>
    )
}