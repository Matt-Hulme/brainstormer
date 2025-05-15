import api from '@/config/api/client'
import type { SearchRequest } from '@/config/api/types'

const BASE_PATH = '/search/'

export interface KeywordSuggestion {
  word: string
  score: number
}

export interface SearchResponse {
  search_id: string
  suggestions: KeywordSuggestion[]
}

export const searchApi = {
  // Search for keyword suggestions
  search: async (data: SearchRequest) => {
    const response = await api.post<SearchResponse>(BASE_PATH, {
      query: data.query,
      project_id: data.projectId,
    })
    return response.data
  },
}
