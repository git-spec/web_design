'use strict';


const carousel = document.querySelector('#carousel');
const clock = document.querySelector('#clock');
const dayGB = document.querySelector('#day_wrapper p:first-child');
const dayDE = document.querySelector('#day_wrapper p:last-child');
const dateTime = document.querySelector('#date_wrapper div:last-child');
const daysDE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const daysGB = ['Saturday', 'Monday', 'tuesday', 'wednesday', 'Thursday', 'Friday', 'Sunday'];
const interval = 15000;
const timeout = 200;
const sliderTrans = '2s';
const textTrans = '1.5s';
let counter = 0;
let flag = true;
const arrObj = Array();
const arrItems = [];
arrItems[0] = new Array('2024.01.01 00:00:00','2024.07.31 00:00:00','7545','Ausstellung','Hamburg - das Tor zur Welt','Hamburg - The gate to the world','Hamburg_dasTorZurWelt.png');	
arrItems[1] = new Array('2024.03.01 00:00:00','2024.08.31 00:00:00','5652','Ausstellung','Ebbe und Flut','Tides','EbbeUndFlut.png');
arrItems[2] = new Array('2024.04.01 09:00:00','2024.09.31 10:30:00','7545','Veranstaltung','Führung: Hamburg - das Tor zur Welt','Guided Tour: Hamburg - The gate to the world','Hamburg_dasTorZurWelt.png');	
arrItems[3] = new Array('2024.07.01 00:00:00','2024.12.31 00:00:00','6777','Ausstellung','Sturmflut - Ein Stadtteil unter Wasser','Storm surge - A district under water','Sturmflut_EinStadtteilUnterWasser.png');	
arrItems[4] = new Array('2024.04.01 00:00:00','2024.05.31 00:00:00','8888','Ausstellung','Hafenklänge','Voices of the Harbor','Hafenklaenge.png');	
arrItems[5] = new Array('2024.04.07 12:30:00','2024.06.31 14:30:00','4554','Veranstaltung','Führung: Hamburg - eine Stadt im Wandel','Guided Tour: Hamburg - a timelapse of a town','Hamburg_eineStadtIm Wandel.png');	
arrItems[6] = new Array('2022.02.01 00:00:00','2022.04.25 00:00:00','1452','Ausstellung','Dichter und Denker','Poets and thinkers','DichterUndDenker.png');
arrItems[7] = new Array('2024.04.07 00:00:00','2024.06.31 00:00:00','4554','Ausstellung','Hamburg - eine Stadt im Wandel','Hamburg - a city in transformation','Hamburg_eineStadtIm Wandel.png');

/**
 * Sets current time, date and weekday.
 * @return {void}
 */
function setTime() {
    const d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let day = d.getDay();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    if(hours <= 9){
        hours = `0${hours}`;
    };
   if(minutes <= 9){
        minutes = `0${minutes}`;
    };
    if(date <= 9){
        date = `0${date}`;
    };
   if(month <= 9){
    month = `0${month}`;
    };

    clock.innerHTML = `${hours}:${minutes}`;
    dayGB.innerHTML = `${daysGB[day].toUpperCase()}`;
    dayDE.innerHTML = `${daysDE[day].toUpperCase()}`;
    dateTime.innerHTML = `${date}.${month}.${year}`;
}
setInterval(setTime, 1000);

/**
 * Sorts array of data by end date and matching number.
 * @param {Array} arr
 * @return {Array}
 */
 function sortArr(arr) {
    arr.sort((a, b) => Number(a[0].split(' ')[0].split('.').join('')) - Number(b[0].split(' ')[0].split('.').join('')));
    arr.forEach((el, index) => {
        for (let i = index + 1; i < arr.length; i++) {
            if (el[2] == arr[i][2] && el[3].toLowerCase() === 'ausstellung') {
                const moveItem = arr.splice(i, 1)[0];
                arr.splice(index + 1, 0, moveItem);
            } else if (el[2] == arr[i][2] && el[3].toLowerCase() === 'veranstaltung') {
                const moveItem = arr.splice(i, 1)[0];
                arr.splice(index, 0, moveItem);
            };
        };
    });

    return arr;
}

/**
 * Changes array of data to array of objects.
 * @param {Array} arr
 * @return {Array[Object]}
 */
 function changeToObj(arr) {
    arr.forEach(el => {
        const obj = Object();

        obj.startDate = el[0].split(' ')[0].split('.').reverse().join('.');
        obj.startTime = el[0].split(' ')[1];
        obj.endDate = el[1].split(' ')[0].split('.').reverse().join('.');
        obj.endTime = el[1].split(' ')[1];
        obj.matchingNum = el[2];
        obj.event = el[3];
        obj.nameDE = el[4];
        obj.nameGB = el[5];
        obj.image = el[6];
        arrObj.push(obj)
    });

    return arrObj;
}

/**
 * Deletes events in the past.
 * @param {Array[Object]} events
 * @return {Array[Object]}
 */
 function deletePastEvent(events) {
    const cleanedUp = events.filter(el => {
        const date = new Date(el.endDate.split('.').reverse().join('-'));
        
        return date.getTime() > (Math.floor(Date.now() / 100000) * 100000) && el;
    });
    events = cleanedUp;

    return events;
}

/**
 * Sets carousel with sliding elements to DOM.
 * @param {Array[Object]} arr
 * @return {HTMLElement}
 */
function setListOfItems(arr) {
    const list = document.createElement('ul');

    arr.forEach(el => {
        const item = document.createElement('li');
        const image = document.createElement('img');
        const textContainer = document.createElement('div');
        const textWrapper = document.createElement('div');
        const period = document.createElement('p');
        const headlineWrapper = document.createElement('div');
        const headlineDE = document.createElement('p');
        const headlineGB = document.createElement('p');

        image.src = `./img/${el.image}`;
        period.innerText = `${el.startDate} - ${el.endDate}`;
        period.className = 'period';
        if (el.event.toLowerCase() == 'veranstaltung') {
            let startTime = el.startTime.substring(0, el.startTime.lastIndexOf(':'));
            const start = startTime.startsWith('0') ? startTime.substring(1) : startTime;
            headlineGB.innerText = `${el.nameGB.substring(0, el.nameGB.indexOf(':'))} starts at ${start}`;
            headlineDE.innerText = `${el.nameDE.substring(0, el.nameDE.indexOf(':'))} startet um ${start}`;
        } else {
            headlineGB.innerText = el.nameGB;
            headlineDE.innerText = el.nameDE;
        }
        headlineGB.className = 'headline_gb';
        headlineDE.className = 'headline_de';

        headlineWrapper.appendChild(headlineGB);
        headlineWrapper.appendChild(headlineDE);
        headlineWrapper.className = 'headline_wrapper';
        textWrapper.appendChild(period);
        textWrapper.appendChild(headlineWrapper);
        textWrapper.className = 'text_wrapper color';
        textContainer.appendChild(textWrapper);
        for (let x = 0; x < 2; x++) {
            const bar = document.createElement('div');
            bar.className = 'bar color';
            textContainer.appendChild(bar);
        }
        textContainer.className = 'text_container';

        item.appendChild(image);
        item.appendChild(textContainer);
        item.dataset.matchingNum = el.matchingNum;
        item.className = 'carousel_items';
        list.appendChild(item);

    });
    list.id = 'carousel_container';

    return list;
}
carousel.appendChild(setListOfItems(deletePastEvent(changeToObj(sortArr(arrItems)))), carousel.firstChild);

/**
 * Creates endless carousel.
 * @return {void}
 */
function slideItems() {
    let itemList = document.querySelector('#carousel_container');
    const size = document.querySelector('#carousel').clientWidth;
    const firstClone = itemList.firstElementChild.cloneNode(true);
    itemList.appendChild(firstClone);

    setInterval(() => {
        // Changes language of day.
        dayDE.classList.toggle('show_DE');
        dayGB.classList.toggle('show_GB');

        // Changes language of events and afterward slides them.
        if (counter <= itemList.children.length - 1) {
            if (flag) {
                itemList.children[counter].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.transition = `opacity ${textTrans} ease-in-out`;
                itemList.children[counter].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.transition = `opacity ${textTrans} ease-in-out`;
                itemList.children[counter].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.opacity = '1';
                itemList.children[counter].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.opacity = '0';
                counter++;
                flag = false;
            } else {
                itemList.style.transform = `translateX(${-size * counter}px)`;
                itemList.style.transition = `transform ${sliderTrans} ease-in-out`;
                flag = true;
            }
        } else if (counter > itemList.children.length - 1) {
            if (flag) {
                itemList.children[counter - 1].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.transition = `opacity ${textTrans} ease-in-out`;
                itemList.children[counter - 1].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.transition = `opacity ${textTrans} ease-in-out`;
                itemList.children[counter - 1].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.opacity = '1';
                itemList.children[counter - 1].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.opacity = '0';
                flag = false;
            } else {
                itemList.style.transition = 'none';
                counter = 0;
                itemList.style.transform = `translateX(${-size * counter}px)`;
                for (let i = 1; i < itemList.children.length; i++) {
                    itemList.children[i].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.transition = `none`;
                itemList.children[i].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.transition = `none`;
                itemList.children[i].lastElementChild.firstElementChild.lastElementChild.firstElementChild.style.opacity = '0';
                itemList.children[i].lastElementChild.firstElementChild.lastElementChild.lastElementChild.style.opacity = '1';
                }
                setTimeout(() => {
                    counter++;
                    itemList.style.transform = `translateX(${-size * counter}px)`;
                    itemList.style.transition = `transform ${sliderTrans} ease-in-out`;
                    flag = true;
                }, timeout);
            }
        }

        // Deletes past events.
        const currEvents = deletePastEvent(arrObj);
        const matchings = currEvents.map(el => el.matchingNum);
         
        if (currEvents.length < itemList.children.length - 1) {
            for (const item of itemList.children) {
                !matchings.includes(item.dataset.matchingNum) && item.remove();
            }
            if (itemList.firstElementChild.dataset.matchingNum !== itemList.lastElementChild.dataset.matchingNum) {
                const firstClone = itemList.firstElementChild.cloneNode(true);
                itemList.appendChild(firstClone);
            }
        }   
    }, interval);
}

slideItems();