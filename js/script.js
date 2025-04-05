const cities = {
    "cities": [
      {
        "section": "cupertino",
        "label": "Cupertino",
        "cityTimeZone": "America/Los_Angeles"
      },
      {
        "section": "new-york-city",
        "label": "New York City",
        "cityTimeZone": "America/New_York"
      },
      {
        "section": "london",
        "label": "London",
        "cityTimeZone": "Europe/London"
      },
      {
        "section": "amsterdam",
        "label": "Amsterdam",
        "cityTimeZone": "Europe/Amsterdam"
      },
      {
        "section": "tokyo",
        "label": "Tokyo",
        "cityTimeZone": "Asia/Tokyo"
      },
      {
        "section": "hong-kong",
        "label": "Hong Kong",
        "cityTimeZone": "Asia/Hong_Kong"
      },
      {
        "section": "sydney",
        "label": "Sydney",
        "cityTimeZone": "Australia/Sydney"
      }
    ]
}; 

let currentTab = null;
let intervalId = null;

// Get parent element for navigation
const navigationElement = document.querySelector(".navigation ul");

// Retrieve cities JSON data
const cityList = cities.cities;

/**
 * Loads city labels on navigation bar and set time and date on page load
 * 
 * @returns {null} 
 */
function onLoad() {
    for (let i = 0; i < cityList.length; i++) {
        const label = cityList[i].label;
    
        const childListItemElement = document.createElement("li");
        childListItemElement.className = 'menu-item';
        childListItemElement.setAttribute('data-label', `${label}`);
    
        const link = document.createElement('a');
        link.setAttribute('href', `#${label}`);
        link.className = 'menu-link ';
        if (i === 0) {
            link.className += ' current'
        }
        link.innerText = label;
    
        // Append new link element to list element
        childListItemElement.appendChild(link);
    
        // Append the new list element to the parent ul element
        navigationElement.appendChild(childListItemElement); 
    }
    
    // Create transition slider element
    const spanElement = document.createElement("span");
    spanElement.className = 'nav-slider';
    navigationElement.appendChild(spanElement);

    // Highlight city on page load based on query or empty query
    const href = window.location.href;
    const position = href.indexOf("#");
    const cityQuery = position >= 0 ? href.substring(position+1).replace(/%20/g, ' ') : '';
    const listItems = document.querySelectorAll('.navigation-menu li');
    if (cityQuery && cityQuery.length) {
        const timeZone = [...listItems].filter((listElement) => listElement.getAttribute('data-label') === cityQuery);

        setWidthAndLeft(timeZone[0]);
        timeZone[0].classList.add('active');
        setTimeAndDate(cityQuery);

    } else {
        setWidthAndLeft(listItems[0]);
        listItems[0].classList.add('active');
        currentTab= listItems[0].getAttribute('data-label');
        setTimeAndDate(currentTab);
    }
}

/**
 * Adds event listener to tab click
 * 
 * @returns {null} 
 */
function setupNavigationListClick() {
    const items = document.querySelectorAll('li.menu-item');

    items.forEach((item) => {
        item.addEventListener('click', () => {
            clearInterval(intervalId);
            document.querySelector(".content .time").innerHTML = '';
            document.querySelector(".content .date").innerHTML = '';
            items.forEach(i => i.classList.remove('active'));
            setWidthAndLeft(item);
            item.classList.add('active');
            currentTab = item.getAttribute('data-label');
            setTimeAndDate(currentTab)
        })
    });
}

/**
 * Retrieves list item's width and left positioning 
 * 
 * @param {Object} item List item element DOM
 * @returns {null}
 */
function setWidthAndLeft(item) {
    const width = item.offsetWidth;
    const left = item.offsetLeft;
    document.querySelector('span.nav-slider').style.width = `${width}px`;
    document.querySelector('span.nav-slider').style.left = `${left}px`;    
}

/**
 * Loads city labels on navigation bar and set time and date
 * 
 * @param {string} cityName A city name
 * @returns {null}
 */
function setTimeAndDate(cityName) {
    intervalId = setInterval(function() {
        const timeZone = cityList.filter((city) => city.label === cityName);
        if (timeZone && timeZone.length) {
            const time = getDateInCity(timeZone[0]?.cityTimeZone);
            const dateTimeStr = time.split(', ');
            const dateStr = dateTimeStr[0];
            const timeStr = dateTimeStr[1];
            document.querySelector(".content .time").innerHTML = timeStr;
            document.querySelector(".content .date").innerHTML = dateStr;
        }
    }, 1000)
}

/**
 * On window resize, resets width and offset left for slider
 * 
 * @returns {null} 
 */
function changeWindowSize() {
    if (currentTab !== null) {
        const findItem = [...items].filter((item) => item.dataset.label === currentTab);
        if (findItem && findItem.length) {
            setWidthAndLeft(findItem[0]);
        }
    }
}

/**
 * Returns current local time in US date format
 * 
 * @returns {null} 
 */
function getDateInCity(cityTimeZone) {
    return new Date().toLocaleString('en-US', { timeZone: cityTimeZone });
}

// Stop running setInterval if the window is not in focused
// window.addEventListener('mouseout', function() {
//     clearInterval(intervalId)
// });

window.addEventListener("resize", changeWindowSize);

onLoad();
setupNavigationListClick();