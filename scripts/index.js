let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let videoLinks;
let qDatesObject;
let btnMonth = document.getElementById("btn-month");
let btnYear = document.getElementById("btn-year");
let btnAbout = document.getElementById("nav-about");
let monthContainer = document.getElementById("select-month-container");
let yearContainer = document.getElementById("select-year-container");
let aboutContainer = document.getElementById("about-container");
let calendarDates = document.getElementById("calendar-date");
let date = new Date();
let thisMonth = date.getMonth();
let thisYear = date.getFullYear();

function setCalendar(year, month) {
  let curDate = new Date(year, month);

  //to find the starting day of current month like sunday or monday ...
  curDate.setDate(1);
  //current month starting day
  let curFirstDay = curDate.getDay();

  console.log(curFirstDay);
  console.log(curDate);

  //dates will be the div elements
  let dates = "";
  //initializing the start date and end date of the given month
  //Passing month+1, 0 as 2nd, 3rd argument of Date(year, month, date) will return the last date of current month
  let startDate = 1;
  let endDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + 1,
    0
  ).getDate();

  //to find the end day of current month like sunday or monday ...
  curDate.setDate(endDate);
  let curEndDay = curDate.getDay();
  console.log(curEndDay);

  //For finding previous month end date
  let preEndDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    0
  ).getDate();

  //days name Sun, Mon, Tue, Wed, Thu, Fri, Sat
  for (let i = 0; i < 7; i++) {
    dates = dates + `<div>${daysName[i]}</div>`;
    calendarDates.innerHTML = dates;
  }

  //previous month leftover dates
  for (let i = curFirstDay; i > 0; i--) {
    dates = dates + `<div class="prev" id="prev">${preEndDate - i + 1}</div>`;
    calendarDates.innerHTML = dates;
  }

  //current month dates
  for (let i = startDate; i <= endDate; i++) {
    dates =
      dates +
      `<div class="current" id="${i}">${i}<div class="event-container" id="event-container"></div></div>`;
    calendarDates.innerHTML = dates;
  }

  //next month leftover dates
  for (let i = 1; i <= 6 - curEndDay; i++) {
    dates = dates + `<div class="next" id="next">${i}</div>`;
    calendarDates.innerHTML = dates;
  }

  //Getting the month from year array
  //let quotidianList = arrayOfYearArray[year - 2021][month];
  let quotidianList = qDatesObject[0][year][month];

  //Traversing the month array
  for (let i = 0; i < quotidianList.length; i++) {
    //splitting the string "2:Q123" with split(":") so we get an array as ["2", "Q123"]
    //Where "2" is the date and "Q123" is the quotidian number
    let s = quotidianList[i].split(":");
    let qDate = s[0];
    let qNo = s[1];
    console.log(qDate);
    console.log(qNo);
    //Getting the needed element by using Id and ClassName
    let quotidian = document
      .getElementById(qDate)
      .getElementsByClassName("event-container")[0];
    quotidian.innerHTML += `<span class="event" style="background-color:#fc5c65;" onclick="openVideo('${qNo}')">${qNo}</span>`;
  }

  let today = new Date();
  if (today.getMonth() === month && today.getFullYear() === year) {
    setTodayBorder(date.getDate());
  }
}

//Buttons
btnMonth.addEventListener("click", () => {
  monthContainer.classList.add("show");
});

btnYear.addEventListener("click", () => {
  yearContainer.classList.add("show");
});

btnAbout.addEventListener("click", () => {
  aboutContainer.classList.add("show");
});

monthContainer.addEventListener("click", () => {
  monthContainer.classList.remove("show");
});

yearContainer.addEventListener("click", () => {
  yearContainer.classList.remove("show");
});

aboutContainer.addEventListener("click", () => {
  aboutContainer.classList.remove("show");
});

function monthFunc(monthInd) {
  btnMonth.innerHTML = months[monthInd];
  thisMonth = monthInd;
  setCalendar(thisYear, thisMonth);
  console.log(monthInd);
}

function yearFunc(year) {
  btnYear.innerHTML = year;
  thisYear = year;
  setCalendar(thisYear, thisMonth);
  console.log(year);
}

function setNextQuotidianText(year, month, currentDate) {
  let s = qDatesObject[0][year][month];
  let len = s.length;
  for (let i = 0; i < len; i++) {
    let a = s[i].split(":");
    let qDate = a[0];
    let qNo = a[1];
    if (currentDate == qDate) {
      document.getElementById(
        "hint-text"
      ).innerHTML = `Today ${months[month]} ${qDate} is a Quotidian Day `;
      break;
    } else if (currentDate < qDate) {
      document.getElementById(
        "hint-text"
      ).innerHTML = `Next Quotidian ${qNo} will be on ${months[month]} ${qDate}`;
      break;
    }

    if (i + 1 === len) {
      if (month === 11) {
        if (year === 2030) {
          document.getElementById("hint-text").innerHTML = `Sayonara`;
        }
        setNextQuotidianText(year + 1, 0, -1);
      }
      setNextQuotidianText(year, month + 1, -1);
    }
  }
}

function setTodayBorder(date) {
  document.getElementById(date).style.border = `2px solid #f25757`;
  document.getElementById(date).style.borderRadius = `15px`;
}

function fetchQuotidianDates() {
  let http = new XMLHttpRequest();

  http.open("get", "data/quotidianDates.json", true);

  http.send();

  http.onload = function () {
    if (this.readyState == 4 || this.status == 200) {
      //console.log(this.responseText);
      qDatesObject = JSON.parse(this.responseText);
      console.log("index\n", qDatesObject[0][2022]);
      //console.log(qDatesObject["0"]["2021"]["0"][1]);
      let date = new Date();
      setCalendar(date.getFullYear(), date.getMonth());
      setNextQuotidianText(date.getFullYear(), date.getMonth(), date.getDate());
    }
  };
}

function fetchVideoLinks() {
  let http = new XMLHttpRequest();
  http.open("get", "data/quotidianVideoLinks.json", true);
  http.send();

  http.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
      videoLinks = JSON.parse(this.responseText);
      console.log("LoadedYes");
    }
  };
}

function openVideo(qNo) {
  let videoNo = qNo.slice(1);
  console.log(videoNo);
  if (videoLinks[0][videoNo] != undefined) {
    window.open(videoLinks[0][videoNo]);
  } else {
    alert("Not uploaded yet!!");
  }
}

window.addEventListener("load", function () {
  let date = new Date();
  fetchVideoLinks();
  fetchQuotidianDates();
  month = date.getMonth();
  year = date.getFullYear();
  document.getElementById("btn-month").innerHTML = months[month];
  document.getElementById("btn-year").innerHTML = year;
});
