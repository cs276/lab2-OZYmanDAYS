const API_KEY = 'API KEY';
const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;

const allGalleries = document.querySelector('#all-galleries');
const galleriesContainer = document.querySelector('#galleries');
const allObjects = document.querySelector('#all-objects');
const objectDetails = document.querySelector('#object-details');
const objectContainer = document.querySelector('#object');
const objectsTableBody = document.querySelector('#objects');

// Add home buttons
document.querySelectorAll('.home').forEach((button) => {
  button.addEventListener('click', () => {
    // Clear contents of #all-galleries
    galleriesContainer.innerHTML = '';
    showGalleriesTable();
  });
});

// Get hash link, remove #
const hash = window.location.hash.slice(1);

if (hash) {

  // List objects from specified gallery
  showObjectsTable(hash);
}
else {

  // List all galleries
  showGalleriesTable();
}

function showGalleriesTable() {
  allObjects.style.display = 'none';
  objectDetails.style.display = 'none';
  allGalleries.style.display = 'block';
  showGalleries(url);
}


/**
 * Lists all galleries
 */
function showGalleries(url) {

  // Fetch list of galleries
  fetch(url)

  // Convert JSON response to JavaScript object
  .then((response) => response.json())
  .then((data) => {
    // Iterate over galleries
    data.records.forEach((gallery) => {
      // We've commented this function a bit more thoroughly to let you see the process of DOM manipualation
      // in greater detail

      // Create the link
      const a = document.createElement('a');

      // Set link properties using JavaScript instead of string concatenation
      a.setAttribute('href', `#${gallery.id}`);
      a.addEventListener('click', () => {
        showObjectsTable(gallery.id);
      });

      // Place the text inside the link
      a.append(`Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})`);

      // Add the link to the list item
      const li = document.createElement('li');
      li.append(a);

      // Add the list item to the gallery list
      galleriesContainer.append(li);
    });

    // Fetch and list more galleries if any
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  });
}


/**
 * Shows objects table and hides other divs
 */
function showObjectsTable(id) {

  // Clear contents of #objects
  objectsTableBody.innerHTML = '';

  // Show #all-objects and hide the others
  allGalleries.style.display = 'none';
  objectDetails.style.display = 'none';
  allObjects.style.display = 'block';

  // List all objects in specified gallery
  showObjects(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}`);
}


/**
 * Lists all objects in a gallery
 */
function showObjects(url) {
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.records.forEach((object) => {
      const tr = document.createElement('tr');
      const titleCell = document.createElement('td');
      const titleLink = document.createElement('a');
      titleLink.setAttribute('href', '#');
      titleLink.append(object.title);
      titleLink.addEventListener('click', () => showObjectInfo(object.id));
      titleCell.append(titleLink);

      const imgCell = document.createElement('td');
      const img = document.createElement('img');
      img.classList.add('gallery-image');
      img.setAttribute('alt', object.title);
      img.setAttribute('src', object.primaryimageurl);
      imgCell.append(img);

      const peopleCell = document.createElement('td');
      if (object.people) {
        const ul = document.createElement('ul');

        // Build ul of people names
        object.people.forEach((p) => {
          const li = document.createElement('li');
          li.append(p.name);
          ul.append(li);
        });

        peopleCell.append(ul);
      }

      const extCell = document.createElement('td');
      const extLink = document.createElement('a');
      extLink.setAttribute('href', object.url);
      extLink.append('See more');
      extCell.append(extLink);

      // Add cells to row
      tr.append(titleCell, imgCell, peopleCell, extCell);

      objectsTableBody.append(tr);
    });

    if (data.info.next) {
      showObjects(data.info.next);
    }
  });
}


/**
 * Show information about object
 */
function showObjectInfo(id) {
  fetch(`https://api.harvardartmuseums.org/object/${id}?apikey=${API_KEY}`)
  .then((response) => response.json())
  .then((object) => {
    objectContainer.innerHTML = '';
    allObjects.style.display = 'none';
    allGalleries.style.display = 'none';
    objectDetails.style.display = 'block';

    const ul = document.createElement('ul');
    ['title', 'description', 'provenance', 'accessionyear'].forEach((key) => {
      const li = document.createElement('li');
      li.append(object[key] || 'None');
      ul.append(li);
    });

    const img = document.createElement('img');
    img.setAttribute('src', object.primaryimageurl);
    img.setAttribute('alt', object.title);

    const titleItem = document.createElement('li');
    titleItem.append(object.title);
    objectContainer.append(ul, img);

  });
}
