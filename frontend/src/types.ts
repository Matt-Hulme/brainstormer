// Domain types for the application
export interface Project {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
  collections: Collection[]
  savedWords: SavedWord[]
}

export interface Collection {
  id: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
  savedWords: SavedWord[]
}

export interface SavedWord {
  id: string
  word: string
  collectionId: string
  createdAt: string
}

export interface Keyword {
  id: string
  word: string
}
