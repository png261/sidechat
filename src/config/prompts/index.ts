import endent from 'endent'

export const getTransformedPrompt = (prompt: string, selectedText: string) => {
    return endent`
    #### Instructions:
    ${prompt}
    #### Original Text:
    ${selectedText}
  `
}
