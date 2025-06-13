import SpotifyIcon from "@/icons"

export default function Header() {
    return (
        <header className="h-17 w-full justify-between flex">
            <div className="flex px-7 items-center justify-center">
                <SpotifyIcon icon="SpotifyLogo" color="white" />
            </div>
            <div >
            </div>
        </header>
    )
}
