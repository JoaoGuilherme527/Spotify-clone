import axios from "axios";
import { Paging, PlaylistRes, PrivateUser, PublicUser, SavedAlbum, SavedTrack, SimplifiedAlbum, SimplifiedPlaylist, SimplifiedTrack } from "@/typings";

const spotify = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function GetSaveTracksForUser(token: string): Promise<Paging<SimplifiedTrack>> {
    try {
        const { data } = await spotify.get("/me/tracks", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/me/tracks", data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function GetPlaylist(token: string, id: string): Promise<PlaylistRes> {
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

export async function GetAlbum(token: string, id: string): Promise<SavedAlbum> {
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

export async function GetUserSavedAlbum(token: string): Promise<Paging<SimplifiedAlbum>> {
    try {
        const { data } = await spotify.get("/me/albums", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/me/albums", data);
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
        console.log("/me/playlists", data);
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
        console.log(id);
        const { data } = await spotify.get(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function PlayContext(token: string, uri: string | string[]) {
    try {
        const body = typeof uri === "string" ? {
            context_uri: uri,
            offset: { position: 0 },
            position_ms: 0
        } : { uris: uri };

        await spotify.put("/me/player/play", body, {
            headers: { Authorization: `Bearer ${token}` }
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
