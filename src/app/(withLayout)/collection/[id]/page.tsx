import { GetAccessToken } from "@/lib/actions"
import { GetSaveTracksForUser, GetUser } from "@/lib/spotifyActions"

interface Props {
    params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
    const {id} = await params
    const token = await GetAccessToken()
    const context = await GetSaveTracksForUser(token)
    console.log({context});
    
    return <></>
    // const contextUser = await GetUser(token, context.owner.id)

    // return <PlaylistPage item={context} contextUser={contextUser} token={token} />
}
