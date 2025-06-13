"use client"

import SpotifyIcon from "@/icons"
import {PlayContext} from "@/lib/spotifyActions"
import {PlaylistTrack, PrivateUser, ResponsePromise, SavedAlbum, SavedTrack, SimplifiedAlbum, SimplifiedPlaylist} from "@/typings"
import {PlayFill} from "@geist-ui/icons"
import {useRouter} from "next/navigation"
import {useState} from "react"

interface AsideProps {
    token: string
    albums: Array<SimplifiedAlbum>
    playlists: Array<SimplifiedPlaylist>
    user: PrivateUser
    savedTracks: ResponsePromise
}

type LibraryItem = SimplifiedAlbum | SimplifiedPlaylist

function CapitalizeFirstLetter(item: string) {
    return item.slice(0, 1).toUpperCase() + item.slice(1, item.length)
}
function WordMinify(item: string) {
    return item.length > 25 ? item.slice(0, 25) + "..." : item
}

export default function Aside({token, albums, playlists, savedTracks, user}: AsideProps) {
    const [variant, setVariant] = useState(false)
    const [asideOpen, setAsideOpen] = useState(true)
    const [isHover, setIsHover] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [searchType, setSearchType] = useState("")
    const [isSearchActive, setIsSearchActive] = useState(false)
    const router = useRouter()

    var libraryList: Array<LibraryItem> = Array.prototype.concat(albums, playlists)

    libraryList =
        searchTerm.length > 0
            ? libraryList.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : libraryList.toSorted((a, b) => a.name.localeCompare(b.name))

    libraryList = searchType.length > 0 ? libraryList.filter((item) => item.type === searchType) : libraryList

    const AlbumComponent = ({item}: {item: SimplifiedAlbum}) => {
        return asideOpen ? (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover(item.id)}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-12 relative"
                    onClick={() => {
                        PlayContext(token, item.uri)
                    }}
                >
                    {isHover === item.id && (
                        <div className="bg-zinc-950/70 absolute pl-1 inset-0 rounded flex items-center justify-center">
                            <PlayFill color="white" size={25} />
                        </div>
                    )}
                    <img src={item.images[0]?.url} alt={item.name} width={48} height={48} className="rounded border-0 w-12" />
                </div>
                <div
                    onClick={() => {
                        router.push("/album/" + item.id)
                    }}
                    className="flex flex-col justify-center text-white"
                >
                    <p className="text-md  font-extrabold">{WordMinify(item.name)}</p>
                    <div className="flex gap-2">
                        <p className="text-sm opacity-50">{CapitalizeFirstLetter(item.type)}</p>
                        <p className="text-sm opacity-50"> • </p>
                        <p className="text-sm opacity-50">{item.artists.map((artist) => artist.name).join(", ")}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover(item.id)}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-12 relative"
                    onClick={() => {
                        PlayContext(token, item.uri)
                    }}
                >
                    <img src={item.images[0]?.url} alt={item.name} width={48} height={48} className="rounded border-0 w-12" />
                </div>
            </div>
        )
    }

    const PlaylistComponent = ({item}: {item: SimplifiedPlaylist}) => {
        return asideOpen ? (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover(item.id)}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-12 relative"
                    onClick={() => {
                        PlayContext(token, item.uri)
                    }}
                >
                    {isHover === item.id && (
                        <div className="bg-zinc-950/70 absolute pl-1 inset-0 rounded flex items-center justify-center">
                            <PlayFill color="white" size={25} />
                        </div>
                    )}
                    <img src={item.images[0]?.url} alt={item.name} width={48} height={48} className="rounded border-0 w-12" />
                </div>
                <div
                    onClick={() => {
                        router.push("/playlist/" + item.id)
                    }}
                    className="flex flex-col justify-center text-white"
                >
                    <p className="text-md  font-extrabold">{WordMinify(item.name)}</p>
                    <div className="flex gap-2">
                        <p className="text-sm opacity-50">{CapitalizeFirstLetter(item.type)}</p>
                        <p className="text-sm opacity-50"> • </p>
                        <p className="text-sm opacity-50">{item.owner.display_name}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover(item.id)}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-12 relative"
                    onClick={() => {
                        PlayContext(token, item.uri)
                    }}
                >
                    <img src={item.images[0]?.url} alt={item.name} width={48} height={48} className="rounded border-0 w-12" />
                </div>
            </div>
        )
    }

    const LikedComponent = () => {
        return asideOpen ? (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover("liked_songs")}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-13 relative flex items-center justify-center"
                    onClick={() => {
                        PlayContext(
                            token,
                            savedTracks.items.map(({track}) => track.uri)
                        )
                    }}
                >
                    {isHover === "liked_songs" && (
                        <div className="bg-zinc-950/70 absolute pl-1 inset-0 rounded flex items-center justify-center">
                            <PlayFill color="white" size={25} />
                        </div>
                    )}
                    <img
                        src={"https://misc.scdn.co/liked-songs/liked-songs-64.png"}
                        alt={"liked songs"}
                        width={52}
                        height={52}
                        className="rounded border-0"
                    />
                </div>
                <div
                    onClick={() => {
                        router.push("/collection/" + 'Liked Songs')
                    }}
                    className="flex flex-col justify-center text-white"
                >
                    <p className="text-lg  font-extrabold">Liked Songs</p>
                    <div className="flex gap-2">
                        <p className="text-sm opacity-50">Playlist</p>
                        <p className="text-sm opacity-50"> • </p>
                        <p className="text-sm opacity-50">{savedTracks.total} songs</p>
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="w-full flex gap-4 hover:bg-white/5 imageHover p-2 rounded cursor-pointer"
                onMouseEnter={() => setIsHover("liked_songs")}
                onMouseLeave={() => setIsHover("")}
            >
                <div
                    className="rounded w-12 relative"
                    onClick={() => {
                        PlayContext(
                            token,
                            savedTracks.items.map(({track}) => track.uri)
                        )
                    }}
                >
                    <img
                        src={"https://misc.scdn.co/liked-songs/liked-songs-64.png"}
                        alt={"liked songs"}
                        width={52}
                        height={52}
                        className="rounded border-0"
                    />
                </div>
            </div>
        )
    }

    return (
        <aside
            className={`${
                asideOpen ? "w-96 py-3 gap-3" : "w-20 p-4 flex items-center"
            } overflow-x-hidden rounded-lg bg-zinc-50/5 flex flex-col `}
        >
            {asideOpen ? (
                <div className="flex items-center justify-between w-full px-5">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            className="hover:scale-125 cursor-pointer"
                            onMouseEnter={() => setVariant(true)}
                            onMouseLeave={() => setVariant(false)}
                            onClick={() => setAsideOpen(!asideOpen)}
                        >
                            <SpotifyIcon icon="Library" className="scale-115" color="#fafafaa0" />
                        </button>
                        <h1 className="text-md text-white font-extrabold">Your Library</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 bg-zinc-800 px-5 py-2 rounded-full">
                            <SpotifyIcon icon="Plus" color="#fafafaa0" />
                            <span className="text-white font-bold">Create</span>
                        </button>

                        <button className="flex gap-2 items-center cursor-pointer">
                            <SpotifyIcon icon="Expand" color="#fafafaa0" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-between w-full px-5 gap-4">
                    <button
                        className="hover:scale-105 cursor-pointer p-2"
                        onMouseEnter={() => setVariant(true)}
                        onMouseLeave={() => setVariant(false)}
                        onClick={() => setAsideOpen(!asideOpen)}
                    >
                        <SpotifyIcon icon="LibraryOpen" className="scale-120" variant={!variant} color="#fafafaa0" />
                    </button>
                    <button className="flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 bg-zinc-800 p-2 rounded-full">
                        <SpotifyIcon icon="Plus" color="#fafafaa0" />
                    </button>
                </div>
            )}
            {asideOpen && (
                <div className="flex items-center gap-3 w-full px-3">
                    <button
                        onClick={() => {
                            if (searchType === "playlist") {
                                setSearchType("")
                            } else setSearchType("playlist")
                        }}
                        className={`flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 ${
                            searchType == "playlist" ? "text-black bg-white" : "text-white bg-zinc-800"
                        } px-5 py-1 rounded-full font-semibold`}
                    >
                        Playlist
                    </button>
                    <button
                        onClick={() => {
                            if (searchType === "album") {
                                setSearchType("")
                            } else setSearchType("album")
                        }}
                        className={`flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 ${
                            searchType == "album" ? "text-black bg-white" : "text-white bg-zinc-800"
                        } px-5 py-1 rounded-full font-semibold`}
                    >
                        Album
                    </button>
                </div>
            )}
            {asideOpen && (
                <div className="flex items-center gap-3 w-1/2 px-3">
                    {isSearchActive ? (
                        <div className="bg-zinc-800 flex items-center px-2 p-1 gap-3 rounded">
                            <SpotifyIcon icon="Search" color="white" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                className="w-full outline-0 text-white"
                                onBlur={() => {
                                    setIsSearchActive(false)
                                    setSearchTerm("")
                                }}
                                autoFocus
                                placeholder="Search in your library"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSearchActive(true)}
                            className="flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-800 p-2 rounded-full"
                        >
                            <SpotifyIcon icon="Search" color="white" />
                        </button>
                    )}
                </div>
            )}

            <div className="flex flex-col px-2 py-3">
                {libraryList.map((item, i) => {
                    switch (item.type) {
                        case "album":
                            return <AlbumComponent key={i} item={item} />
                        case "playlist":
                            return <PlaylistComponent key={i} item={item} />
                        default:
                            return null
                    }
                })}
                {searchTerm.length <= 0 && searchType.length <= 0 ? <LikedComponent /> : <></>}
            </div>
        </aside>
    )
}
