export type User = {
    id: string
    email: string
}

export type FirebaseError = {
    code: any
} & Error