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
  searchId?: string
}
