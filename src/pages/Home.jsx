import CharacterCard from '../components/CharacterCard';
import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';

function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debounceTimeout = useRef(null);

  // 1. Функция поиска с debounce
  const handleSearch = (query, status) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(query);
      setStatusFilter(status);
    }, 1000); // 1 секунда, чтобы ты успела написать
  };

  // 2. Запрос к API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = 'https://rickandmortyapi.com/api/character?';
        const params = [];

        if (searchQuery) {
          params.push(`name=${searchQuery}`);
        }
        if (statusFilter) {
          params.push(`status=${statusFilter}`);
        }

        if (params.length > 0) {
          url += params.join('&');
        } else {
          url = 'https://rickandmortyapi.com/api/character';
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        
        const data = await response.json();
        setCharacters(data.results);
        
      } catch (err) {
        if (err.message.includes('404')) {
          setCharacters([]);  // Очищаем только если ничего не найдено
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [searchQuery, statusFilter]);

  // 3. Что показывать

  // Если настоящая ошибка (интернет, 500)
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // Если загрузка ПЕРВАЯ (при открытии страницы)
  if (loading && characters.length === 0) {
    return <div>Загрузка...</div>;
  }

  // 4. Главный рендер
  return (
    <div>
      <h1>Rick and Morty Explorer</h1>
      <SearchBar 
        name={searchQuery} 
        status={statusFilter}
        onSearch={handleSearch} 
      />      
      {characters.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          fontSize: '20px',
          color: '#666',
          gridColumn: '1 / -1'
        }}>
        🔍 Ничего не найдено
        </div>
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {characters.map(character => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}

export default Home;