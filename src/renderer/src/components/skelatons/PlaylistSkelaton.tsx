const PlaylistSkelaton = (): JSX.Element => {
  return (
    <div className='flex flex-col justify-center items-center h-full text-[#333333] drop-shadow-lg'>
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
        <path fill="currentColor" d="M4.083 10.894c.439-2.34.658-3.511 1.491-4.203C6.408 6 7.598 6 9.98 6h4.04c2.383 0 3.573 0 4.407.691c.833.692 1.052 1.862 1.491 4.203l.75 4c.617 3.292.926 4.938.026 6.022C19.794 22 18.12 22 14.771 22H9.23c-3.349 0-5.024 0-5.923-1.084c-.9-1.084-.591-2.73.026-6.022z" opacity=".5" />
        <path fill="currentColor" d="M9.75 5a2.25 2.25 0 0 1 4.5 0v1c.566 0 1.062.002 1.5.015V5a3.75 3.75 0 1 0-7.5 0v1.015C8.688 6.002 9.184 6 9.75 6z" />
        <path fill="currentColor" fillRule="evenodd" d="M13.75 10a.75.75 0 0 0-1.5 0v3.55a2.75 2.75 0 1 0 1.5 2.45v-3.55c.375.192.8.3 1.25.3a.75.75 0 0 0 0-1.5c-.69 0-1.25-.56-1.25-1.25M11 14.75a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export default PlaylistSkelaton
