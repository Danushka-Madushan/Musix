import { getPlayList } from '@renderer/constants/request'
import { Dispatch, SetStateAction, useState } from 'react'

interface InsertBarProps {
  setPlaylist: Dispatch<SetStateAction<false | Awaited<ReturnType<typeof getPlayList>>>>
}

const InsertBar = ({ setPlaylist }: InsertBarProps): JSX.Element => {
  const [id, setID] = useState('')

  return (
    <div className='flex justify-center '>
      <input
        onChange={({ target: { value }}) => {
          const result = /(?:list=)(?<list>[a-zA-Z0-9_-]+)/.exec(value)
          if (result) {
            const fetch = async () => {
              if (result.groups) {
                setID(result.groups.list)
                setPlaylist(await getPlayList(result.groups.list))
              }
            }
            fetch()
          }
        }}
        value={id}
        type="text"
        name="pinsertbar"
        placeholder='YouTube Playlist'
        id="playlist"
        className='text-center p-2 border-none rounded-md bg-[#3f3f3f] outline-none w-[100%] max-w-lg text-white'
      />
    </div>
  )
}

export default InsertBar
