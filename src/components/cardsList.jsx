import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './Card';
import Loader from './loader';
import './CardsList.css';

const CardsList = () => {
  /* Считываем параметры из URL (хук из библиотеки react-router-dom) */
  const [searchParams, setSearchParams] = useSearchParams();

  /* Данные из URL (иначе значения по умолчанию) */
  const page = Number(searchParams.get('page')) || 1;
  const questSearch = searchParams.get('name') || '';
  const statusFilter = searchParams.get('status') || '';

  /* Базовые состояния: список персонажей, загрузка, ошибка */
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Поле поиска по имени (для локального мгновенного отображения в input) */
  const [search, setSearch] = useState(questSearch);
  const [debounceTimer, setDebounceTimer] = useState(null); /* Таймер для debounce */

  /* Синхронизируем поле ввода со значением из URL */
  useEffect(() => {
    setSearch(questSearch);
  }, [questSearch]);

  /* Пагинация */
  const [info, setInfo] = useState(null); /* info из ответа API */

  /* Функция для обновления параметров в URL */
  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    /* Удаляем пустые параметры из URL */
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };

  /* Новый запрос к API при изменении URL-параметров (поиск, фильтр или пагинация) */
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        /* Формируем параметры запроса заново в зависимости от текущих условий */
        const params = new URLSearchParams();
        params.append('page', page);

        if (questSearch) {
          params.append('name', questSearch); /* Добавляем параметр name, если поиск не пустой */
        }

        if (statusFilter) {
          params.append('status', statusFilter); /* Добавляем статус, если выбран */
        }

        const url = 'https://rickandmortyapi.com/api/character?' + params.toString();
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) 
          {
            throw new Error('Ничего не найдено');
          } 
          else 
          {
            throw new Error(`Ошибка запроса: ${response.status}`);
          }
        }

        const data = await response.json();

        setCharacters(data.results);
        setInfo(data.info);
      } 
      catch (err) 
      {
        setError(err.message);
        setCharacters([]);
        setInfo(null);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [questSearch, statusFilter, page]);

  /* Обновляем текущую страницу в URL */
  const goToPage = (nextUrl) => 
  {
    if (!nextUrl) 
      return;
    const url = new URL(nextUrl);
    const pageParam = url.searchParams.get('page');
    updateParams({ page: pageParam || 1 });
  };

  // Debounce для поиска
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value); /* Сразу обновляем поле ввода */

    if (debounceTimer) 
    {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => 
    {
      updateParams({ name: value, page: 1 }); /* Обновляем URL и сбрасываем на 1 страницу */
    }, 512);

    setDebounceTimer(newTimer);
  };

  /* Обновляем фильтр в URL */
  const handleStatusChange = (e) =>
  {
    updateParams({ status: e.target.value, page: 1 }); /* Обновляем URL и сбрасываем на 1 страницу */
  };

return (
  <div className="page-wrapper">
    {/* Главный заголовок */}
    <h1 className="main-title">
      Rick and Morty
      <br />
      «Character Catalog»
    </h1>

    {/* Блок фильтров */}
    <div className="filter-container">
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={handleSearchChange}
          placeholder="Поиск по имени..."
        />
      </div>

      <select
        className="status-filter"
        value={statusFilter}
        onChange={handleStatusChange}
      >
        <option value="">Все статусы</option>
        <option value="alive">Жив(а)</option>
        <option value="dead">Мёртв(а)</option>
        <option value="unknown">Неизвестно</option>
      </select>
    </div>

    {/* Сетка для карточек */}
    <section className="cards-list">
      {(loading || error || characters.length === 0) && (
        <div className="centered-overlay">
          {loading && <Loader />}

          {!loading && error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && characters.length === 0 && (
            <div className="no-results-message">
              Ничего не найдено
            </div>
          )}
        </div>
      )}

      {!loading && !error && characters.map((character) => (
        <Card
          key={character.id}
          id={character.id}
          name={character.name}
          status={character.status}
          image={character.image}
        />
      ))}
    </section>

    {/* Блок пагинации */}
    {!loading && !error && info && characters.length > 0 && (
      <div className="pagination-controls">
        {info.prev && (
          <button
            className="pagination-btn"
            onClick={() => goToPage(info.prev)}
          >
            Назад
          </button>
        )}

        <span className="pagination-info">
          Страница {page} из {info.pages}
        </span>

        {info.next && (
          <button
            className="pagination-btn"
            onClick={() => goToPage(info.next)}
          >
            Далее
          </button>
        )}
      </div>
    )}
  </div>
);

};

export default CardsList;