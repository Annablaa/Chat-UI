/**
 * Google AI Embedding Helper
 * Converts text to 768-dimensional vectors using Google's free embedding model
 */

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || ''
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent'

/**
 * Generate embedding for a text string using Google AI
 * Returns a 768-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY environment variable is not set')
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  try {
    const response = await fetch(
      `${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-004',
          content: {
            parts: [
              {
                text: text.trim(),
              },
            ],
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Google AI API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const data = await response.json()
    
    if (!data.embedding || !Array.isArray(data.embedding.values)) {
      throw new Error('Invalid response format from Google AI API')
    }

    return data.embedding.values
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate embedding: ${error.message}`)
    }
    throw new Error('Failed to generate embedding: Unknown error')
  }
}

/**
 * Batch generate embeddings for multiple texts
 * Useful for backfilling existing messages
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize: number = 10
): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchPromises = batch.map((text) => generateEmbedding(text))
    const batchResults = await Promise.all(batchPromises)
    embeddings.push(...batchResults)
    
    // Add a small delay to avoid rate limiting
    if (i + batchSize < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  
  return embeddings
}

