"use server"

import { cookies } from "next/headers";

export async function GetAccessToken(): Promise<string> {
    const cookieStore = await cookies()
    const hasCookie = cookieStore.has("access_token")
    if (!hasCookie) {
        throw Error.prototype.message = "Access_token cookie empty"
    } else return cookieStore.get("access_token")?.value as string
}