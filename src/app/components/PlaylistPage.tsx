"use client"

import SpotifyIcon from "@/icons"
import {getAverageColor} from "@/lib/spotifyActions"
import {Image as ImageType, Playlist, PlaylistRes, PlaylistTrack, PublicUser, SimplifiedPlaylist} from "@/typings"
import {PlayFill} from "@geist-ui/icons"
import Image from "next/image"
import {useEffect, useState} from "react"

export function PlaylistPage({item, contextUser}: {item: PlaylistRes; contextUser: PublicUser}) {
    const [color, setColor] = useState("#ffffff40")
    const [imgUrl, setImageUrl] = useState("")
    const length = item.name.length
    const getLength = () => {
        if (length >= 18) {
            return "text-2xl"
        } else if (length >= 14) {
            return "text-7xl"
        } else if (length >= 10) {
            return "text-8xl"
        } else {
            return "text-xl"
        }
    }

    useEffect(() => {
        console.log(item)
        const image = item.images as ImageType[]
        if (!image) return
        getAverageColor(image[0].url).then((color) => {
            setImageUrl(image[0].url)
            setColor(color)
        })
    }, [])

    return (
        <div className="text-white rounded-lg relative overflow-scroll outline-0 h-full flex-col">
            {/* <div className={`w-full flex items-center px-4 p-1 gap-2 absolute left-0 right-0 top-0`} style={{background: color}}>
                <button className="bg-green-500 p-3 rounded-full">
                    <PlayFill color="black" />
                </button>
                <h1 className="font-extrabold text-3xl">{item.name}</h1>
            </div> */}
            <div
                className="flex-col"
                style={{
                    backgroundImage: `linear-gradient(to top, transparent 10%, ${color} 80%)`,
                }}
            >
                <div className=" flex flex-col gap-2 px-6 pt-12 pb-6">
                    <div className="flex gap-4 items-end">
                        {imgUrl.length > 0 ? (
                            <Image
                                src={imgUrl}
                                alt="Playlist Image"
                                className="rounded"
                                style={{boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                                width={232}
                                height={232}
                            />
                        ) : (
                            <div
                                className="text-white/40 bg-zinc-900 rounded shadow flex items-center justify-center"
                                style={{width: 232, height: 232, boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                            >
                                <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                                    <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                                </svg>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <p>
                                {item.public ? "Public" : "Private"} {item.type}
                            </p>
                            <h1 className={`text-white font-extrabold ${getLength()}`}>{item.name}</h1>
                            <p className="opacity-50">{item.description}</p>
                            <div className="flex items-center gap-1">
                                <p className="text-white font-bold">{contextUser.display_name}</p>
                                <span className="text-white opacity-50"> • </span>
                                <p className="text-white opacity-50">{item.followers.total.toLocaleString()} saves</p>
                                <span className="text-white opacity-50"> • </span>
                                <p className="text-white opacity-50">{item.tracks.total} songs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `linear-gradient(to top, transparent 50%, #09090b20 80%)`,
                    }}
                >
                    <div className="flex flex-1 items-center gap-4 border-b-[1px] border-zinc-300/30 p-2 px-4">
                        <p className="flex px-6 opacity-50">#</p>
                        <p className="flex-4 text-sm opacity-50">Title</p>
                        <p className="flex-2 text-sm opacity-50">Album</p>
                        <p className="flex-2 text-sm opacity-50">Date added</p>
                        <p className="flex-1 text-sm opacity-50">
                            <svg viewBox="0 0 16 16" height="16" fill="currentColor">
                                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                                <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25"></path>
                            </svg>
                        </p>
                    </div>
                    <div className="flex h-50 flex-col gap-2 py-2">
                        {item.tracks.items.map(({track}, index) => (
                            <div className="flex items-center py-2 " key={track.id}>
                                <div className="flex px-4 opacity-50 text-center w-12">{index + 1}</div>
                                <div className="flex-4 flex items-center gap-2">
                                    <Image
                                        src={track.album.images[0].url}
                                        alt="Playlist Image"
                                        className="rounded"
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-sm">{track.name}</p>
                                        <p className="text-sm opacity-50">{track.artists.map(({name}) => name)}</p>
                                    </div>
                                </div>
                                <p className=" flex-2 text-sm opacity-50">Album</p>
                                <p className=" flex-2 text-sm opacity-50">Date added</p>
                                <p className=" flex-1 text-sm opacity-50">a</p>
                            </div>
                        ))}
                        <div className="px-6 pt-12">
                            <h1>Recomendations</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
