
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
