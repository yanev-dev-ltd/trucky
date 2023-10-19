export type UploadProps = {
    filepath: string | undefined
    dbpath: string
    dbkey: string
    currentFiles: UploadedFile[]
}

export type Files = {
    file: File
}[]

export type UploadedFile = {
    path: string
    name: string
    url: string
    date: number
}