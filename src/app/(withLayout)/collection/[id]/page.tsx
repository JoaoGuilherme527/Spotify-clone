interface Props {
    params: Promise<{id: string}>
}

export default async function CollectionPage({params}: Props) {
    const {id} = await params

    return (
        <div className="p-4">
        </div>
    )
}
