export interface Profile {
    id: string
    phone: string | null
    store_name: string | null
    created_at: string
    updated_at: string
}

export interface ProfileFormData {
    phone: string
    store_name: string
}
