import emptyShapesImage from '../../../assets/home-empty-shapes.png'

export const ProjectsListContentEmpty = () => {
  return (
    <div className="flex flex-col justify-center pt-[90px] pb-[56px] gap-y-[50px]">
      <h1 className="color-secondary-4 text-h1">Looks like you don't have any projects (yet).</h1>
      <p className="pl-[124px] color-secondary-3 text-h4">
        Use the search bar above to start a new project.
      </p>
      <img
        src={emptyShapesImage}
        alt="Empty projects"
        className="absolute bottom-0 pl-[124px] max-h-[460px] w-auto object-contain opacity-75"
      />
    </div>
  )
}
