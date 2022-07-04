import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
            <div className="p-2 bg-light rounded-pill text-primary fw-bold" >
                <ConnectButton moralisAuth={false}/>
            </div>
    )
}
