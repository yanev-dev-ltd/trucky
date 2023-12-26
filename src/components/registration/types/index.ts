export type FirebaseError = {
    code: any
} & Error

export type RegistrationProps = {
    emailRef: React.MutableRefObject<HTMLInputElement | null>
    passwordRef: React.MutableRefObject<HTMLInputElement | null>
    password2Ref: React.MutableRefObject<HTMLInputElement | null>
    error: string | null
    loading: boolean
    onSubmit: (e: React.SyntheticEvent) => void
    locale?: string
}

export type useRegistrationProps = {
    locale: string
}