import { useState } from 'react'
import InsertBar from './components/InsertBar'
import Player from './components/Player'
import PlaylistItem from './components/PlaylistItem'
import { getPlayList } from './constants/request'
import PlaylistSkelaton from './components/skelatons/PlaylistSkelaton'

const App = (): JSX.Element => {
  const [songContent, setSongContent] = useState<false | { title: string, vid: string, index: number, channel: string, thumbnail: string }>(false);
  const [Playlist, setPlaylist] = useState<false | Awaited<ReturnType<typeof getPlayList>>>(false);

  return (
    <div className='flex h-screen'>
      <div className='flex flex-col content-center ml-4 my-2 overflow-y-auto max-w-2xl w-[100%] left-pane'>
        <InsertBar setPlaylist={setPlaylist} />
        {Playlist ? Playlist.map(({ index, thumbnail, videoId, channelTitle, lengthText, title }) => {
            return <PlaylistItem
              index={index}
              key={videoId}
              vid={videoId}
              channel={channelTitle}
              thumbnail={thumbnail[thumbnail.length - 1].url}
              time={lengthText}
              title={title}
              setSongContent={setSongContent}
            />
          }) : <PlaylistSkelaton />}
      </div>
      <div className='my-2 flex justify-center items-center mx-auto'>
        <Player songContent={songContent} setSongContent={setSongContent} Playlist={Playlist} />
      </div>
    </div>
  );
}

export default App;
