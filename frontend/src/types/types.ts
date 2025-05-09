// Domain types for the application
export interface Project {
  id: string
  title: string
  lastEdited: string
  userId: string
  collections: Collection[]
  savedWords: SavedWord[]
}

export interface Collection {
  id: string
  name: string
  projectId: string
  savedWords: SavedWord[]
}

export interface SavedWord {
  id: string
  word: string
  collectionId: string
  projectId: string
}

export interface Keyword {
  id: string
  word: string
}
