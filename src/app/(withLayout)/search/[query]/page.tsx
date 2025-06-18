import { PlaylistPage } from "@/app/components/PlaylistPage"
import {GetAccessToken} from "@/lib/actions"
import {GetPlaylist, GetUser, Search} from "@/lib/spotifyActions"
import SearchPage from "../page"

interface Props {
    params: Promise<{query: string}>
}

export default async function Page({params}: Props) {
    const {query} = await params
    const token = await GetAccessToken()
    const search = await Search(token, query)

    return <SearchPage params={search} />
}
