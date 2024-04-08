
# React + Vite

Этот проект является React приложением, предназначенным для управления цветовыми палитрами с использованием различных библиотек.

### Предварительные требования

Что вам нужно установить на ваш компьютер:

### Установка

Шаги по установке и запуску проекта:

1. Клонируйте репозиторий:
git clone https://github.com/sharn1999/palettes.git

2. Войдите в папку и скачайте все нужные модули:

cd palettes

npm i

4. Запустите проект:
npm run dev

5. Перейдите по ссылке http://localhost:5173/

6. Так же нужно скачать mongoDB и запустить сервер с портом 27017 нажав кнопку connect (смотерть скриншоты):
Скачать MongoDB

https://github.com/sharn1999/palettes/assets/58104696/486b916e-637d-4bfb-ae89-a468a2415ec8

: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.8-signed.msi
![image](https://github.com/sharn1999/palettes/assets/58104696/d94d3a83-826e-4819-8df3-0b4dccb75545)

8. Запустите сервер (в другом терминале одновременно с реактом):
node palettes/src/DB/server.js

##  Использованные библиотеки

В этом проекте я использовал такие библиотеки как:
styled-components (для стилизации компонентов)
react-slugify (для преобразования строк в нужный формат)
react-router-dom (для перехода между страницами)
chroma-js (для генерации рандомных цветов)
react-color (для готовой палитры с функциями смены оттенков и насыщености цвета)
express (для создания REST запросов на MongoDB)
mongoose (для определения схем данных для хранения их в MongoDB)
cors (для большей безопасности данных)

## Процесс проектирования и разработки

В этом проекте я использовал React + Vite, на реакте собрал первоначальную структуру, через styled-components стилизовал все блоки, сверстал html структуру, далее начал прописывать логику приложения с помощью хуков, взаимодействия компонентов между друг другом, прописал состояния. Изначально я писал проект без базы данных и вместо нее использовал localStorage для хранения данных о палитрах. Далее подключил react-router-dom для перехода страниц между друг другом. Потом решил переписать весь проект так, чтобы я мог сохранять все нужные мне данные не на localStorage, а на базу данных. Базу данных я решил выбрать mongoDB. Для меня это был совершенно новый опыт в работе, так как раньше никогда не работал с этой БД. Я имортировал mongoose и express в свой проект, создал модель палитры, и создал get запрос при помощи express на получение палитр с БД. Далее в react коде я создал функцию для получения и обработки данных с get запроса, затем сохранил их в состоянии. Таким образом я заменил все функции использующие localStorage на MongoDB.

Так же во время разработки пришлось отказаться от анимаций перехода между страницами, так как они не работали корректо и вызывали ошибки, из известных мне ошибок я могу выделить только то, что нельзя настроить прозрачность в моей палитре так как когда я меняю палитру с hex на rgb выходят ошибки. Об остальных ошибках пользователь получает оповещение в виде alert.


