"use strict";


const clock = document.querySelector('#clock');
const hour = document.querySelector('#hour-hand');
const minute = document.querySelector('#minute-hand');
const second = document.querySelector('#second-hand');
const date_time = document.querySelector('#date');

/**
 * Sets clock face of analog clock.
 * @return {void}
 */
function setClockFace() {
    for (let i = 1; i <= 60; i++) {
        const digit = document.createElement('div');
        if (i % 5 === 0) {
            digit.className = 'hour';
        } else {
            digit.className = 'minute';
        };
        
        digit.style.transform = `rotate(${i * 6}deg)`

        clock.insertBefore(digit, clock.firstChild);
    }
}

setClockFace();

// Sets time and runs the clock hands.
setInterval(() => {
    const d = new Date();
    let hr = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();
    let hr_rotation = 30 * hr + min / 2;
    let min_rotation = 6 * min;
    let sec_rotation = 6 * sec;
    let days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    let day = d.getDay();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    if(hr <= 9){
        hr = `0${hr}`;
    };
   if(min <= 9){
        min = `0${min}`;
    };
    if(date <= 9){
        date = `0${date}`;
    };
   if(month <= 9){
    month = `0${month}`;
    };
  
    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;
    date_time.innerHTML = `${days[day].toUpperCase()}&ensp;|&ensp;${date}.${month}.${year}&ensp;|&ensp;${hr}:${min}`;
}, 1000);
