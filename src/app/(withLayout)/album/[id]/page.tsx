import {GetAccessToken} from "@/lib/actions"
import {GetAlbum} from "@/lib/spotifyActions"

interface Props {
    params: Promise<{id: string}>
}

export default async function AlbumPage({params}: Props) {
    const {id} = await params
    const token = await GetAccessToken()
    const context = await GetAlbum(token, id)

    // Chame aqui sua função que usa o id
    // como GetAlbumById(id) ou similar
    // const album = await GetAlbumById(id)

    return <div className="p-4">{context.name}</div>
}
