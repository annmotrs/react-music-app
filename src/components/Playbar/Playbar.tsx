import { FC, useContext, useState, useEffect } from 'react';
import { AudioContextType, AudioContext } from '../../context/AudioContext';
import style from './playbar.module.scss';
import { Slider, IconButton } from '@mui/material';
import { PlayArrow, Pause, Loop } from '@mui/icons-material';
import secondsToMMSS from '../../utils/secondsToMMSS';
import cn from 'classnames';

const TimeControls: FC = () => {
  const { audio, currentTrack } = useContext(AudioContext) as AudioContextType;

  const { duration } = currentTrack;

  const [currentTime, setCurrentTime] = useState(0);

  const formattedCurrentTime = secondsToMMSS(currentTime);

  const sliderCurrentTime = Math.round((currentTime / duration) * 100);

  //Изменяем текущее время воспроизведения трека на выбранное
  const handleChangeCurrentTime = (_: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      const time = Math.round((value / 100) * duration);
      setCurrentTime(time);
      audio.currentTime = time;
    }
  };

  //Каждую секунду обновляем текущую позицию времени воспроизведения трека
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(audio.currentTime);
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <>
      <p>{formattedCurrentTime}</p>
      <Slider
        step={1}
        min={0}
        max={100}
        value={sliderCurrentTime}
        onChange={handleChangeCurrentTime}
      />
    </>
  );
};

const Playbar: FC = () => {
  const {
    currentTrack,
    handleToggleAudio,
    isPlaying,
    isLoop,
    handleToggleLoop,
  } = useContext(AudioContext) as AudioContextType;

  const { title, artists, preview, duration } = currentTrack;

  const formattedDuration = secondsToMMSS(duration);

  return (
    <div className={style.playbar}>
      <img className={style.preview} src={preview} alt="" />
      <IconButton onClick={() => handleToggleAudio(currentTrack)}>
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>

      <div className={style.credits}>
        <h4>{title}</h4>
        <p>{artists}</p>
      </div>
      <div className={style.slider}>
        <TimeControls />
        <p>{formattedDuration}</p>
      </div>
      <IconButton onClick={handleToggleLoop}>
        <Loop className={cn(style.loop, isLoop && style.active)} />
      </IconButton>
    </div>
  );
};

export default Playbar;
