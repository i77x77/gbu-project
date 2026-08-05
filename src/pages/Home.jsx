import CharacterCard from '../components/CharacterCard';
import rick from '../assets/rick.jpeg';
import morty from '../assets/morty.png';
import summer from '../assets/summer.jpeg';
import beth from '../assets/beth.jpeg';

function Home() {
  // Временные данные для проверки (без API)


const testCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    image: rick
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    image: morty
  },
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    image: summer
  },
  {
    id: 4,
    name: 'Beth Smith',
    status: 'Alive',
    image: beth
  }
];

  return (
    <div>
      <h1>Rick and Morty Explorer</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {testCharacters.map(character => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}

export default Home;