// Domain types for the application
export interface Project {
  id: string
  title: string
  user_id: string
  created_at: string
  updated_at: string
  collections: Collection[]
  savedWords: SavedWord[]
}

export interface Collection {
  id: string
  name: string
  project_id: string
  created_at: string
  updated_at: string
  savedWords: SavedWord[]
}

export interface SavedWord {
  id: string
  word: string
  collection_id: string
  created_at: string
}

export interface Keyword {
  id: string
  word: string
}
