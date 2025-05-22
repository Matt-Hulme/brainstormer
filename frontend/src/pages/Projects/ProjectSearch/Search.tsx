import { SearchBar } from '@/components/SearchBar'
import { ProjectSearchContent } from './ProjectSearchContent'
import { useParams, useSearchParams } from 'react-router-dom'
import { useGetProjectQuery, useSearchQuery } from '@/hooks'

export const Search = () => {
    const { projectName } = useParams<{ projectName: string }>()
    const [searchParams] = useSearchParams()
    const searchValue = searchParams.get('q') ?? ''
    const searchMode = searchParams.get('mode') as 'or' | 'and' | 'both' ?? 'both'

    const { project, isLoading: projectLoading } = useGetProjectQuery(projectName ?? '')
    const { data: searchData, isLoading: searchLoading } = useSearchQuery(projectName ?? '', searchValue, searchMode)

    const onSearch = (value: string) => {
        // Update URL with new search value
        const newParams = new URLSearchParams(searchParams)
        newParams.set('q', value)
        window.history.pushState({}, '', `?${newParams.toString()}`)
    }

    if (projectLoading || searchLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <SearchBar searchValue={searchValue} onChange={onSearch} />
            </div>
            <div className="flex-grow">
                <ProjectSearchContent
                    projectName={projectName ?? ''}
                    results={searchData?.suggestions ?? []}
                    project={project}
                />
            </div>
        </div>
    )
} 