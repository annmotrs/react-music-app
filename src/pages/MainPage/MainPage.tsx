import { FC, useState, useEffect, useContext } from 'react';
import { AudioContextType, AudioContext } from '../../context/AudioContext';
import Track from '../../components/Track/Track';
import tracksList from '../../assets/tracksList';
import TrackType from '../../models/TrackType';
import style from './mainPage.module.scss';
import { Input, Button } from '@mui/material';

//Производим поиск по трекам, отбираем треки
const runSearch = (query: string) => {
  if (!query) {
    return tracksList;
  }

  const lowerCaseQuery = query.toLowerCase();

  return tracksList.filter(
    (track: TrackType) =>
      track.title.toLowerCase().includes(lowerCaseQuery) ||
      track.artists.toLowerCase().includes(lowerCaseQuery)
  );
};

//Изменяем список треков в Избранном
const updateFavoriteList = (favoriteList: number[], currentId: number) => {
  const isFound = favoriteList.includes(currentId);
  if (isFound) {
    return favoriteList.filter((id) => id !== currentId);
  } else {
    return [currentId, ...favoriteList];
  }
};

//Отбираем треки, которые находятся в Избранном
const filteringFavoriteTracks = (favoriteList: number[]) => {
  return favoriteList.map((id: number) => {
    const index = tracksList.findIndex((track) => track.id === id);
    return tracksList[index];
  });
};

const MainPage: FC = () => {
  const { tracks, setTracks } = useContext(AudioContext) as AudioContextType;
  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [activeMode, setActiveMode] = useState<'all' | 'favorite'>('all');

  //Получаем сохраненные данные в веб-хранилище, находящемся в браузере пользователя, если они есть
  useEffect(() => {
    const savedFavoriteList = localStorage.getItem('favoriteList');
    if (savedFavoriteList) {
      setFavoriteList(JSON.parse(savedFavoriteList));
    }
  }, []);

  //Делаем поиск по трекам
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const foundTracks = runSearch(event.target.value);
    if (activeMode === 'favorite') {
      let foundFavoriteTracks: TrackType[] = [];
      favoriteList.forEach((id: number) => {
        const index = foundTracks.findIndex(
          (track: TrackType) => track.id === id
        );
        if (index !== -1) {
          foundFavoriteTracks.push(foundTracks[index]);
        }
      });
      setTracks(foundFavoriteTracks);
    } else {
      setTracks(foundTracks);
    }
  };

  //Открытие списка всех треков, либо списка треков в Избранном
  const toggleActiveMode = (value: 'all' | 'favorite') => {
    setActiveMode(value);
    if (value !== 'all') {
      const favoriteTracks = filteringFavoriteTracks(favoriteList);
      setTracks(favoriteTracks);
    } else {
      setTracks(tracksList);
    }
  };

  //Добавление или удаление трека из Избранного
  const handleToggleFavorite = (currentId: number) => {
    const newFavoriteList = updateFavoriteList(favoriteList, currentId);
    setFavoriteList(newFavoriteList);
    localStorage.setItem('favoriteList', JSON.stringify(newFavoriteList));
    if (activeMode === 'favorite') {
      const favoriteTracks = filteringFavoriteTracks(newFavoriteList);
      setTracks(favoriteTracks);
    }
  };

  return (
    <div className={style.search}>
      <div className={style.nav}>
        <Input
          className={style.input}
          placeholder="Поиск треков"
          onChange={handleChange}
        ></Input>
        <div className={style.buttons}>
          <Button
            variant={activeMode === 'all' ? 'contained' : 'outlined'}
            onClick={() => toggleActiveMode('all')}
          >
            Все
          </Button>
          <Button
            variant={activeMode === 'all' ? 'outlined' : 'contained'}
            onClick={() => toggleActiveMode('favorite')}
          >
            Избранное
          </Button>
        </div>
      </div>
      <div className={style.list}>
        {tracks.length !== 0 ? (
          tracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              favoriteList={favoriteList}
              handleToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <span className={style.warning}>Ничего не найдено</span>
        )}
      </div>
    </div>
  );
};

export default MainPage;
