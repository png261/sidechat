"use client"

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { RiFileCopy2Line } from 'react-icons/ri'
import { usePrompts } from '@/hooks/usePrompts'
import { RecursiveItem } from '../../QuickMenu/RecursiveItem'

interface InsertPromptToDraftButtonProps {
    setMessageDraftText: (text: string) => void
}

const InsertPromptToDraftButton = ({
    setMessageDraftText,
}: InsertPromptToDraftButtonProps) => {
    const [prompts] = usePrompts()
    const noCategoryPrompts = prompts.filter((i) => !!i.prompt)

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="bg-neutral-300 text-neutral-500 dark:text-neutral-200 dark:bg-neutral-800 p-1.5 rounded"
                >
                    <RiFileCopy2Line size={18} />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    style={{ zIndex: 2147483647 }}
                    className="flex flex-col min-w-[150px] gap-2 backdrop-blur-sm !font-sans m-2 bg-neutral-50 shadow-md p-2 rounded dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                >
                    <DropdownMenu.Group>
                        {prompts
                            .filter((i) => !i.prompt)
                            .map((item) => (
                                <React.Fragment key={item.id}>
                                    <DropdownMenu.Label className="text-[10px] m-1 text-neutral-500 uppercase">
                                        {item.name}
                                    </DropdownMenu.Label>
                                    {item.children?.map((item) => (
                                        <RecursiveItem
                                            key={item.id}
                                            item={item}
                                            handleGenerate={setMessageDraftText}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}

                        {noCategoryPrompts.length > 0 && (
                            <DropdownMenu.Label className="text-[10px] m-1 text-neutral-500 uppercase">
                                Uncategorized
                            </DropdownMenu.Label>
                        )}
                        {noCategoryPrompts.map((item) => (
                            <RecursiveItem
                                item={item}
                                key={item.id}
                                handleGenerate={setMessageDraftText}
                            />
                        ))}
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

export default InsertPromptToDraftButton
