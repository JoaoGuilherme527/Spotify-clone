import Dashboard from "@/app/components/Dashboard"
import {GetAccessToken} from "@/lib/actions"

export default async function Render() {
    const token = await GetAccessToken()
    console.log(token)
    return <Dashboard />
}
