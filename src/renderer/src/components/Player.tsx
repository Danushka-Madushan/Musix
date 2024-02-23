import { getPlayList, getStreams } from '@renderer/constants/request';
import { getClockString, getPercentage } from '@renderer/utils/formatter';
import { Dispatch, SetStateAction, useEffect, useRef, useState, Fragment } from 'react';
import PlayerSkelaton from './skelatons/PlayerSkelaton';

interface PlayerProps {
  songContent: false | { title: string, vid: string, index: number, channel: string, thumbnail: string },
  setSongContent: Dispatch<SetStateAction<false | { title: string, vid: string, index: number, channel: string, thumbnail: string }>>,
  Playlist: false | Awaited<ReturnType<typeof getPlayList>>
}

const Player = ({ songContent, setSongContent, Playlist }: PlayerProps): JSX.Element => {
  const ipcHandle = (content: object): void => window.electron.ipcRenderer.send('ping', content);
  const [content, setContent] = useState<false | Awaited<ReturnType<typeof getStreams>>>(false);
  const AuRef = useRef(new Audio());
  const VolRef = useRef<number>(0);

  /* Player Hooks */
  const [repeat, setRepeat] = useState(false)
  const [isMuted, setMuted] = useState(false)
  const [isPlaying, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [currentVolume, setCurrentVolume] = useState(0.1)
  const [currentDuration, setCurrentDuration] = useState('0:00')
  const [currentPercentage, setCurrentPercentage] = useState('0')

  const togglePlayback = () => {
    if (AuRef.current.paused) {
      setPlaying(true)
      return AuRef.current.play()
    }
    setPlaying(false)
    return AuRef.current.pause()
  }

  const setVolume = (value: number) => {
    const newVolume = value / 100
    AuRef.current.volume = newVolume;
    setCurrentVolume(newVolume);
  };

  const seekTrack = (percentage: string) => {
    AuRef.current.currentTime = (parseInt(percentage) / 100) * AuRef.current.duration
    setCurrentPercentage(percentage)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume((VolRef.current * 100))
      setMuted(false)
    } else {
      VolRef.current = AuRef.current.volume
      setVolume(0)
      setMuted(true)
    }
  }

  useEffect(() => {
    const fetchStreams = async () => {
      if (songContent !== false && typeof songContent === 'object') {
        ipcHandle(songContent);
        setContent(await getStreams(songContent.vid))
      }
    }
    fetchStreams()
  }, [songContent])

  useEffect(() => {
    if (content) {
      AuRef.current.load()
      AuRef.current.src = content.url
      AuRef.current.volume = currentVolume
      AuRef.current.play()
      setPlaying(true)
    }

    const onEnded = () => {
      if (songContent && Playlist) {
        if (!repeat && !Playlist[songContent.index]) {
          /* Playlist is Over */
          setSongContent(false)
          setRepeat(false)
          seekTrack("0")
          return
        }

        const { title, videoId, index, thumbnail, channelTitle } = Playlist[repeat ? songContent.index - 1 : songContent.index]
        /* 
        console.log('Track Ended', songContent.index)
        console.log('Next Track', title)
        */
        setTimeout(() => {
          setSongContent({
            title,
            vid: videoId,
            index: parseInt(index),
            thumbnail: thumbnail[thumbnail.length - 1].url,
            channel: channelTitle
          })
        }, 1000)
      }
    }

    const onTimeUpdate = () => {
      const { currentTime, duration } = AuRef.current;
      const cTime = getClockString(currentTime);
      const cDuration = getClockString(duration);
      const cPercentage = getPercentage(currentTime, duration);
      cTime && setCurrentTime(cTime);
      cDuration && setCurrentDuration(cDuration);
      cPercentage && setCurrentPercentage(cPercentage);
    }

    /* Event Listeners */
    AuRef.current.addEventListener('ended', onEnded)
    AuRef.current.addEventListener('timeupdate', onTimeUpdate)

    return () => {
      AuRef.current.pause()
      AuRef.current.remove()
      AuRef.current.removeEventListener('ended', onEnded);
      AuRef.current.removeEventListener('timeupdate', onTimeUpdate);
    }
  }, [content])

  return (
    <Fragment>
      {songContent ?
        <div className='flex justify-center flex-col gap-y-4 shadow-xl w-[100%] bg-[#242424]'>
          <div className="w-72 m-auto max-w-sm">
            <img src={songContent.thumbnail} alt="" className="rounded-t-2xl shadow-2xl w-full object-cover" />
            <div className="bg-white shadow-2xl rounded-b-3xl">
              <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{songContent.channel}</h2>
              <div className="w-5/6 m-auto">
                <p className="text-center text-gray-500 pt-5">{songContent.title}</p>
              </div>
              <div className='p-8 pt-0'>
                <div className="mt-6 flex justify-center items-center">
                  <button onClick={toggleMute} className={isMuted ? 'p-3 rounded-full bg-gray-600 hover:bg-gray-700 focus:outline-none' : 'p-3 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none'}>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" className={isMuted ? 'w-4 h-4 text-gray-200' : 'w-4 h-4 text-gray-600'} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path fill="currentColor" d="m19.8 22.6l-3.025-3.025q-.625.4-1.325.688t-1.45.462v-2.05q.35-.125.688-.25t.637-.3L12 14.8V20l-5-5H3V9h3.2L1.4 4.2l1.4-1.4l18.4 18.4zm-.2-5.8l-1.45-1.45q.425-.775.638-1.625t.212-1.75q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.138T21 11.975q0 1.325-.363 2.55T19.6 16.8m-3.35-3.35L14 11.2V7.95q1.175.55 1.838 1.65T16.5 12q0 .375-.062.738t-.188.712M12 9.2L9.4 6.6L12 4z" />
                      </g>
                    </svg>
                  </button>
                  <button onClick={togglePlayback} className={isPlaying ? 'p-4 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none mx-4' : 'p-4 rounded-full bg-gray-600 hover:bg-gray-700 focus:outline-none mx-4'}>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" className={isPlaying ? 'w-6 h-6 text-gray-600' : 'w-6 h-6 text-gray-200'} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        {isPlaying ?
                          <path fill="currentColor" d="M2 6c0-1.886 0-2.828.586-3.414C3.172 2 4.114 2 6 2c1.886 0 2.828 0 3.414.586C10 3.172 10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414C8.828 22 7.886 22 6 22c-1.886 0-2.828 0-3.414-.586C2 20.828 2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414C15.172 2 16.114 2 18 2c1.886 0 2.828 0 3.414.586C22 3.172 22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414C20.828 22 19.886 22 18 22c-1.886 0-2.828 0-3.414-.586C14 20.828 14 19.886 14 18z" /> :
                          <path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
                        }
                      </g>
                    </svg>
                  </button>
                  <button onClick={() => { setRepeat(!repeat) }} className={repeat ? 'p-3 rounded-full bg-gray-600 hover:bg-gray-700 focus:outline-none' : 'p-3 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none'}>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" className={repeat ? 'w-4 h-4 text-gray-200' : 'w-4 h-4 text-gray-600'} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="m17 2l4 4l-4 4" />
                        <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4l4-4" />
                        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <input
                    className='w-[100%] cursor-pointer'
                    type="range"
                    min={0}
                    max={100}
                    value={currentPercentage}
                    onChange={({ target: { value } }) => seekTrack(value)}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{currentTime}</span>
                  <span>{currentDuration}</span>
                </div>
                <div className='flex mt-2 gap-x-2 justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500' width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 15V9h4l5-5v16l-5-5zm11 1V7.95q1.125.525 1.813 1.625T18.5 12q0 1.325-.687 2.4T16 16" />
                  </svg>
                  <input
                    disabled={isMuted}
                    className='cursor-pointer'
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={currentVolume * 100}
                    onChange={({ target: { value } }) => setVolume(parseInt(value))}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500' width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 20.725v-2.05q2.25-.65 3.625-2.5t1.375-4.2q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.138T21 11.975q0 3.175-1.95 5.613T14 20.725M3 15V9h4l5-5v16l-5-5zm11 1V7.95q1.175.55 1.838 1.65T16.5 12q0 1.275-.663 2.363T14 16" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div> :
        <PlayerSkelaton />}
    </Fragment>
  )
}

export default Player;
