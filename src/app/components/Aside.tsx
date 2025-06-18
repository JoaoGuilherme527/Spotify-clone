"use client"

import {useEffect, useState} from "react"
import {usePathname, useRouter} from "next/navigation"
import SpotifyIcon from "@/icons"
import {capitalize, getAverageColor, PlayContext, truncate} from "@/lib/spotifyActions"
import {
    SimplifiedAlbum,
    SimplifiedPlaylist,
    PrivateUser,
    Image,
    Paging,
    SimplifiedTrack,
    SavedAlbum,
    SavedTrack,
    Album,
    Saved,
} from "@/typings"
import {PlayFill} from "@geist-ui/icons"
import {useGlobalContext} from "@/context/GlobalContext"

interface AsideProps {
    token: string
    albums: Paging<SavedAlbum>
    playlists: Paging<SimplifiedPlaylist>
    savedTracks: Paging<SavedTrack>
    user: PrivateUser
}

interface LibraryItemProps {
    item: Partial<LibraryItem>
    token: string
    asideOpen: boolean
    isHover: string
    setIsHover: (id: string) => void
    onClickNavigate: () => void
    imageUrl: string
    subtitle: string
    playUris?: string[]
}

type LibraryItem = (SimplifiedAlbum | SimplifiedPlaylist) & {id: string}


function LibraryItemCard({item, token, asideOpen, isHover, setIsHover, onClickNavigate, imageUrl, subtitle, playUris}: LibraryItemProps) {
    const {currentPLaying} = useGlobalContext()
    const pathname = usePathname()
    const isHovered = isHover === item.id
    return (
        <div
            className={`w-full flex gap-4 hover:bg-white/5 imageHover text-green-500 p-[6px] rounded items-center cursor-pointer pr-3 ${
                pathname.includes(item.id as string) && "bg-white/10"
            }  `}
            onMouseEnter={() => setIsHover(item.id as string)}
            onMouseLeave={() => setIsHover("")}
        >
            <div
                className="rounded w-12 relative flex-shrink-0 shadow"
                onClick={() =>
                    asideOpen
                        ? playUris
                            ? PlayContext({token, uris: playUris})
                            : PlayContext({token, context_uri: item.uri as string})
                        : onClickNavigate()
                }
            >
                {isHovered && asideOpen && (
                    <div className="bg-zinc-950/70 absolute inset-0 rounded flex items-center justify-center">
                        <PlayFill color="white" size={25} />
                    </div>
                )}
                <img src={imageUrl} alt={item.name} width={48} height={48} className="rounded w-12" />
            </div>

            {asideOpen && (
                <div onClick={onClickNavigate} className="flex flex-col justify-center w-full">
                    <p className={`text-md font-bold ${currentPLaying.contextUri === item.uri ? "text-green-500" : "text-white"}`}>
                        {truncate(item.name as string)}
                    </p>
                    <p className="text-sm text-white opacity-50">{subtitle}</p>
                </div>
            )}
            {!currentPLaying.paused && currentPLaying.contextUri === item.uri && asideOpen && (
                <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="24" fill="currentColor">
                    <path d="M10.016 1.125A.75.75 0 0 0 8.99.85l-6.925 4a3.64 3.64 0 0 0 0 6.299l6.925 4a.75.75 0 0 0 1.125-.65v-13a.75.75 0 0 0-.1-.375zM11.5 5.56a2.75 2.75 0 0 1 0 4.88z"></path>
                    <path d="M16 8a5.75 5.75 0 0 1-4.5 5.614v-1.55a4.252 4.252 0 0 0 0-8.127v-1.55A5.75 5.75 0 0 1 16 8"></path>
                </svg>
            )}
        </div>
    )
}

export default function Aside({token, albums, playlists, savedTracks, user}: AsideProps) {
    const [variant, setVariant] = useState(false)
    const [asideOpen, setAsideOpen] = useState(true)
    const [isHover, setIsHover] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [searchType, setSearchType] = useState("")
    const [isSearchActive, setIsSearchActive] = useState(false)

    const router = useRouter()

    let libraryList: LibraryItem[] = [...albums.items.map(({album}: any) => album), ...playlists.items]

    if (searchTerm) {
        libraryList = libraryList.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    } else {
        libraryList.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (searchType) {
        libraryList = libraryList.filter((item) => item.type === searchType)
    }

    const renderLikedSongs = () => (
        <LibraryItemCard
            item={{id: "tracks", name: "Liked Songs", type: "playlist"}}
            token={token}
            asideOpen={asideOpen}
            isHover={isHover}
            setIsHover={setIsHover}
            imageUrl="https://misc.scdn.co/liked-songs/liked-songs-64.png"
            subtitle={`Playlist • ${savedTracks.total} songs`}
            playUris={savedTracks.items.map(({track}: any) => track.uri)}
            onClickNavigate={() => router.push("/collection/tracks")}
        />
    )

    return (
        <aside
            className={`${asideOpen ? "w-96" : "w-20 flex items-center"} overflow-x-hidden rounded-lg bg-[#121212] flex flex-col h-full`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between w-full p-4 ${!asideOpen && "flex-col gap-3 pb-2"}`}>
                <div onClick={() => setAsideOpen(!asideOpen)} className="flex items-center flex-1 gap-3 cursor-pointer">
                    <button
                        onMouseEnter={() => setVariant(true)}
                        onMouseLeave={() => setVariant(false)}
                        className="hover:scale-125 cursor-pointer py-2"
                    >
                        <SpotifyIcon icon={asideOpen ? "Library" : "LibraryOpen"} variant={!asideOpen && !variant} color="#fafafaa0" />
                    </button>
                    {asideOpen && <h1 className="cursor-pointer text-md text-white font-extrabold">Your Library</h1>}
                </div>
                {asideOpen && (
                    <div className="flex items-center gap-3">
                        <button className="flex gap-2 hover:scale-105 transition-all items-center hover:bg-zinc-700 bg-zinc-800 px-5 py-2 rounded-full text-white font-bold">
                            <SpotifyIcon icon="Plus" color="#fafafaa0" />
                            Create
                        </button>
                        <button className="hover:scale-105">
                            <SpotifyIcon icon="Expand" color="#fafafaa0" />
                        </button>
                    </div>
                )}
                {!asideOpen && (
                    <button className="flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 bg-zinc-800 rounded-full text-white font-bold p-2">
                        <SpotifyIcon icon="Plus" color="#fafafaa0" />
                    </button>
                )}
            </div>

            {/* Filters */}
            {asideOpen && (
                <div className="flex-col flex gap-2">
                    <div className="flex items-center gap-3 w-full px-3">
                        {searchType != "" && (
                            <button
                                onClick={() => setSearchType("")}
                                className="cursor-pointer flex gap-2 p-2 rounded-full font-semibold transition-all items-center hover:bg-zinc-700 bg-zinc-800"
                            >
                                <SpotifyIcon icon="Plus" color="#fafafaa0" className="rotate-45" />
                            </button>
                        )}
                        {["playlist", "album"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSearchType(searchType === type ? "" : type)}
                                className={`cursor-pointer flex gap-2 px-5 py-1 rounded-full font-semibold transition-all items-center hover:bg-zinc-700 ${
                                    searchType === type ? "text-black bg-white" : "text-white bg-zinc-800"
                                }`}
                            >
                                {capitalize(type)}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-1/2 px-3">
                        {isSearchActive ? (
                            <div className="bg-zinc-800 flex items-center px-2 p-1 gap-3 rounded w-full">
                                <SpotifyIcon icon="Search" color="white" width={18} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onBlur={() => {
                                        setIsSearchActive(false)
                                        setSearchTerm("")
                                    }}
                                    className="w-full outline-0 text-white bg-transparent"
                                    autoFocus
                                    placeholder="Search in your library"
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSearchActive(true)}
                                className="cursor-pointer p-2 rounded-full hover:bg-zinc-800 hover:scale-105"
                            >
                                <SpotifyIcon icon="Search" color="white" width={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="flex flex-col px-2 pt-3 " style={{height: "500px"}}>
                {libraryList.map((item, i) => (
                    <LibraryItemCard
                        key={i}
                        item={item}
                        token={token}
                        asideOpen={asideOpen}
                        isHover={isHover}
                        setIsHover={setIsHover}
                        imageUrl={item.images[0]?.url || ""}
                        subtitle={
                            item.type === "album"
                                ? `${capitalize(item.album_type)} • ${item.artists.map((a) => a.name).join(", ")}`
                                : `Playlist • ${"owner" in item ? item.owner.display_name : user.display_name}`
                        }
                        onClickNavigate={() => {
                            router.push(`/${item.type}/${item.id}`)
                        }}
                    />
                ))}
                {searchTerm === "" && searchType === "" && renderLikedSongs()}
            </div>
        </aside>
    )
}
