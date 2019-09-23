const API_KEY = "8b42a0c0-d56a-11e9-86e9-6733b6ff9504";
const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;

const galleries = document.querySelector("#galleries");
const allObjects = document.querySelector("#all-objects");
const allGalleries = document.querySelector("#all-galleries");
const objects = document.querySelector("#objects");
const objectview = document.querySelector("#object-view");
const objectinfo = document.querySelector("#objectinfo");
const searchResults = document.querySelector("#searchResults");
const searchOption = document.querySelector("#searchOption");
const searchVal = document.querySelector("usersearch");
const button = document.querySelector("#gobackbutton");
const button1 = document.querySelector("#objecttablebackbutton");
const button2 = document.querySelector("#objectviewbackbutton");
const floorOption = document.querySelector("#floorList");
const objectContainer = document.querySelector('#object');
const fObject = document.querySelector("#fObject");

function load() {
  let hash = (window.location.hash).replace('#', '');
  let site = window.location.href.slice(57);
  if (site == "favorites.html") {
    showFavs();
  }
  else if (site == "search.html") {
    //showSearch();
  }
  else {
      showGalleries(url);
  }
}


window.onload = load;

function showGalleries(url) {
  allObjects.style.display = "none";
  allGalleries.style.display = "block";
  objectview.style.display = "none";
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((gallery) => {
      galleries.innerHTML += `
        <li class="list-group-item">
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });

    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showGalleryFloor(url) {
  allObjects.style.display = "none";
  allGalleries.style.display = "block";
  objectview.style.display = "none";
  let e = document.getElementById("floorList");
  let floor = e.options[e.selectedIndex].value;
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((gallery) => {
      if(floor == "all" || gallery.floor == floor) {
      galleries.innerHTML += `
      <li class="list-group-item">
        <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
          Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
        </a>
      </li>
      `;
      }
    });

    if (data.info.next) {
      showGalleryFloor(data.info.next);
    }
  });
}

function clearHtml() {
  galleries.innerHTML = "";
}

function clearHtmlS() {
  searchResults.innerHTML = `<th>Title</th>
  <th>Description</th>
  <th>Provenance</th>
  <th>Accession Year</th>
  <th>Image</th>
  <th>Favorite</th>`;
}

function addFav(objnum) {
  let info = JSON.parse(window.localStorage.getItem('info'));
  if(info) {
    info.favs.push(objnum);
    console.log("added to existing favs list");
  }
  else {
    info = {favs : [objnum]};
    console.log("created new favs list");
  }
  window.localStorage.setItem('info', JSON.stringify(info));
}

function search(searchVal) {
  let sOption = getRadioVal(searchOption, 'options');
  switch (sOption) {
  case "objectSearch" : searchobjnum(searchVal); 
  case "titleSearch" : searchobjtitle(searchVal);
  case "cultureSearch" : searchobjculture(searchVal);
  case "personSearch" : searchobjperson(searchVal);
  case "keywordSearch" : searchobjkeyword(searchVal);
  break;
  default : alert("Please select a searchtype"); console.log(sOption);
  }
}

function getRadioVal(form, name) {
  var val;
  // get list of radio buttons with specified name
  var radios = form.elements[name];
  
  // loop through list of radio buttons
  for (var i=0, len=radios.length; i<len; i++) {
      if (radios[i].checked ) { // radio checked?
          val = radios[i].value; // if so, hold its value in val
          break; // and break out of for loop
      }
  }
  return val; // return value of checked radio or undefined if none checked
}

function searchobjnum(objnum){
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${objnum}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("I loaded favs");
        checkVar = (info.favs.includes(obj.objectnumber));
      }
      else {
        console.log("could not load favs");
      }
      searchResults.innerHTML += `
      <tr>
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
        <td><input type="checkbox" onclick="check('${obj.objectnumber}', ${checkVar})"></td>
      </tr>
    `;
    });
  });
}

function searchobjtitle(objtitle){
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&title=${objtitle}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("I loaded favs");
        checkVar = (info.favs.includes(obj.objectnumber));
      }
      else {
        console.log("could not load favs");
      }
      searchResults.innerHTML += `
      <tr>
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
        <td><input type="checkbox" onclick="check('${obj.objectnumber}', ${checkVar})"></td>
      </tr>
    `;
    });
  });
}

function searchobjculture(objculture){
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&culture=${objculture}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("I loaded favs");
        checkVar = (info.favs.includes(obj.objectnumber));
      }
      else {
        console.log("could not load favs");
      }
      searchResults.innerHTML += `
      <tr>
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
        <td><input type="checkbox" onclick="check('${obj.objectnumber}', ${checkVar})"></td>
      </tr>
    `;
    });
  });
}

function searchobjperson(objperson){
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&person=${objperson}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("I loaded favs");
        checkVar = (info.favs.includes(obj.objectnumber));
      }
      else {
        console.log("could not load favs");
      }
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `        
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
      `;

      //console.log(child);
      let newCheck = document.createElement("input");
      newCheck.type = "checkbox";
      if (info.favs.includes(obj.objectnumber)) {
        newCheck.checked = true;
      }
      newCheck.onclick = check(obj.objectnumber, checkVar);
      newCheckBox = document.createElement("td");
      newCheckBox.appendChild(newCheck);
      tableRow.appendChild(newCheckBox);
      searchResults.appendChild(tableRow);
    });
  });
}

function searchobjkeyword(objkey){
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&keyword=${objkey}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("I loaded favs");
        checkVar = (info.favs.includes(obj.objectnumber));
      }
      else {
        console.log("could not load favs");
      }
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `        
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
      `;

      //console.log(child);
      let newCheck = document.createElement("input");
      newCheck.type = "checkbox";
      if (info.favs.includes(obj.objectnumber)) {
        newCheck.checked = true;
      }
      newCheck.onclick = check(obj.objectnumber, checkVar);
      newCheckBox = document.createElement("td");
      newCheckBox.appendChild(newCheck);
      tableRow.appendChild(newCheckBox);
      searchResults.appendChild(tableRow);
    });
  });
}


function showFavs(){
  let info = JSON.parse(window.localStorage.getItem('info'));
  if (info) {
    info.favs.forEach((objnum) => {
    fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${objnum}`)
    .then((response) => response.json())
    .then((data) => {
      data.records.forEach((obj) => {
        fObject.innerHTML += `
          <tr>
            <td>${obj.title}</td>
            <td>${obj.description}</td>
            <td>${obj.provenance}</td>
            <td>${obj.accessionyear}</td>
            <td><img src=${obj.primaryimageurl}></td>
          </tr> `;
        });})})}
  else {
  fObject.innerHTML += `<h1>No Favorites<\h1>`
  }
}

function removeFav(objnum) {
  let info = JSON.parse(window.localStorage.getItem('info'));
  for(var i = info.favs.length - 1; i >= 0; i--) {
    if(info.favs[i] === objnum) {
       info.favs.splice(i, 1);
    }
  }
  window.localStorage.setItem('info', JSON.stringify(info));
}


function deleteAllFav() {
  window.localStorage.clear();
}

/**
 * Checks if the favorites checkbox is checked for a given object id
 * @param {*} obj 
 */
function check(objnum, isChecked) {
  let info = JSON.parse(window.localStorage.getItem('info'));
  if (!isChecked) {
    console.log("check called add");
    if(info) {
      info.favs.push(objnum);
      console.log("added to existing favs list");
    }
    else {
      info = {favs : [objnum]};
      console.log("created new favs list");
    }
    window.localStorage.setItem('info', JSON.stringify(info));
  }
  else {
    console.log("the shit was checked");
    for(var i = info.favs.length - 1; i >= 0; i--) {
      if(info.favs[i] === objnum) {
         info.favs.splice(i, 1);
      }
    }
    window.localStorage.setItem('info', JSON.stringify(info));
  }
}
/**
 * Shows all the objects in the gallery of the given id
 * @param {*} id 
 */
function showObjectsTable(id) {
  allObjects.style.display = "block";
  allGalleries.style.display = "none";
  objectview.style.display = "none";
  let storageId = `${id}`;
  let objArray = {array : []};
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((object) => {
      let objElement = document.createElement("tr");
      objElement.innerHTML = `
      <td><a href="#${object.objectnumber}" onclick="showObjectInfo('${object.objectnumber}');">${object.title}</a></td>
        <td><img src=${object.primaryimageurl}></td>
        <td>${object.people ? object.people.map(x => x.name): "Unknown"}</td>
        <td><a href="${object.url}" target="_blank">Click to visit page</a></td>
      `;
      objArray.array.push(objElement);
      objects.appendChild(objElement);
      /**objects.innerHTML += `
      <tr>
      <td><a href="#${object.objectnumber}" onclick="showObjectInfo('${object.objectnumber}');">${object.title}</a></td>
        <td><img src=${object.primaryimageurl}></td>
        <td>${object.people ? object.people.map(x => x.name): "Unknown"}</td>
        <td><a href="${object.url}" target="_blank">Click to visit page</a></td>
      </tr>
    `;**/
    });
    window.localStorage.setItem(storageId, objArray);
    button1.innerHTML += `<input type="button" class = "btn btn-outline-success ml-3" value="Go Back" onclick="window.location.href='index.html'">`
  });
}

/**
 * This function shows individual object information after clicking on an object's name within a gallery,
 * favorite, or search list.
 * @param {*} id 
 */
function showObjectInfo(id) {
  allObjects.style.display = "none";
  allGalleries.style.display = "none";
  objectview.style.display = "block";
  let info = JSON.parse(window.localStorage.getItem('info'));
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${id}`)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((obj) => {
      let checkVar = false;
      if (info) {
        console.log("favs was loaded");
        checkVar = (info.favs.includes(obj.objectnumber));
        if(checkVar) {
          console.log("I am in favs");
        }
      }
      else {
        console.log("could not load favs");
      }
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `        
        <td>${obj.title}</td>
        <td>${obj.description}</td>
        <td>${obj.provenance}</td>
        <td>${obj.accessionyear}</td>
        <td><img src=${obj.primaryimageurl}></td>
      `;

      //console.log(child);
      let newCheck = document.createElement("input");
      newCheck.type = "checkbox";
      if (info.favs.includes(obj.objectnumber)) {
        newCheck.checked = true;
      }
      newCheck.onclick = check(obj.objectnumber, checkVar);
      newCheckBox = document.createElement("td");
      newCheckBox.appendChild(newCheck);
      tableRow.appendChild(newCheckBox);
      objectinfo.appendChild(tableRow);
    });
    button2.innerHTML += `<input type="button" class = "btn btn-outline-success ml-3" value="Go Back" onclick="window.location.href='index.html'">`
  });
}
