export interface StorageUploadResult {
    path: string
    publicUrl: string
}

export async function uploadFile(_bucket: string, _file: File): Promise<StorageUploadResult> {
    void _bucket
    void _file
    throw new Error('Storage client not configured yet.')
}
