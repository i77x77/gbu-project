  // /* Debounce поиска: ждём 512мс после последнего ввода и только тогда обновляем URL.
  //    Если пользователь печатает дальше, эффект перезапускается и предыдущий
  //    таймер отменяется через cleanup — новый setTimeout не нужен вручную. */
  // useEffect(() => {
  //   if (search === questSearch) return; /* Строгое равенство */

  //   const handler = setTimeout(() => {
  //     updateParams({ name: search, page: 1 });
  //   }, 512);

  //   return () => clearTimeout(handler);
  // }, [search]);

import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;