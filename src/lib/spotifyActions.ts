import { PrivateUser, ResponsePromise, SavedTrack, SimplifiedAlbum, SimplifiedPlaylist } from "@/typings"

export async function GetSaveTracksForUser(token: string): Promise<ResponsePromise> {
    const response = await fetch("https://api.spotify.com/v1/me/tracks", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    return data
}

export async function SaveTrackForUser(ids: Array<string>, token: string) {
    await fetch("https://api.spotify.com/v1/me/tracks", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
    })
}

export async function DeleteTrackForUser(ids: Array<string>, token: string) {
    await fetch("https://api.spotify.com/v1/me/tracks", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
    })
}

export async function GetUserSavedAlbum(token: string): Promise<Array<SimplifiedAlbum>> {
    const response = await fetch("https://api.spotify.com/v1/me/albums", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    const albums: Array<SimplifiedAlbum> = []
    for (const { album } of data.items) {
        albums.push(album)
    }

    return albums
}

export async function GetUserSavedPlaylist({ token, user_id }: { token: string, user_id: string }): Promise<Array<SimplifiedPlaylist>> {
    const response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    return data.items
}

export async function GetCurrentUser(token: string): Promise<PrivateUser> {
    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}

export async function PlayContext(token: string, uri: string | string[]) {
    const body = typeof uri === "string" ? {
        context_uri: uri,
        offset: {
            position: 0
        },
        position_ms: 0
    } : {
        uris: uri,
    }

    await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
}