"use client"

import {GeistProvider, Loading} from "@geist-ui/core"

export default function LoadingComponent() {
    return (
        <GeistProvider>
            <div className="overflow-hidden h-full flex-col text-white rounded-lg relative outline-0">
                {/* <p className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">LOADING</p> */}
                <Loading color="green" scale={10} />
            </div>
        </GeistProvider>
    )
}
