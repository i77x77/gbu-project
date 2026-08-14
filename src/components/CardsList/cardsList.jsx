import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import Search from '../Filters/search.jsx';
import Filter from '../Filters/filter.jsx';
import Pagination from '../Pagination/pagination.jsx';
import Card from '../Card/card.jsx';
import Loader from '../Loader/loader.jsx';
import './cardsList.css';

const apiUrl = import.meta.env?.VITE_API_URL;

const status = [
  { value: 'alive', label: 'Жив(а)' },
  { value: 'dead', label: 'Мёртв(а)' },
  { value: 'unknown', label: 'Неизвестно' },
];

const CardsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const questSearch = searchParams.get('name') || '';
  const statusFilter = searchParams.get('status') || '';

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const [search, setSearch] = useState(questSearch);

  useEffect(() => {
    setSearch(questSearch);
  }, [questSearch]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };

    Object.keys(updated).forEach((key) => {
      if (!updated[key]) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };

  const handleReset = () => {
    setSearch('');
    setSearchParams({});
  };

  /* Вопрос по таймеру: меня смущает цепочка из двух useEffect (один внутри useDebounce, второй здесь).
  Это ведь лишний рендер? Стоит ли пытаться избегать таких конструкций? Например, через useRef?*/
  const debouncedSearch = useDebounce(search, 512);

  useEffect(() => {
    if (debouncedSearch === questSearch) return;
    updateParams({ name: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append('page', page);

        if (questSearch) {
          params.append('name', questSearch);
        }

        if (statusFilter) {
          params.append('status', statusFilter);
        }

        const url = `${apiUrl}/character?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Ничего не найдено');
          } else {
            throw new Error(`Ошибка запроса: ${response.status}`);
          }
        }

        const data = await response.json();
        setCharacters(data.results);
        setInfo(data.info);
      } catch (err) {
        setError(err.message);
        setCharacters([]);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [questSearch, statusFilter, page]);

  const goToPage = (nextUrl) => {
    if (!nextUrl) return;
    const url = new URL(nextUrl);
    const pageParam = url.searchParams.get('page');
    updateParams({ page: pageParam || 1 });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    updateParams({ status: e.target.value, page: 1 });
  };

  return (
    <main className="page-wrapper">
      <h1
        className="main-title"
        onClick={handleReset}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleReset();
          }
        }}
      >
        Rick and Morty <br /> «Character Catalog»
      </h1>

      <div className="filter-bar">
        <Search
          value={search}
          onChange={handleSearchChange}
          placeholder="Поиск по имени..."
        />
        <Filter
          value={statusFilter}
          onChange={handleStatusChange}
          options={status}
          placeholder="Все статусы"
        />
      </div>

      <section className="cards-list">
        {(loading || error || characters.length === 0) && (
          <div className="centered-overlay">
            {loading && <Loader />}
            {!loading && error && <div className="error-message">{error}</div>}
            {!loading && !error && characters.length === 0 && (
              <div className="no-results-message">Ничего не найдено</div>
            )}
          </div>
        )}

        {!loading &&
          !error &&
          characters.map((character) => (
            <Card
              key={character.id}
              id={character.id}
              name={character.name}
              status={character.status}
              image={character.image}
            />
          ))}
      </section>

      {!loading && !error && info && characters.length > 0 && (
        <Pagination
          page={page}
          pages={info.pages}
          prev={info.prev}
          next={info.next}
          onPageChange={goToPage}
        />
      )}
    </main>
  );
};

export default CardsList;