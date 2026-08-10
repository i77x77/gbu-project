import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './characterDetail.css';

const loadingSymbols = ['|', '/', '-', '\\'];

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Состояния компонентов
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [symbolIndex, setSymbolIndex] = useState(0);

  // Анимация загрузки
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setSymbolIndex((prevIndex) => (prevIndex + 1) % loadingSymbols.length);
    }, 150);

    return () => clearInterval(interval);
  }, [loading]);

  // Загрузка данных персонажа
  useEffect(() => {
    const fetchCharacterAndEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Запрос по id
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

        if (!response.ok) {
          throw new Error('Персонаж не найден!');
        }

        const data = await response.json();
        setCharacter(data);

        // Пакетный запрос эпизодов
        if (data.episode && data.episode.length > 0) {
          const episodeIds = data.episode
            .map((url) => url.split('/').pop())
            .join(',');

          const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`);

          if (!episodeResponse.ok) {
            throw new Error('Не удалось загрузить эпизоды');
          }

          const episodeData = await episodeResponse.json();

          // Приводим всегда к массиву
          const episodeList = Array.isArray(episodeData) ? episodeData : [episodeData];
          setEpisodes(episodeList);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterAndEpisodes();
  }, [id]);

  // Загрузка
  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-spinner">
          {loadingSymbols[symbolIndex]}
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Вернуться назад
        </button>
        <p className="detail-message detail-message--error">Ошибка: {error}</p>
      </div>
    );
  }

  // Динамический класс свечения по статусу
  const statusClass = character?.status ? `detail-card--${character.status.toLowerCase()}` : 'detail-card--unknown';

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-link">
        Назад
      </button>

      {character && (
        <article className={`detail-card ${statusClass}`}>
          <img
            src={character.image}
            alt={character.name}
            className="detail-card__image"
          />

          <div className="detail-card__content">
            <h1 className="detail-card__title">{character.name}</h1>

            <div className="detail-card__status">
              <span>{character.status} — {character.species}</span>
            </div>

            <ul className="detail-card__info-list">
              <li>
                <span className="info-label">Пол:</span> {character.gender}
              </li>
              <li>
                <span className="info-label">Родная планета:</span> {character.origin?.name}
              </li>
              <li>
                <span className="info-label">Текущая локация:</span> {character.location?.name}
              </li>
              <li>
                <span className="info-label">Всего эпизодов:</span> {character.episode?.length}
              </li>
            </ul>

            {episodes.length > 0 && (
              <div className="episodes-section">
                <h3 className="episodes-section__title">
                  Список всех эпизодов ({episodes.length}):
                </h3>
                <ul className="episodes-section__list">
                  {episodes.map((ep) => (
                    <li key={ep.id} className="episodes-section__item">
                      <strong>{ep.episode}:</strong> {ep.name} <span className="episodes-section__date">({ep.air_date})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
};

export default CharacterDetail;