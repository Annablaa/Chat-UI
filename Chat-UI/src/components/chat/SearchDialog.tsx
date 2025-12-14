import { useState, useEffect } from "react";
import { Search, Calendar, User, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "./ChatMessage";
import { api } from "@/lib/api";

interface SearchReference {
  conversationId: string;
  messageId: string;
  date: string;
  participant: string;
  snippet: string;
  conversationName?: string;
  similarity?: number;
}

interface Conversation {
  id: string;
  name: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
  allMessages?: Message[];
  conversations?: Conversation[];
  onResultClick?: (messageId: string, conversationId: string) => void;
}

/**
 * Dialog for semantic search across chat history.
 * Shows search input and displays results with references.
 * Searches across all conversations and allows navigation to specific messages.
 */
export function SearchDialog({ open, onOpenChange, onSearch, allMessages = [], conversations = [], onResultClick }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    summary: string;
    references: SearchReference[];
  } | null>(null);
  const [userCache, setUserCache] = useState<Record<string, string>>({});

  // Fetch user display names
  const fetchUserDisplayName = async (authorId: string): Promise<string> => {
    if (userCache[authorId]) {
      return userCache[authorId];
    }

    try {
      const response = await api.getUsers({ id: authorId });
      if (response.data && response.data.length > 0) {
        const displayName = response.data[0].display_name || response.data[0].username;
        setUserCache((prev) => ({ ...prev, [authorId]: displayName }));
        return displayName;
      }
    } catch (err) {
      console.warn('Failed to fetch user:', err);
    }
    return `User ${authorId.substring(0, 8)}`;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setResults(null);
    
    try {
      // Call semantic search API
      const searchResults = await api.searchMessages({
        query: query.trim(),
        limit: 10,
        threshold: 0.4, // Default threshold for semantic search
      });

      if (!searchResults.results || searchResults.results.length === 0) {
        setResults({
          summary: searchResults.summary || `No semantically similar messages found for "${query}". Try rephrasing your search or using different keywords.`,
          references: [],
        });
        setIsSearching(false);
        return;
      }

      // Fetch user display names for all results
      const authorIds = [...new Set(searchResults.results.map(r => r.author_id))];
      const userPromises = authorIds.map(id => fetchUserDisplayName(id));
      await Promise.all(userPromises);

      // Format results with user names and dates
      const references: SearchReference[] = await Promise.all(
        searchResults.results.map(async (result) => {
          const displayName = await fetchUserDisplayName(result.author_id);
          const date = result.created_at 
            ? new Date(result.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            : 'Unknown date';
          
          const conversation = conversations.find(c => c.id === result.conversation_id);
          
          return {
            conversationId: result.conversation_id,
            messageId: result.id,
            date,
            participant: displayName,
            snippet: result.content.substring(0, 150) + (result.content.length > 150 ? "..." : ""),
            conversationName: conversation?.name || `Conversation ${result.conversation_id.substring(0, 8)}`,
            similarity: result.similarity,
          };
        })
      );

      // Use AI-generated summary if available, otherwise use default
      const summary = searchResults.summary || `Found ${searchResults.count} semantically relevant message${searchResults.count > 1 ? 's' : ''} for "${query}". Results are ranked by relevance.`;

      setResults({
        summary,
        references,
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform semantic search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSendToChat = () => {
    onSearch(query);
    onOpenChange(false);
    setQuery("");
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Semantic Search
          </DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="flex gap-2">
          <Input
            placeholder="Search by meaning... (e.g., 'What was decided about payment limits?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={!query.trim() || isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                AI Search
              </>
            )}
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Results area */}
        <div className="flex-1 overflow-y-auto mt-4">
          {isSearching && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Searching conversations...
            </div>
          )}

          {results && !isSearching && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                <p className="text-foreground">{results.summary}</p>
              </div>

              {/* References */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Referenced Conversations
                </p>
                <div className="space-y-2">
                  {results.references.map((ref, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (onResultClick && ref.messageId && ref.conversationId) {
                          onResultClick(ref.messageId, ref.conversationId);
                          onOpenChange(false);
                        }
                      }}
                      className="w-full text-left rounded-lg border border-border bg-card p-3 hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      {ref.conversationName && (
                        <div className="text-xs font-medium text-primary mb-1">
                          {ref.conversationName}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ref.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ref.participant}
                        </span>
                        {ref.similarity !== undefined && (
                          <span className="ml-auto text-primary font-medium">
                            {Math.round(ref.similarity * 100)}% match
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 italic">"{ref.snippet}"</p>
                      <p className="text-xs text-primary mt-2">Click to view in chat →</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <Button onClick={handleSendToChat} className="w-full">
                Ask AI-Agent about this in chat
              </Button>
            </div>
          )}

          {!results && !isSearching && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Search for topics, decisions, or discussions</p>
              <p className="text-sm mt-1">AI understands meaning, not just keywords</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
