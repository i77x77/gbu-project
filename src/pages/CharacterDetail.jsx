import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CharacterDetail.css';

function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentId = parseInt(id);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://rickandmortyapi.com/api/character/${currentId}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        setCharacter(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [currentId]);

  if (loading) {
    return <div className="detail-container">Загрузка...</div>;
  }

  if (error) {
    return <div className="detail-container">Ошибка: {error}</div>;
  }

  if (!character) {
    return <div className="detail-container">Персонаж не найден</div>;
  }

  const prevId = currentId > 1 ? currentId - 1 : 1;
  const nextId = currentId + 1;

  return (
    <div className="detail-container">
      <div className="navigation-bar">
        <Link to="/" className="back-link">
          ← Назад к списку
        </Link>
        
        <div className="nav-buttons">
          <Link to={`/character/${prevId}`} className="nav-btn">
            ← Назад
          </Link>
          
          <Link to={`/character/${nextId}`} className="nav-btn">
            Вперед →
          </Link>
        </div>
      </div>
      
      <div className="character-card-detail">
        <img 
          src={character.image} 
          alt={character.name}
          className="character-avatar"
        />
        
        <div className="character-info">
          <h1 className="character-name">
            {character.name}
          </h1>
          
          <p><strong>Статус:</strong> {character.status}</p>
          <p><strong>Вид:</strong> {character.species}</p>
          <p><strong>Пол:</strong> {character.gender}</p>
          <p><strong>Локация:</strong> {character.location?.name || 'Неизвестно'}</p>
          <p><strong>Происхождение:</strong> {character.origin?.name || 'Неизвестно'}</p>
          
          <div className="episodes-section">
            <h3 className="episodes-title">
              Эпизоды ({character.episode?.length || 0})
            </h3>
            <div className="episodes-list">
              {character.episode?.map((episodeUrl, index) => {
                const episodeNumber = episodeUrl.split('/').pop();
                return (
                  <span key={index} className="episode-tag">
                    Эпизод {episodeNumber}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetail;