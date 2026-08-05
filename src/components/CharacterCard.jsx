import '../styles/CharacterCard.css';

function CharacterCard({ character }) {
  return (
    <div className="character-card">
      <img src={character.image} alt={character.name} />
      <h3>{character.name}</h3>
      <p>Статус: {character.status}</p>
    </div>
  );
}

export default CharacterCard;

