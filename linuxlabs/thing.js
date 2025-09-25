// console.log(document.documentElement.className);

// constants
//const URL = "../data/schedule.csv";
const URL = "https://saltlakrits.github.io/data/schedule.csv";
const DAYS = 14;

// column indices
const DATE = 0;
const START = 1;
const END = 3;
const ROOM = 6;

// map keys
const TS = "timespan";
const AVAILABLE = "rooms";

// FIXME Change to temporal, apparently Date is legacy smh

// small class for making timespans and seeing if they overlap
class Timespan {
    constructor(year, month, day, startH, startM, endH, endM) {
        this.start = new Date(year, month - 1, day, startH, startM);
        this.end = new Date(year, month - 1, day, endH, endM);
    }

    /** Returns true if this and another timespan overlap */
    overlaps(other) {
        return this.start < other.end && this.end > other.start;
    }
}

// returns all the usual lecture timeblocks for the date
function makeBlocks(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [
        new Timespan(year, month, day, 8, 15, 10, 0),
        new Timespan(year, month, day, 10, 15, 12, 0),
        new Timespan(year, month, day, 13, 15, 15, 0),
        new Timespan(year, month, day, 15, 15, 17, 0),
    ];
}

// the csv needs to split by comma (obv), but the room column
// is sometimes quoted if the booking is for more than one room.
// this takes care of that
function parseCsvRow(line) {
    const result = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField);
    return result;
}

// just matches the index to the time block for printing
function intToBlock(i) {
    switch (i) {
        case 0: return "[08:15 - 10:00]";
        case 1: return "[10:15 - 12:00]";
        case 2: return "[13:15 - 15:00]";
        case 3: return "[15:15 - 17:00]";
        default: return "";
    }
}

// when all is said and done we want to loop through the map
// and print out all the rooms that weren't booked during the dates
// and timeblocks we checked
function showAvailableRooms(bigDict) {
		returnString = "";
		// big outer container (flex)
		const container = document.getElementById('container');
		container.classList.add('outer-flex');
    const sortedDates = Object.keys(bigDict).sort();

    for (const dateKey of sortedDates) {
				// small inner container
				const inner = document.createElement('div');
				inner.classList.add('inner-flex');

				const dateHeader = document.createElement('h2');
				dateHeader.textContent = `${dateKey}`;
				container.appendChild(dateHeader);

        const sortedBlocks = Object.keys(bigDict[dateKey]).sort((a, b) => a - b);
        for (const blockKey of sortedBlocks) {
						const blockDiv = document.createElement('div');
						blockDiv.classList.add('block');

						const blockHeader = document.createElement('h3');
						blockHeader.textContent = intToBlock(parseInt(blockKey));
						blockDiv.appendChild(blockHeader);
            const availableRooms = bigDict[dateKey][blockKey][AVAILABLE];

						const roomPara = document.createElement('p');
            if (availableRooms.length > 0) {
                roomPara.textContent = availableRooms.join("\n");
            } else {
                roomPara.textContent = "None!";
            }
						blockDiv.appendChild(roomPara);
						inner.appendChild(blockDiv);
        }
				container.appendChild(inner);
    }
}

// matches the Date.getDay() int to a weekday string
function weekday(i) {
	switch (i) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
	}
}

function populatedMap(rooms) {
	const availableMap = {};


	const startDate = new Date();
	let date = new Date();
	for (let i = 0; i < DAYS; i++) {

		date.setDate(startDate.getDate() + i);
		dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		dateKey += " " + weekday(date.getDay());

		availableMap[dateKey] = {};
		const blocks = makeBlocks(date);
		blocks.forEach((block, i) => {
				availableMap[dateKey][i] = {
						[TS]: block,
						[AVAILABLE]: [...rooms] // Create a copy of the rooms list
				};
		});
	}

	return availableMap;
}

// ok go
async function main() {
    // fetch csv
    console.log("Fetching schedule data...");
    const response = await fetch(URL);
    const text = await response.text();
    const unprocessedCsv = text.split('\n');

    // make ending date
    const endingDate = new Date();
    endingDate.setDate(endingDate.getDate() + DAYS);
    endingDate.setHours(0, 0, 0, 0); // Set to beginning of the day for accurate comparison

		// find the set of all linux labs
    const roomsList = unprocessedCsv[2].split(/[,+]/);
    const roomSet = new Set();
    // trim quotes and whitespace from room names
    for (const room of roomsList.slice(0, -2)) {
        roomSet.add(room.trim().replace(/^"|"$/g, ''));
    }
    const ROOMS = Array.from(roomSet).sort();

    const availableMap = populatedMap(ROOMS);
    const csvDataRows = unprocessedCsv.slice(4);

    for (const line of csvDataRows) {
        if (!line) continue;

        const booking = parseCsvRow(line);
        const [year, month, day] = booking[DATE].split('-').map(Number);
        dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const currentDate = new Date(year, month - 1, day);
				dateKey += " " + weekday(currentDate.getDay());
        if (currentDate >= endingDate) {
            break;
        }

        const [startH, startM] = booking[START].split(':').map(Number);
        const [endH, endM] = booking[END].split(':').map(Number);
        const ts = new Timespan(year, month, day, startH, startM, endH, endM);
        
				// cancer javascript regex
        const bookedRooms = booking[ROOM].replace(/^"|"$/g, '').split(',');

        // check for overlaps and remove booked rooms from AVAILABLE list
        for (const blockKey in availableMap[dateKey]) {
            if (availableMap[dateKey][blockKey][TS].overlaps(ts)) {
                for (const room of bookedRooms) {
                    const available = availableMap[dateKey][blockKey][AVAILABLE];
                    const index = available.indexOf(room);
                    if (index > -1) {
                        available.splice(index, 1);
                    }
                }
            }
        }
    }

		// and neatly display them
    showAvailableRooms(availableMap);
}

// make spaceship go!
main().catch(console.error);
