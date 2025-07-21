'use client'

import { RiCloseLine } from 'react-icons/ri'
import type { MessageFile } from '@/hooks/useMessageDraft'

interface FilePreviewBarProps {
    files: MessageFile[]
    removeFile?: (id: string) => void
}

const FilePreviewBar = ({ files, removeFile }: FilePreviewBarProps) => {
    if (files.length === 0) return null

    return (
        <div className="flex gap-2 m-2">
            {files.map((file) => {
                const handlePreviewImageClick = async () => {
                    if (typeof window === 'undefined' || typeof document === 'undefined') return

                    const image = new Image()
                    image.src = file.src
                    image.style.maxWidth = '100vw'
                    image.style.maxHeight = '100vh'

                    try {
                        await new Promise<void>((resolve, reject) => {
                            image.onload = () => resolve()
                            image.onerror = () => reject(new Error('Image failed to load'))
                        })

                        const newTab = window.open()
                        if (!newTab || !newTab.document || !newTab.document.body) return

                        const body = newTab.document.body
                        body.innerHTML = ''
                        body.appendChild(image)
                        body.style.margin = '0'
                        body.style.display = 'grid'
                        body.style.placeItems = 'center'
                        body.style.height = '100vh'
                        body.style.width = '100vw'
                        body.style.backgroundColor = '#262626'
                    } catch (err) {
                        console.error('Failed to load image:', err)
                    }
                }

                return (
                    <div key={file.id} className="flex relative">
                        <button
                            type="button"
                            onClick={handlePreviewImageClick}
                            className="block flex-grow"
                        >
                            <img
                                src={file.src}
                                alt="preview"
                                className="w-14 h-14 object-contain rounded dark:bg-neutral-800 bg-neutral-400"
                            />
                        </button>
                        {removeFile && (
                            <button
                                onClick={() => removeFile(file.id)}
                                type="button"
                                className="absolute top-0.5 right-0.5 bg-black/30 rounded-full text-neutral-500 dark:text-neutral-200 ml-2"
                            >
                                <RiCloseLine size={16} />
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default FilePreviewBar

