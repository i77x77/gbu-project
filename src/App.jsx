import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CharacterDetail from "./components/CharacterDetail/characterDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

// Корневой компонент: описывает роутинг приложения.
// "*" — заглушка для несуществующих путей (404).
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница со списком */}
        <Route path="/" element={<Home />} />

        {/* Страница с деталями персонажа по его ID */}
        <Route path="/character/:id" element={<CharacterDetail />} />

        {/* Заглушка для любых несуществующих путей */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;