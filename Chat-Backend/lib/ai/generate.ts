/**
 * Google AI Text Generation Helper
 * Uses Gemini to analyze and enhance search results
 */

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || ''
// Using gemini-1.5-flash for faster, free responses, fallback to gemini-pro
const GOOGLE_AI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface SearchResult {
  id: string
  conversation_id: string
  author_id: string
  content: string
  created_at?: string | null
  similarity: number
}

/**
 * Enhance search results using Google AI
 * Analyzes the search query and results to find semantically related messages
 */
export async function enhanceSearchResults(
  query: string,
  results: SearchResult[]
): Promise<{
  enhancedResults: SearchResult[]
  summary?: string
}> {
  if (!GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_AI_API_KEY not set, skipping AI enhancement')
    return { enhancedResults: results }
  }

  if (!results || results.length === 0) {
    return { enhancedResults: results }
  }

  try {
    // Format the results for the prompt
    const resultsText = results
      .map((r, idx) => {
        return `${idx + 1}. [Similarity: ${(r.similarity * 100).toFixed(1)}%] ${r.content.substring(0, 200)}${r.content.length > 200 ? '...' : ''}`
      })
      .join('\n')

    const prompt = `Search keywords: "${query}"

I found these semantically related messages from a chat application:

${resultsText}

Please analyze these messages and:
1. Identify which messages are most semantically related to the search query "${query}"
2. Rank them by relevance (not just similarity score)
3. Provide a brief summary of what these messages are about

Return your response as JSON in this exact format:
{
  "summary": "Brief summary of what these messages discuss",
  "rankedResults": [
    {
      "index": 1,
      "reason": "Why this message is relevant",
      "relevanceScore": 0.95
    }
  ]
}

Only include messages that are actually relevant to the search query. Exclude messages that are not semantically related.`

    const response = await fetch(
      `${GOOGLE_AI_GENERATE_URL}?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Google AI enhancement failed:', errorText)
      return { enhancedResults: results }
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.warn('Invalid response format from Google AI')
      return { enhancedResults: results }
    }

    const aiResponse = data.candidates[0].content.parts[0].text
    
    // Try to extract JSON from the response
    let aiAnalysis: any = null
    try {
      // Look for JSON in the response (might be wrapped in markdown code blocks)
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0]
        aiAnalysis = JSON.parse(jsonText)
      }
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON:', parseError)
      // If parsing fails, try to extract summary from text
      const summaryMatch = aiResponse.match(/summary["\s:]+"([^"]+)"/i) || 
                          aiResponse.match(/summary:?\s*([^\n]+)/i)
      if (summaryMatch) {
        aiAnalysis = { summary: summaryMatch[1].trim() }
      }
    }

    // Re-rank results based on AI analysis if available
    let enhancedResults = results
    if (aiAnalysis && aiAnalysis.rankedResults && Array.isArray(aiAnalysis.rankedResults)) {
      // Create a map of index to relevance score
      const relevanceMap = new Map<number, number>()
      aiAnalysis.rankedResults.forEach((item: any) => {
        if (item.index && item.relevanceScore) {
          // Index is 1-based, convert to 0-based
          relevanceMap.set(item.index - 1, item.relevanceScore)
        }
      })

      // Re-rank results based on AI relevance scores
      enhancedResults = results
        .map((result, idx) => ({
          ...result,
          aiRelevance: relevanceMap.get(idx) || result.similarity,
        }))
        .sort((a, b) => (b.aiRelevance || b.similarity) - (a.aiRelevance || a.similarity))
        .map(({ aiRelevance, ...result }) => result) // Remove aiRelevance from final result
    }

    return {
      enhancedResults,
      summary: aiAnalysis?.summary,
    }
  } catch (error) {
    console.warn('Error enhancing search results with AI:', error instanceof Error ? error.message : 'Unknown error')
    return { enhancedResults: results }
  }
}

