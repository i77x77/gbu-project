# gbu-project

Фронтенд-проект на React + Vite.

## Стек

- React 19
- React Router 7
- Vite 8
- ESLint

## Требования

- **Node.js** версии 20 или выше (проверить: `node -v`). Скачать: https://nodejs.org
- **npm** идёт в комплекте с Node.js (проверить: `npm -v`)
- **git** для клонирования репозитория

## Установка

1. Склонировать репозиторий:

   ```bash
   git clone https://github.com/i77x77/gbu-project.git
   cd gbu-project
   ```

2. Установить зависимости:

   ```bash
   npm install
   ```

## Разработка

Запустить локальный dev-сервер с горячей перезагрузкой (HMR):

```bash
npm run dev
```

По умолчанию проект будет доступен по адресу, который Vite выведет в консоль (обычно `http://localhost:5173`).

## Проверка кода линтером

```bash
npm run lint
```

## Сборка production-версии

Собрать проект в папку `dist`:

```bash
npm run build
```

Локально посмотреть собранную production-версию:

```bash
npm run preview
```

## Структура проекта

```
src/
  pages/       # страницы приложения
  App.jsx      # корневой компонент, роутинг
  main.jsx     # точка входа
public/        # статические файлы
```
