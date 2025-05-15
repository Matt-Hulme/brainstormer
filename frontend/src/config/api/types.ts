// API-specific types for request/response handling
export interface ApiError {
  message: string
  status: number
  details?: unknown
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
  word: string
  collectionId: string
  projectId: string
}

export interface SearchRequest {
  projectId: string
  query: string
}

export interface KeywordSuggestion {
  word: string
  score: number
}

export interface SearchResponse {
  suggestions: KeywordSuggestion[]
  searchId: string
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
  wordIds: string[]
  targetCollectionId: string
}
