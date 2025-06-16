import Aside from "@/app/components/Aside"
import Header from "@/app/components/Header"
import PlayerFooter from "@/app/components/Player"
import {GetAccessToken, RefreshToken} from "@/lib/actions"
import {GetCurrentUser, GetSaveTracksForUser, GetUserSavedAlbum, GetUserSavedPlaylist} from "@/lib/spotifyActions"
import {AxiosError} from "axios"
import {NextResponse} from "next/server"
import {redirect} from "next/navigation"

async function loadDataWithToken() {
    try {
        const token = await GetAccessToken()
        return {
            user: await GetCurrentUser(token),
            albums: await GetUserSavedAlbum(token),
            playlists: await GetUserSavedPlaylist({token}),
            savedTracks: await GetSaveTracksForUser(token),
            token,
        }
    } catch (error) {
        console.log("ERROR:", error)
        const axiosError = error as AxiosError
        if (axiosError.status === 401) {
            const newToken = await RefreshToken()
            if (newToken) {
                return {
                    user: await GetCurrentUser(newToken),
                    albums: await GetUserSavedAlbum(newToken),
                    playlists: await GetUserSavedPlaylist({token: newToken}),
                    savedTracks: await GetSaveTracksForUser(newToken),
                    token: newToken,
                }
            }
        }
        throw error
    }
}

export default async function HomeRoot({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    try {
        const {albums, playlists, savedTracks, token, user} = await loadDataWithToken()

        return (
            <div className="h-screen overflow-y-hidden flex flex-col bg-black ">
                <Header user={user} />
                <main className="flex items-start rounded relative gap-[6px] px-2" style={{height:'100%'}}>
                    <Aside token={token} albums={albums} playlists={playlists} user={user} savedTracks={savedTracks} />
                    <section className="flex-1 rounded-lg bg-[#121212] h-full">{children}</section>
                </main>
                <PlayerFooter token={token} />
            </div>
        )
    } catch (Error) {
        const error = Error as AxiosError

        // redireciona para login se der erro 401
        if (error.status === 401) {
            redirect("/login")
        }

        // fallback genérico
        redirect("/login")
    }
}
