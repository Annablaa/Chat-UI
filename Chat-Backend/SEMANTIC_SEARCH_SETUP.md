# Semantic Search Setup Guide

This guide explains how to set up the semantic search feature using Google AI embeddings.

## Prerequisites

1. **Google AI API Key**: You need a free API key from Google AI Studio
2. **Supabase Database**: Your messages table must have an `embedding` column of type `vector(768)`

## Step 1: Get Google AI API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key

## Step 2: Add Environment Variable

Add the following to your `.env.local` file in the `Chat-Backend` directory:

```env
GOOGLE_AI_API_KEY=your_api_key_here
```

## Step 3: Database Setup

Make sure your `messages` table has an `embedding` column:

```sql
ALTER TABLE messages
ADD COLUMN embedding vector(768);
```

If you're using Supabase, you also need to enable the `pgvector` extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 4: Backfill Existing Messages

If you have existing messages without embeddings, run the backfill endpoint:

```bash
# Get statistics
curl -X GET http://localhost:3000/api/messages/backfill

# Backfill messages (processes 10 at a time by default)
curl -X POST http://localhost:3000/api/messages/backfill \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 10, "limit": 100}'
```

Or use the frontend API:

```typescript
// Get stats
const stats = await api.getBackfillStats();

// Backfill
const result = await api.backfillMessages({ batchSize: 10, limit: 100 });
```

## How It Works

1. **Message Creation**: When a new message is created via `POST /api/messages`, the system automatically:
   - Generates a 768-dimensional embedding using Google AI
   - Stores the embedding in the `embedding` column
   - If embedding generation fails, the message is still created (without embedding)

2. **Semantic Search**: When users search via `POST /api/search`:
   - The search query is converted to an embedding
   - The system finds messages with similar embeddings using cosine similarity
   - Results are ranked by similarity score (0-1, where 1 is most similar)

3. **Frontend**: The SearchDialog component:
   - Shows an "AI Search" button
   - Calls the semantic search API
   - Displays results with similarity percentages
   - Allows users to click results to navigate to messages

## API Endpoints

### POST /api/search
Semantic search endpoint.

**Request:**
```json
{
  "query": "What was decided about payment limits?",
  "limit": 10,
  "threshold": 0.5
}
```

**Response:**
```json
{
  "query": "What was decided about payment limits?",
  "results": [
    {
      "id": "message-id",
      "conversation_id": "conv-id",
      "author_id": "user-id",
      "content": "Message content...",
      "created_at": "2024-01-01T00:00:00Z",
      "similarity": 0.85
    }
  ],
  "count": 1
}
```

### POST /api/messages/backfill
Add embeddings to existing messages.

**Request:**
```json
{
  "batchSize": 10,
  "limit": 100
}
```

**Response:**
```json
{
  "message": "Backfill completed",
  "processed": 95,
  "errors": 5,
  "total": 100
}
```

### GET /api/messages/backfill
Get statistics about messages needing backfill.

**Response:**
```json
{
  "withoutEmbeddings": 50,
  "total": 200,
  "withEmbeddings": 150
}
```

## Troubleshooting

### Embedding Generation Fails

- Check that `GOOGLE_AI_API_KEY` is set correctly
- Verify the API key is valid and has not expired
- Check the backend logs for specific error messages
- Messages will still be created even if embedding fails

### Search Returns No Results

- Make sure messages have embeddings (run backfill if needed)
- Try lowering the `threshold` parameter (default is 0.5)
- Check that the `embedding` column exists and has the correct type

### Database Errors

- Ensure `pgvector` extension is enabled in Supabase
- Verify the `embedding` column type is `vector(768)`
- Check that you're using the correct Supabase credentials

## Notes

- The embedding model used is `text-embedding-004` (768 dimensions)
- Embeddings are generated automatically for new messages
- Similarity scores range from 0 to 1 (cosine similarity)
- The system gracefully handles embedding failures (messages are still created)

