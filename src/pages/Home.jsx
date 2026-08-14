import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import CharacterCard from '../components/CharacterCard';
import '../styles/Home.css';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const page = Number(searchParams.get('page')) || 1;
  const questSearch = searchParams.get('name') || '';
  const statusFilter = searchParams.get('status') || '';

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Обновление URL
  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };

    
    if (newParams.page !== undefined && newParams.page <= 1) {
      delete updated.page;
    }

    Object.keys(updated).forEach((key) => {
      if (!updated[key]) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };

  // Поиск с debounce
  const handleSearch = (value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      updateParams({ name: value, status: statusFilter, page: 1 });
    }, 512);

    setDebounceTimer(newTimer);
  };

  // Статус (без debounce)
  const handleStatusChange = (value) => {
    updateParams({ status: value, name: questSearch, page: 1 });
  };

  // Пагинация
  const handlePageChange = (newPage) => {
    const currentName = searchParams.get('name') || '';
    const currentStatus = searchParams.get('status') || '';

    const params = {};
    if (currentName) params.name = currentName;
    if (currentStatus) params.status = currentStatus;
    
    if (newPage > 1) {
      params.page = newPage;
    } else {
      params.page = 1; 
    }
    
    updateParams(params);
  };

  // Запрос к API (зависит от URL)
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowLoader(false);

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const params = new URLSearchParams();

        if (questSearch) params.append('name', questSearch);
        if (statusFilter) params.append('status', statusFilter);
        if (page > 1) params.append('page', page);

        const url = `${baseUrl}/character?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Ничего не найдено');
          }
          throw new Error(`Ошибка запроса: ${response.status}`);
        }

        const data = await response.json();
        setCharacters(data.results || []);
        setTotalPages(data.info?.pages || 1);
      } catch (err) {
        const errorMessage = err.message;

        if (errorMessage.includes('404') || errorMessage.includes('Ничего не найдено')) {
          setCharacters([]);
          setError(null);
          setShowLoader(false);
        } else if (
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('CORS') ||
          errorMessage.includes('Failed to fetch')
        ) {
          setError('Не удалось подключиться к серверу. Проверьте интернет.');
          setCharacters([]);
          setShowLoader(false);
        } else {
          setError(`Ошибка: ${errorMessage}`);
          setCharacters([]);
          setShowLoader(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [questSearch, statusFilter, page]);

  // Спиннер с задержкой
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 300);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const showError = error && !loading;

  if (loading && characters.length === 0) {
    return (
      <div className="home-container">
        <h1>Rick and Morty Explorer</h1>
        <SearchBar
          name={questSearch}
          status={statusFilter}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        <Loader />
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Rick and Morty Explorer</h1>

      <SearchBar
        name={questSearch}
        status={statusFilter}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      {showError ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          {error}
          <div className="error-sub">Попробуйте обновить страницу или зайти позже</div>
        </div>
      ) : (
        <>
          {showLoader && characters.length > 0 && <Loader size="small" inline />}

          {characters.length === 0 && !loading ? (
            <div className="no-results">🔍 Ничего не найдено</div>
          ) : (
            <div className="characters-grid">
              {characters.map((character, index) => (
                <Link
                  to={`/character/${character.id}${location.search}`}
                  key={character.id}
                  state={{ characters: characters, currentIndex: index }}
                  style={{ textDecoration: 'none' }}
                >
                  <CharacterCard character={character} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;