import { useState, useEffect } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ name, status, onSearch, onStatusChange }) {
  const [localName, setLocalName] = useState(name);
  const [localStatus, setLocalStatus] = useState(status);

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по имени..."
        className="search-input"
        value={localName}
        onChange={(e) => {
          const value = e.target.value;
          setLocalName(value);
          onSearch(value);
        }}
      />
      <select
        className="search-select"
        value={localStatus}
        onChange={(e) => {
          const value = e.target.value;
          setLocalStatus(value);
          onStatusChange(value);
        }}
      >
        <option value="">Все статусы</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  );
}

export default SearchBar;