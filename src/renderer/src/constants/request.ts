import axios from 'axios';

export const getPlayList = async (id: string) => {
    const { data: { data } } = await axios.request<{
        data: {
            index: string,
            thumbnail: { url: string }[],
            videoId: string,
            channelTitle: string,
            lengthText: string,
            title: string
        }[]
    }>({
        method: 'GET',
        url: 'https://yt-api.p.rapidapi.com/playlist',
        params: { id },
        headers: {
            'X-RapidAPI-Key': '0313e83d03mshd010ba5d51b9b45p11b1bcjsn87013bb4c87d',
            'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
    })
    return data
}

export const getStreams = async (id: string) => {
    const { data } = await axios.request<{
        adaptiveFormats: {
            "url": string,
            "mimeType": string,
            "bitrate": number,
            "contentLength": string,
            "approxDurationMs": string
        }[]
    }>({
        method: 'GET',
        url: 'https://yt-api.p.rapidapi.com/dl',
        params: { id },
        headers: {
            'X-RapidAPI-Key': '0313e83d03mshd010ba5d51b9b45p11b1bcjsn87013bb4c87d',
            'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
    })

    const AudioTracks: typeof data.adaptiveFormats = []
    for (const item of data.adaptiveFormats) {
        if (item.mimeType.includes('audio/webm')) {
            AudioTracks.push(item)
        }
    }

    /* return the audio stream with highest bitrate */
    return AudioTracks.reduce((prev, current) => {
        return (prev.bitrate > current.bitrate) ? prev : current;
    })
}
