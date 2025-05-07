import { useSearchParams } from 'react-router-dom'

export const ProjectSearchContent = () => {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')

  return (
    <div className="flex flex-row pt-[25px]">
      <span>Words</span>
      <aside className="px-[30px] py-[10px]">
        <span>{search}</span>
      </aside>
    </div>
  )
}
