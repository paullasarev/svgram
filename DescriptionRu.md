# Редактор диаграмм на базе SVG #

Диаграммы представляют собой удобный инструмент визуализации различных сущностей - блок-схем, [UML](http://en.wikipedia.org/wiki/Unified_Modeling_Language)-описаний структуры систем, бизнес-процессов и многого другого.

Для работы с диаграммами используются как специализированные средства типа [Microsoft Visio](http://en.wikipedia.org/wiki/Microsoft_visio), так и встроенные, например, в [Microsoft Word](http://en.wikipedia.org/wiki/Microsoft_word). К сожалению, из удобных средств работы с диаграммами можно назвать разве что [Microsoft Visio](http://en.wikipedia.org/wiki/Microsoft_visio), но его проблематично использовать в web-окружении.

С точки зрения пользователя диаграммы представляют собой набор базовых блоков и связей между ними. Очень важно, что блоки должны быть связаны, и эти связи должны сохраняться и трансформироваться в процессе редактирования, иначе работа с диаграммами становится просто мучительной.

Формат [SVG](http://www.w3.org/TR/SVG) хорошо подходит для визуализации диаграмм и предоставляет богатый набор векторных примитивов. Однако, непосредственное создание [SVG](http://www.w3.org/TR/SVG) файла в специализированном редакторе типа [Inkscape](http://inkscape.org/) слишком сложно, так как графические примитивы [SVG](http://www.w3.org/TR/SVG) очень низкоуровневые.

Основные цели проекта:
  * Использовать возможности современных браузеров по работе с [SVG](http://www.w3.org/TR/SVG) в качестве основы для визуализации и редактирования диаграмм
  * Реализация в качестве клиентского приложения для встраивания в [rich internet applications](http://en.wikipedia.org/wiki/Rich_Internet_application)
  * Реализация на [JavaScript](http://en.wikipedia.org/wiki/JavaScript) с минимальным использованием сторонних библиотек
  * Базовые элементы - блоки, связи, текст
  * Экспорт/импорт в [SVG](http://www.w3.org/TR/SVG)
  * Тематические библиотеки блоков - [UML](http://en.wikipedia.org/wiki/Unified_Modeling_Language), [FlowChart](http://en.wikipedia.org/wiki/Flowchart) и другие

Дополнительные цели:
  * реализация встраиваемого компонента для [rich internet applications](http://en.wikipedia.org/wiki/Rich_Internet_application)
  * реализация библиотеки [JavaScript](http://en.wikipedia.org/wiki/JavaScript) для работы со сложными блоками (фигурами) в формате [SVG](http://www.w3.org/TR/SVG)
  * реализация расширения для [MediaWiki](http://www.mediawiki.org/wiki/Category:Extensions)
  * реализация расширения для [Confluence](http://www.atlassian.com/software/confluence)
  * реализация совместного редактирования диаграмм с использованием [websocket](http://en.wikipedia.org/wiki/WebSocket)/[Socket.io](http://socket.io/) API и сервера [node.js](http://nodejs.org/api/)
  * реализация в виде модуля [node-webkit](https://github.com/rogerwang/node-webkit)


Лицензия: [MIT](http://www.opensource.org/licenses/mit-license.php)

Материалы:
  * Демо (Chrome,Firefox): http://svgram.googlecode.com/svn/trunk/svgram_metro.html
  * Репозиторий проекта: http://code.google.com/p/svgram/
  * Общедоступный багтрекер: http://code.google.com/p/svgram/issues/list

Приглашаем всех кому интересен этот проект принять участие!

Если что - пишите на [mailto:paullasarev@gmail.com](mailto:paullasarev@gmail.com)