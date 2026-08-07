import '../styles/SearchBar.css';

function SearchBar({ name, status, onSearch }) {
  const handleNameChange = (e) => {
    const newName = e.target.value;
    onSearch(newName, status); // ← вызываем поиск с новым именем и текущим статусом
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onSearch(name, newStatus); // ← вызываем поиск с текущим именем и новым статусом
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по имени..."
        className="search-input"
        value={name} // ← берём из пропсов (не локального состояния)
        onChange={handleNameChange}
      />
      <select
        className="search-select"
        value={status} // ← берём из пропсов
        onChange={handleStatusChange}
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