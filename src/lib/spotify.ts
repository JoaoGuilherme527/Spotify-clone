import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { RefreshToken } from "./actions";

export function createSpotifyClient(token: string) {
    const instance = axios.create({
        baseURL: "https://api.spotify.com/v1",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return instance;
}
