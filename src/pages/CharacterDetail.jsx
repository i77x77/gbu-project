import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import '../styles/CharacterDetail.css';

function CharacterDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const currentId = parseInt(id);

  // Получаем список персонажей из state (если пришёл из Home)
  const { characters = [], currentIndex = 0 } = location.state || {};
  const isFromSearch = characters.length > 0;

  // Вычисляем prevId и nextId на основе списка
  const getPrevId = () => {
    if (isFromSearch && currentIndex > 0) {
      return characters[currentIndex - 1].id;
    }
    if (isFromSearch && currentIndex === 0) {
      return currentId; // Остаёмся на месте
    }
    return currentId > 1 ? currentId - 1 : 1;
  };

  const getNextId = () => {
    if (isFromSearch && currentIndex < characters.length - 1) {
      return characters[currentIndex + 1].id;
    }
    if (isFromSearch && currentIndex === characters.length - 1) {
      return currentId; // Остаёмся на месте
    }
    return currentId + 1;
  };

  const prevId = getPrevId();
  const nextId = getNextId();

  // Показываем спиннер только если загрузка длится > 300 мс
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

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowLoader(false);
        
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/character/${currentId}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        setCharacter(data);
        
      } catch (err) {
        setError(err.message);
        setShowLoader(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [currentId]);

  // Если ошибка — показываем внутри интерфейса
  if (error) {
    return (
      <div className="detail-container">
        <div className="navigation-bar">
          <Link to={`/${location.search}`} className="back-link">
            ← Назад к списку
          </Link>
        </div>
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          Ошибка: {error}
          <div className="error-sub">Попробуйте обновить страницу</div>
        </div>
      </div>
    );
  }

  // Если персонаж не найден
  if (!character && !loading) {
    return (
      <div className="detail-container">
        <div className="navigation-bar">
          <Link to={`/${location.search}`} className="back-link">
            ← Назад к списку
          </Link>
        </div>
        <div className="no-results-state">🔍 Персонаж не найден</div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="navigation-bar">
        <Link to={`/${location.search}`} className="back-link">
          ← Назад к списку
        </Link>
        
        <div className="nav-buttons">
          <Link 
            to={`/character/${prevId}${location.search}`} 
            className="nav-btn"
            state={{ characters, currentIndex: currentIndex - 1 }}
            style={isFromSearch && currentIndex === 0 ? { pointerEvents: 'none', opacity: 0.3 } : {}}
          >
            ← Назад
          </Link>
          
          <Link 
            to={`/character/${nextId}${location.search}`} 
            className="nav-btn"
            state={{ characters, currentIndex: currentIndex + 1 }}
            style={isFromSearch && currentIndex === characters.length - 1 ? { pointerEvents: 'none', opacity: 0.3 } : {}}
          >
            Вперед →
          </Link>
        </div>
      </div>
      
      {/* Если загрузка — показываем спиннер только если он уже активен */}
      {loading ? (
        <div className="loader-wrapper">
          {showLoader ? <Loader /> : <div className="loader-placeholder" />}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default CharacterDetail;