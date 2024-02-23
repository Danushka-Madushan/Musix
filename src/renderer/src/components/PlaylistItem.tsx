import { Dispatch, SetStateAction } from 'react'

interface PlayerlistItemProps {
  index: string,
  title: string,
  channel: string,
  time: string,
  thumbnail: string,
  vid: string,
  setSongContent: Dispatch<SetStateAction<false | { title: string, vid: string, index: number, channel: string, thumbnail: string }>>
}

const PlaylistItem = ({ index, title, vid, channel, time, thumbnail, setSongContent }: PlayerlistItemProps): JSX.Element => {

  return (
    <div
      onClick={() => setSongContent({ title, vid, index: parseInt(index), channel, thumbnail })}
      className='flex items-center justify-between mt-2 shadow-md border-none rounded-lg py-2 pl-2 pr-6 text-white bg-[#3f3f3f]'>
      <div className='flex items-center'>
        <span className='font-semibold w-8 text-center'>{index}</span>
        <div className='flex items-center'>
          <img className='w-12 h-12 mr-4 ml-2 object-cover border-none shadow-md rounded-md cursor-pointer' src={thumbnail} alt="conver-img" />
          <div className='flex flex-col'>
            <span className='font-semibold text-base w-[100%] truncate max-w-md'>{title}</span>
            <span className='text-sm'>{channel}</span>
          </div>
        </div>
      </div>
      <span className='text-base'>{time}</span>
    </div>
  )
}

export default PlaylistItem
