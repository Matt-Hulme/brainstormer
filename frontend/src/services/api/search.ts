import api from '@/config/api/client'
import type { SearchRequest, KeywordSuggestion } from '@/config/api/types'

const BASE_PATH = '/search/'

export const searchApi = {
  // Search for keyword suggestions
  search: async (data: SearchRequest) => {
    const response = await api.post<{ search_id?: string, suggestions: KeywordSuggestion[] }>(BASE_PATH, {
      query: data.query,
      project_name: data.projectName,
      search_mode: data.searchMode || 'or',
    })

    return {
      searchId: response.data.search_id,
      suggestions: response.data.suggestions
    }
  },
}
