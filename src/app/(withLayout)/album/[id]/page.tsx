import {AlbumPage} from "@/app/components/AlbumPage"
import {GetAccessToken} from "@/lib/actions"
import {GetAlbum, GetArtist} from "@/lib/spotifyActions"

interface Props {
    params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
    const {id} = await params
    const token = await GetAccessToken()
    const context = await GetAlbum(token, id)
    const artist = await GetArtist(token, context.artists[0].id)

    return <AlbumPage item={context} token={token} artist={artist} />
}
