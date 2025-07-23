import { Embeddings } from '@langchain/core/embeddings'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { createSHA256Hash } from './createSHA256Hash'
import { readStorage, setStorage } from '../hooks/useStorage'

interface CustomAPIEmbeddingsParams {
    model: string
    apiKey: string
    apiUrl?: string
}

class CustomAPIEmbeddings extends Embeddings {
    private model: string
    private apiKey: string
    private apiUrl: string

    constructor({ model, apiKey, apiUrl }: CustomAPIEmbeddingsParams) {
        super()
        this.model = model
        this.apiKey = apiKey
        this.apiUrl = apiUrl || `${apiUrl}/${model}/api/embed`
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                input: texts,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Embedding API error ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        return data.data // expecting { data: number[][] }
    }

    async embedQuery(text: string): Promise<number[]> {
        const result = await this.embedDocuments([text])
        return result[0]
    }
}

export const getMatchedContent = async (
    query: string,
    context: string,
    apiKey: string,
    model: string = 'llama3.2'
) => {
    const vectorStore = await getContextVectorStore(context, apiKey, model)
    const retriever = vectorStore.asRetriever()
    const relevantDocs = await retriever.getRelevantDocuments(query)
    return relevantDocs.map((doc) => doc.pageContent).join('\n')
}

const getContextVectorStore = async (
    context: string,
    apiKey: string,
    model: string
) => {
    const embeddings = new CustomAPIEmbeddings({ model, apiKey })

    const hashKey = `SIDEBUDDY_STORE_EMBEDDINGS_${await createSHA256Hash(context)}`
    const memoryVectors = await readStorage<[]>(hashKey, 'indexedDB')

    if (!memoryVectors) {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        })
        const docs = await textSplitter.createDocuments([context])
        const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
        await setStorage(hashKey, store.memoryVectors, 'indexedDB')
        return store
    }

    const store = new MemoryVectorStore(embeddings)
    store.memoryVectors = memoryVectors
    return store
}

