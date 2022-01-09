"use strict";
/**
 * функция аккардион, для скрытия и отображения в тихническом задании: дано, осн. цели, доп. цели
*/
function accordion() {
    // получение из DOM-дерева всех элементов с классом .section__title
    /**
     * title - массив элементов с классом .section__title
    */
    const title = document.querySelectorAll('.section__title');
    // перебор массива title
    title.forEach((elem) => {
        // на каждый элемент массива title вешаем клик
        elem.addEventListener('click', () => {
            // получаем элемент следующий за elem
            /**
             * content - хранит элемент следующий за elem
            */
            let content = elem.nextElementSibling;
            // проверяем есть ли у content maxHeight
            if(content.style.maxHeight) {
                // проходим по элементам массива title и закрываем все активные элементы
                title.forEach((title) => title.classList.remove('section__title_active'));
                // получаем все элементы .section__accordion, перебираем эти элементы и у каждого обнуляем maxHeight
                document.querySelectorAll('.section__accordion')
                    .forEach((elem) => elem.style.maxHeight = null);
            } else {
                // проходим по элементам массива title и закрываем все активные элементы
                title.forEach((title) => title.classList.remove('section__title_active'));
                // делаем элемент активным, по которому был click
                elem.classList.add('section__title_active');
                // получаем все элементы .section__accordion, перебираем эти элементы и у каждого обнуляем maxHeight
                document.querySelectorAll('.section__accordion')
                    .forEach((elem) => elem.style.maxHeight = null);
                // раскрываем элемент, следующий за элементом по которому click
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        })
    })
}
// вызываем функцию аккардион
accordion();

// получаем данные из json файла
/**
 * users - хранит элементы, принятые из json файла
*/
const users = fetch('./users.json')
    .then((response) => response.json())
    .then(function (data) {
        return data;
    });

/**
 * tableTask - функция, которая отображает таблицу с даными, полученными из json файла
*/
function tableTask() {
    // получаем тело таблицы по id
    /**
     * tbody - хранит тело таблицы
    */
    let tbody = document.getElementById('tbody');
    // распаковываем элементы из users
    users.then((data) => {
        /**
         * usersOnPage - количество пользователей на странице
        */
        let usersOnPage = 10;
        /**
         * countPagination - количество страниц
        */
        let countPagination = Math.ceil(data.length / usersOnPage);
        /**
         * pagination - пагинация
        */
        let pagination = document.querySelector('#pagination');
        /**
         * items - массив страниц
        */
        let items = [];
        // цикл для создания страниц пагинации
        for (let i = 1; i <= countPagination; i++) {
            // создаем номер страницы
            /**
             * liPagination - номер страницы
            */
            let liPagination = document.createElement('li');
            // добавляем класс к номеру страницы
            liPagination.classList.add('completed-task__li');
            // добавляем цифру к странице
            liPagination.innerHTML += i;
            // добавляем в пагинацию номер страницы
            pagination.appendChild(liPagination);
            // записываем в номер страницы в массив
            items.push(liPagination);
        }
        /**
         showPage - функция отображения таблицы с данными из файла json
        */
        let showPage = (function() {
            /**
             * activeLi - посещенная страница
            */
            let activeLi;
            // отображаем талицу по страницы
            return function(item) {
                /**
                 * pageNum - номер страницы таблицы
                */
                let pageNum = +item.innerHTML;
                // проверка на посещение страницы
                if(activeLi) {
                    // удаляем класс активности страницы, у всех страниц
                    activeLi.classList.remove('completed-task__li_active');
                    // ищем активное модальное окно и за писываем в modal
                    /**
                     * modal - модальное окно;
                    */
                    let modal = document.querySelector('.completed-task__modal_active');
                    // если modal - true, то удаляем класс активности у модального окна
                    if(modal) {
                        modal.classList.remove('completed-task__modal_active');
                    }
                }
                // записываем посещенную страницу
                activeLi = item;
                // делаем посещенную страницу активной
                item.classList.add('completed-task__li_active');
                // получаем первого пользователя
                /**
                 * start - первый пользователь;
                */
                let start = (pageNum - 1) * usersOnPage;
                // получаем последнего пользователя
                /**
                 * start - последний пользователь;
                 */
                let end = start + usersOnPage;
                // берем пользователей из файла json от start до end
                /**
                 * usersSlice - пользователи на странице от start до end;
                */
                let usersSlice = data.slice(start, end);
                // очищаем тело таблицы
                tbody.innerHTML = '';
                // проходим по всем пользователям
                usersSlice.forEach((item, index) => {
                    // создаем строку таблицы
                    /**
                     * row - строка таблицы с данными пользователя;
                    */
                    let row = document.createElement('tr');
                    // добавляем row класс
                    row.classList.add('table__rows');
                    // добавляем row ячейки
                    row.innerHTML = `<td class="table__cell table__cell_width">${item.name.firstName}</td>
                             <td class="table__cell table__cell_width">${item.name.lastName}</td>
                             <td class="table__cell table__cell-about">
                                ${item.about}
                             </td>
                             <td id="${index}" class="table__cell table__cell_width cell" style="background-color: ${item.eyeColor}">
                             </td>`;
                    // добавляем в тело таблицы строки
                    tbody.appendChild(row);
                });
                // вызавыем функцию редактирования
                editing();
            };
        }());
        // вызываем функцию отображения таблицы на первой странице
        showPage(items[0]);
        // перебор массива с элементами пагинации
        items.forEach((item) => {
            // вешаем клик на каждый элемент пагинации
            item.addEventListener('click', () => {
                // вызываем функцию отображения таблицы на той странице, по которой был произведен клик
                showPage(item);
            })
        })
    })
}
// вызываем функцию талицы
tableTask();

/**
 функция сортировки
 * colNum - столбец, по которому проходит сортировка тиблицы;
 * type - тип столбца, который определяет по какому типу сортировать таблицу;
 * sorted - определения направления сортировки;
*/
function sortTable(colNum, type, sorted) {
    // получаем тело таблицы по id
    /**
     * tbody - тело таблицы по id;
    */
    let tbody = document.getElementById('tbody');
    // получаем массив строк таблицы
    /**
     * rowsArray - массив строк таблицы;
    */
    let rowsArray = Array.from(tbody.rows);
    //
    /**
     * compare - функция сравнения значения элементов;
    */
    let compare;
    // проверка на тип
    switch (type) {
        // сравниваем ячейки строк по типу - string
        case 'string':
            compare = function(rowA, rowB) {
                // если ячейка первой строки больше, то возвращаем -1, если меньше, то возвращаем 1
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? -1 : 1;
            }
            break;
        // сравниваем ячейки строк по типу - color
        case 'color':
            compare = function(rowA, rowB) {
                // если ячейка первой строки больше, то возвращаем -1, если меньше, то возвращаем 1
                return rowA.cells[colNum].style.cssText > rowB.cells[colNum].style.cssText ? -1 : 1;
            }
            break;
    }
    // сортировка строк по столбцам
    rowsArray.sort(compare);
    // проверка сортироки по колонке, если сортировка была по этой колонке, то сортируем в обратном направлении
    if(sorted) {
        rowsArray.reverse();
    }
    // добавляем в тело таблицы отсортированные элементы
    tbody.append(...rowsArray);
}

/**
 * tableTh - функция определения сортировки по столбцу
*/
function tableTh() {
    // получаем таблицу по id
    /**
     * table - таблица по id;
    */
    const table = document.getElementById('table');
    /**
     * index - индекс для сортировки, отсортирована ли таблица;
    */
    let index = -1;
    // вешаем клик на таблицу
    table.addEventListener('click', (e) => {
        // проверяем, что нажатый элемент соответствует ячейке заголовку таблицы
        if(e.target.tagName === 'TH') {
            // получаем ячейку заголовка таблицы
            /**
             * th - ячейка, которая хранит заголовок ячейки таблицы, по которому был клик;
            */
            let th = e.target;
            /*присваеваем значение в index, если true, то -1, сортировка не производилась,
            если false, то значение индекса ячейки, сортировка производилась*/
            index = (th.cellIndex === index) ? -1 : th.cellIndex;
            /*
            вызываем функцию сортировки таблицы с параметрами:
                столбец
                тип столбца
                определения направления сортировки
            */
            sortTable(th.cellIndex, th.dataset.type, index === th.cellIndex);
        }
    })
}
// вызов функции определения сортировки по столбцу
tableTh();

/**
 функция редактирования таблицы по строке
*/
function editing() {
    /**
     * cell - элементы td в строке
    */
    let cell;
    /**
     * rows - строки таблицы
    */
    let rows = document.querySelectorAll('.table__rows');
    // перебираем сроки
    rows.forEach((elem) => {
        // вешаем на каждую строку click
        elem.addEventListener('click', () => {
            // если cell не пустая, то обнуляем значение cell
            if(cell) {
                cell = '';
            }
            // добавляем в cell элементы td из строки, по которой был произведен клик
            cell = elem.querySelectorAll('td');
            // ищем элемент с классом .completed-task__modal и записываем в modal
            /**
             * modal - модальное окно;
            */
            let modal = document.querySelector('.completed-task__modal');
            // открываем модальное окно
            modal.classList.add('completed-task__modal_active');
            // ищем элемент с id firstName и записываем в firstName
            /**
             * firstName - input с именем;
            */
            let firstName = document.getElementById('firstName');
            // ищем элемент с id lastName и записываем в lastName
            /**
             * lastName - input с фамилией;
            */
            let lastName = document.getElementById('lastName');
            // ищем элемент с id about и записываем в about
            /**
             * about - textarea с описанием;
            */
            let about = document.getElementById('about');
            // ищем элемент с id eyeColor и записываем в eyeColor
            /**
             * eyeColor - input с цветом глаз;
            */
            let eyeColor = document.getElementById('eyeColor');

            // записываем в firstName имя
            firstName.value = cell[0].innerHTML;
            // записываем в lastName фамилию
            lastName.value = cell[1].innerHTML;
            // записываем в about описание
            about.value = cell[2].innerHTML.trim();
            // записываем в about цвет глаз
            eyeColor.value = cell[3].style.backgroundColor;

            /**
             * btn - кнопка сохранения изменений;
            */
            let btn = document.querySelector('.modal__btn_save');
            // вешаем клик на кнопку и передаем значения в ячейки таблицы
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // записываем в ячейку 1 имя
                cell[0].innerHTML = firstName.value;
                // записываем в ячейку 2 фамилию
                cell[1].innerHTML = lastName.value;
                // записываем в ячейку 3 описание
                cell[2].innerHTML = about.value;
                // записываем в ячейку 4 цвет глаз
                cell[3].style.backgroundColor = eyeColor.value;
                // закрываем модальное окно
                modal.classList.remove('completed-task__modal_active');
            })
        })
    })
}
