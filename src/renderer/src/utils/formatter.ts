export const getClockString = (time: number) => {
    if (!time) { return false }
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const formattedMinutes = minutes.toString()
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

export const getPercentage = (currentTime: number, duration: number) => {
    const rPercentage = ((currentTime / duration) * 100)
    return Number.isNaN(rPercentage) ? false : rPercentage.toFixed()
}
