"use client"

import { BsRobot } from 'react-icons/bs'
import { useChatModels } from '@/hooks/useChatModels'

const ChangeChatModel = () => {
    const { models, activeChatModel, setActiveChatModel } = useChatModels()
    return (
        <div className="flex items-center gap-1 text-neutral-500 dark:bg-neutral-900 bg-neutral-200 border rounded-md border-neutral-400/30 dark:border-neutral-500/30 py-1 px-3">
            <BsRobot size={18} className="flex-shrink-0" />
            <select
                value={activeChatModel || ''}
                className="bg-transparent !m-0 !p-0 box-border w-min focus:outline-none focus:ring-1 max-w-[100px]"
                onChange={(e) => {
                    setActiveChatModel(e.target.value)
                }}
            >
                {models.map((model) => (
                    <option key={model.id} value={model.id}>
                        {model.id}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ChangeChatModel
