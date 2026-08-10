import CharacterCard from './CharacterCard';

function CharactersGrid({ characters }) {
  if (characters.length === 0) {
    return (
      <div className="no-results">
        🔍 Ничего не найдено
      </div>
    );
  }

  return (
    <div className="characters-grid">
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}

export default CharactersGrid;