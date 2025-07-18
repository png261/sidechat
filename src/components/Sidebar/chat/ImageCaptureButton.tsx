"use client"

import { RiScreenshot2Line } from 'react-icons/ri'

interface ImageCaptureButtonProps {
  addMessageDraftFile: (blob: Blob) => void
}

const ImageCaptureButton = ({
  addMessageDraftFile,
}: ImageCaptureButtonProps) => {
  const handleScreenshotClick = async () => {
    const imageBlob: Blob = await new Promise((resolve) => {
      window.parent.postMessage({ action: 'get-screenshot-image' }, '*')
      window.addEventListener('message', (event) => {
        const { action, payload } = event.data
        if (action === 'get-screenshot-image') {
          resolve(payload)
        }
      })
    })

    addMessageDraftFile(imageBlob as Blob)
  }
  return (
    <button
      onClick={handleScreenshotClick}
      type="button"
      className="bg-neutral-300 text-neutral-500 dark:text-neutral-200 dark:bg-neutral-800 p-1.5 rounded"
    >
      <RiScreenshot2Line size={18} />
    </button>
  )
}

export default ImageCaptureButton
