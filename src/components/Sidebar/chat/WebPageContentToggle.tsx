"use client"

import * as Switch from '@radix-ui/react-switch'

const WebPageContentToggle = () => {
    return (
        <div className="toggle-container">
            <label htmlFor="webpage-context" className="toggle-label">
                Nội dung trang web
            </label>
            <Switch.Root
                checked
                className="switch-root"
            >
                <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
        </div>
    )
}

export default WebPageContentToggle
