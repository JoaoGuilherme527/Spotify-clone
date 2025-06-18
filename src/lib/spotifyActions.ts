import axios from "axios";
import { Album, Artist, Paging, PlaylistById, PrivateUser, PublicUser, SavedAlbum, SavedTrack, SimplifiedAlbum, SimplifiedPlaylist, SimplifiedTrack } from "@/typings";

const spotify = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function GetSaveTracksForUser(token: string): Promise<Paging<SavedTrack>> {
    try {
        const { data } = await spotify.get("/me/tracks", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetPlaylist(token: string, id: string): Promise<PlaylistById> {
    try {
        const { data } = await spotify.get(`/playlists/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetAlbum(token: string, id: string): Promise<Album> {
    try {
        const { data } = await spotify.get(`/albums/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function SaveTrackForUser(ids: Array<string>, token: string) {
    try {
        await spotify.put("/me/tracks", { ids }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function DeleteTrackForUser(ids: Array<string>, token: string) {
    try {
        await spotify.delete("/me/tracks", {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetUserSavedAlbum(token: string): Promise<Paging<SavedAlbum>> {
    try {
        const { data } = await spotify.get("/me/albums", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetUserSavedPlaylist({ token }: { token: string }): Promise<Paging<SimplifiedPlaylist>> {
    try {
        const { data } = await spotify.get("/me/playlists", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetCurrentUser(token: string): Promise<PrivateUser> {
    try {
        const { data } = await spotify.get("/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function GetUser(token: string, id: string): Promise<PublicUser> {
    try {
        const { data } = await spotify.get(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function GetArtist(token: string, id: string): Promise<Artist> {
    try {
        const { data } = await spotify.get(`/artists/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function Search(token: string, query: string): Promise<Artist> {
    try {
        const { data } = await spotify.get(`/search?q=${query.trim().replaceAll(/\s/g, "+")}&type=album%2Cartist%2Cplaylist%2Ctrack`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function PlayContext({ token, context_uri, uris, position }: { token: string, context_uri?: string, uris?: string[], position?: number }) {
    try {
        const body = context_uri ? {
            context_uri,
            offset: {
                position: position || 0
            }
        } : { uris }

        await spotify.put("/me/player/play", body, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function PauseContext(token: string, device_id?: string) {
    try {
        await spotify.put(`/me/player/pause`, {}, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAverageColor(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject("Canvas context not available");
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0;
            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
            }
            const pixelCount = imageData.length / 4;
            resolve(`rgb(${Math.round(r / pixelCount)},${Math.round(g / pixelCount)},${Math.round(b / pixelCount)})`);
        };
        img.onerror = (error) => reject(`Error loading image: ${error}`);
        img.src = imageUrl;
    });
}


export function handlePlayPause({ player, state, token, uri, index }: { state: "play" | "pause" | "resume", player: Spotify.Player | undefined, token: string, uri: string, index?: number }) {
    switch (state) {
        case "play":
            PlayContext({ token, context_uri: uri, position: index })
            break
        case "pause":
            PauseContext(token)
            break
        case "resume":
            player?.togglePlay()
            break
        default:
            break
    }
}

export function formatRelativeDate(isoDate: string): string {
    const now = new Date()
    const date = new Date(isoDate)
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
    const minutes = Math.floor(diffSec / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)

    if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}



export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export const truncate = (text: string, max = 25) => (text.length > max ? `${text.slice(0, max)}...` : text)