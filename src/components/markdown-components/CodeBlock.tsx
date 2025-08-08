"use client"

import type { CodeProps } from 'react-markdown/lib/ast-to-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  atomDark,
  tomorrow,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

const isDarkMode = () => {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
}

const CodeBlock = (props: CodeProps) => {
  const { children, className, inline } = props
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'javascript'
  const modClass = `${className} text-sm`
  return !inline ? (
    <SyntaxHighlighter
      className={modClass}
      language={language}
      PreTag="div"
      style={isDarkMode() ? atomDark : tomorrow}
    >
      {String(children)}
    </SyntaxHighlighter>
  ) : (
    <code
      className={`${modClass} bg-gray-200 dark:bg-gray-700 outline-gray-200 dark:outline-gray-700 rounded outline break-words`}
    >
      {children}
    </code>
  )
}

export default CodeBlock
