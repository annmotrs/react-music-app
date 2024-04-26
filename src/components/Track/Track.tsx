import { FC, useContext } from 'react';
import { AudioContext, AudioContextType } from '../../context/AudioContext';
import style from './track.module.scss';
import { IconButton } from '@mui/material';
import { PlayArrow, Pause, Favorite } from '@mui/icons-material';
import secondsToMMSS from '../../utils/secondsToMMSS';
import cn from 'classnames';
import TrackType from '../../models/TrackType';

interface TrackProps {
  favoriteList: number[];
  handleToggleFavorite: (currentId: number) => void;
  track: TrackType;
}

const Track: FC<TrackProps> = ({
  track,
  favoriteList,
  handleToggleFavorite,
}) => {
  const { id, preview, title, artists, duration } = track;

  const { handleToggleAudio, currentTrack, isPlaying } = useContext(
    AudioContext
  ) as AudioContextType;

  const isCurrentTrack = currentTrack.id === track.id;

  const formattedDuration = secondsToMMSS(duration);

  return (
    <div className={cn(style.track, isCurrentTrack && style.playing)}>
      <IconButton onClick={() => handleToggleAudio(track)}>
        {isCurrentTrack && isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <img className={style.preview} src={preview} alt="" />
      <div className={style.credits}>
        <b>{title}</b>
        <p>{artists}</p>
      </div>
      <p>{formattedDuration}</p>
      <IconButton
        className={cn(style.button, favoriteList.includes(id) && style.active)}
        onClick={() => handleToggleFavorite(id)}
      >
        <Favorite />
      </IconButton>
    </div>
  );
};

export default Track;
