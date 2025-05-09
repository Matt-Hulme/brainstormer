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
  title: string
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
  query: string
  projectId: string
  searchId?: string
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
