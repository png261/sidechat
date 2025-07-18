"use client"

import * as Switch from '@radix-ui/react-switch'

const WebPageContentToggle = () => {
    return (
        <div className="flex items-center justify-center gap-2 p-2 rounded">
            <label htmlFor="webpage-context" className="text-neutral-500">
                Nội dung trang web
            </label>
            <Switch.Root
                checked
                className="w-[28px] h-[16px] bg-neutral-500 rounded-full relative data-[state=checked]:bg-blue-500 outline-none cursor-default"
            >
                <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[14px]" />
            </Switch.Root>
        </div>
    )
}

export default WebPageContentToggle
