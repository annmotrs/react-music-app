import React, { FC, createContext, useState } from 'react';
import tracksList from '../assets/tracksList';
import TrackType from '../models/TrackType';

export type AudioContextType = {
  audio: HTMLAudioElement;
  currentTrack: TrackType;
  isPlaying: boolean;
  isLoop: boolean;
  handleToggleAudio: (track: TrackType) => void;
  handleToggleLoop: () => void;
  tracks: TrackType[];
  setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>;
};

export const AudioContext = createContext<AudioContextType | {}>({});

const audio = new Audio();

const AudioProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<TrackType[]>(tracksList);
  const [currentTrack, setCurrentTrack] = useState<TrackType>(tracksList[0]);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isLoop, setLoop] = useState<boolean>(false);

  //Запуск следующего трека
  const playNextTrack = (track: TrackType) => {
    if (track.id === tracks[tracks.length - 1].id) {
      handleToggleAudio(tracks[0]);
    } else {
      const index = tracks.findIndex((v) => track.id === v.id);
      handleToggleAudio(tracks[index + 1]);
    }
  };

  //Включаем трек или ставим его на паузу
  const handleToggleAudio = (track: TrackType) => {
    if (audio.src !== track.src) {
      setCurrentTrack(track);
      setPlaying(true);

      audio.src = track.src;
      audio.currentTime = 0;
      audio.play();
      audio.onended = () => playNextTrack(track);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  //Переключение режима воспроизведения треков на повторный или на последовательный
  const handleToggleLoop = () => {
    setLoop(!isLoop);
    audio.loop = !isLoop;
  };

  const value = {
    audio,
    currentTrack,
    isPlaying,
    isLoop,
    handleToggleAudio,
    handleToggleLoop,
    tracks,
    setTracks,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default AudioProvider;
