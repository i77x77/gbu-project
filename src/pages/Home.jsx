import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import CharacterCard from '../components/CharacterCard';
import '../styles/Home.css';

function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimeout = useRef(null);

  const handleSearch = (query, status) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(query);
      setStatusFilter(status);
      setPage(1);
    }, 250);
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = 'https://rickandmortyapi.com/api/character?';
        const params = [];

        if (searchQuery) params.push(`name=${searchQuery}`);
        if (statusFilter) params.push(`status=${statusFilter}`);
        if (page) params.push(`page=${page}`);

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
        setTotalPages(data.info.pages);
        
      } catch (err) {
        if (err.message.includes('404')) {
          setCharacters([]);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [searchQuery, statusFilter, page]);

  if (error) {
    return <div className="home-container">Ошибка: {error}</div>;
  }

  if (loading && characters.length === 0) {
    return <div className="home-container">Загрузка...</div>;
  }

  return (
    <div className="home-container">
      <h1>Rick and Morty Explorer</h1>
      
      <SearchBar 
        name={searchQuery} 
        status={statusFilter}
        onSearch={handleSearch} 
      />
      
      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
      
      {characters.length === 0 && !loading ? (
        <div className="no-results">🔍 Ничего не найдено</div>
      ) : (
        <div className="characters-grid">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;