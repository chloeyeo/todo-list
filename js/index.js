const todoElem = document.getElementsByClassName("todo")[0];
const btnElem = document.getElementsByClassName("btn")[0];
const delAllBtnElem = document.getElementsByClassName("del-all")[0];
const viewListElem = document.getElementsByClassName("viewList")[0];
let viewList = [];

/* we use windows.localStorage to store token
when dealing with user authentication
(otherwise we have to use database which will take some time to load
whereas localStorage is fast), so localStorage is useful */

function checkItem(index) {
  // when checked = true it becomes false and vice versa
  // update viewList
  viewList[index].checked = !viewList[index].checked;

  // update localStorage database
  let jsonData = JSON.stringify(viewList);
  localStorage.setItem("todoData", jsonData);

  // update view/ui based on updated database
  listElements(); //highlight/unhighlight items in listElements aka view
}

function listElements() {
  //  get data from localStorage and put it in viewList.
  // localData is JSON data but our data isn't
  // so we have to convert JSON data back to local data format
  // using JSON.parse (= opposite of JSON.stringify)
  // before we parse the data, our code won't recognise
  // the JSON and will just treat it as a string of text just text
  // only after JSON.parse it will convert JSON back to local data
  // and our code will recognise it as what it is, an object
  if (localStorage.length > 0) {
    let storedData = localStorage.getItem("todoData");
    console.log(`This is JSON todoData: ${storedData}`);
    viewList = JSON.parse(storedData);
    console.log(`This is parsed local todoData: ${viewList}`);
  }

  let textList = "";
  for (let i = 0; i < viewList.length; i++) {
    // highlightItem(i);
    if (viewList[i].checked) {
      textList += `<li class="active"><div class='listed-item'>${viewList[i].title}</div><a onClick="checkItem(${i})">`;
      textList += `<i class="fa-regular fa-square-check"></i>`;
    } else {
      textList += `<li><div class='listed-item'>${viewList[i].title}</div><a onClick="checkItem(${i})">`;
      textList += `<i class="fa-regular fa-square"></i>`;
    }
    textList += `</a><div class="del-btn" onclick="deleteSpecificElement(${i})"><i class="fa-solid fa-trash"></i></div></li>`;
  }

  if (viewList == []) {
    textList = `<li><div>Nothing to do today!</div></li>`;
  }
  viewListElem.innerHTML = textList;
}

function deleteAll() {
  viewListElem.innerHTML = "";
  viewList = [];
}

function addElement() {
  if (todoElem.value != "") {
    let value = { title: todoElem.value, checked: false };
    viewList.push(value);
    // we also have to put value into windows.localstorage as
    // JSON data using stringify
    // stringify will convert value = {} into JSON
    // so that we store the JSON in windows.localstorage

    // convert to JSON data. JSON data has fields as strings too.
    let valueData = JSON.stringify(viewList);
    console.log(
      `this is the stringified JSON data of viewList width added item: ${valueData}`
    );

    localStorage.setItem("todoData", valueData); // update localStorage

    // when reload page, the listed items in UI will disappear
    // but what we stored in localStorage will still remain

    // so then we get data from windows.localStorage
    // and put this data into viewList.
    todoElem.value = "";
  } else {
    alert("Please type in what to do today");
    todoElem.focus(); // = input bar 깜빡깜빡 effect
  } // The focused element is the element that will receive keyboard and similar events by default
  listElements(); //update ui/ show list in view
}

function deleteSpecificElement(index) {
  viewList.splice(index, 1); // splice removes 1 element in viewList at index
  let jsonData = JSON.stringify(viewList);
  localStorage.setItem("todoData", jsonData); // update database

  listElements(); // update view (from updated database)
}

// addElement and deleteAll are callback functions
// i.e. they are only called 'on click'
btnElem.addEventListener("click", addElement);
btnElem.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // i.e. if key pressed is the enter key
    addElement();
  }
}); // 1. why is this not working...?
// 2. also in github pages the css is not showing up at all - why is this?
delAllBtnElem.addEventListener("click", deleteAll);
