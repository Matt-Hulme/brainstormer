// API-specific types for request/response handling
export interface ApiError {
  details?: unknown
  message: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}

// API request/response types
export interface CreateProjectRequest {
  name: string
}

export interface CreateCollectionRequest {
  name: string
  projectId: string
}

export interface SaveWordRequest {
  collectionId: string
  projectId: string
  word: string
}

export interface SearchRequest {
  projectName: string
  query: string
  searchMode?: 'and' | 'both' | 'or'
}

export interface KeywordSuggestion {
  matchType?: 'and' | 'or'
  word: string
}

export interface SearchResponse {
  searchId?: string
  suggestions: KeywordSuggestion[]
}

export interface BulkUpdateCollectionsRequest {
  collectionIds: string[]
  name: string
}

export interface BulkMoveCollectionsRequest {
  collectionIds: string[]
  targetProjectId: string
}

export interface BulkMoveWordsRequest {
  targetCollectionId: string
  wordIds: string[]
}
