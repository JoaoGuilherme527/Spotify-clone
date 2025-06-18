"use client"

import {useEffect} from "react"
import ReactJson from "react-json-view"

export default function SearchPage({params}: {params: any}) {
    useEffect(() => {
        return () => {}
    }, [])

    return (
        <div className="overflow-y-auto h-full flex-col text-white rounded-lg relative outline-0">
            <pre className="absolute inset-0 z-10 flex-col">
                <ReactJson
                    src={params}
                    name={false}
                    theme="ocean"
                    collapsed={2} // colapsa a partir do nível 1
                    displayDataTypes={false}
                    enableClipboard={false}
                    collapseStringsAfterLength={100}
                    iconStyle="square"
                />
            </pre>
        </div>
    )
}
