interface Props {
    params: {id: string}
}

export default async function CollectionPage({params}: Props) {
    const {id} = await params

    // Chame aqui sua função que usa o id
    // como GetAlbumById(id) ou similar
    // const album = await GetAlbumById(id)

    return (
        <div className="p-4">
            <h1 className="text-blue-500">Detalhes do Album: {id}</h1>
            {/* Renderize seu componente com props */}
            {/* <div/> */}
        </div>
    )
}
