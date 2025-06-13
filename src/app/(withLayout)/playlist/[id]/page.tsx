interface Props {
    params: Promise<{id: string}>
}

export default async function PlaylistPage({params}: Props) {
    const {id} = await params

    // Chame aqui sua função que usa o id
    // como GetAlbumById(id) ou similar
    // const album = await GetAlbumById(id)

    return (
        <div className="p-4">
            <h1 className="text-red-500">Detalhes da Playlist: {id}</h1>
            {/* Renderize seu componente com props */}
            {/* <div/> */}
        </div>
    )
}
