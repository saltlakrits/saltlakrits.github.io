// schedule.js

// constants
const URL = "../data/schedule.csv";
const DAYS = 1;

// column indices
const DATE = 0;
const START = 1;
const END = 3;
const ROOM = 6;

// map keys
const TS = "timespan";
const AVAILABLE = "rooms";

// small class for making timespans
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

/** A simple CSV row parser that handles quoted fields */
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

function intToBlock(i) {
    switch (i) {
        case 0: return "[08:15 - 10:00]";
        case 1: return "[10:15 - 12:00]";
        case 2: return "[13:15 - 15:00]";
        case 3: return "[15:15 - 17:00]";
        default: return "";
    }
}

function showAvailableRooms(bigDict) {
		returnString = "";
    const sortedDates = Object.keys(bigDict).sort();
    for (const dateKey of sortedDates) {
        returnString += `[[${dateKey}]]\n`;
        const sortedBlocks = Object.keys(bigDict[dateKey]).sort((a, b) => a - b);
        for (const blockKey of sortedBlocks) {
            returnString += intToBlock(parseInt(blockKey)) + "\n";
            const availableRooms = bigDict[dateKey][blockKey][AVAILABLE];
            if (availableRooms.length > 0) {
                returnString += availableRooms.join("\n");
            } else {
                returnString += "None!\n";
            }
            returnString += "\n";
        }
    }
		document.getElementById('message-container').textContent = returnString;
}

async function main() {
    // fetch csv
    console.log("Fetching schedule data...");
    const response = await fetch(URL);
    const text = await response.text();
		console.log("Fetched data, continuing");
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

    const broadDict = {};
    const csvDataRows = unprocessedCsv.slice(4);

    for (const line of csvDataRows) {
        if (!line) continue;

        const booking = parseCsvRow(line);
        const [year, month, day] = booking[DATE].split('-').map(Number);
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const currentDate = new Date(year, month - 1, day);
        if (currentDate >= endingDate) {
            break;
        }

        const [startH, startM] = booking[START].split(':').map(Number);
        const [endH, endM] = booking[END].split(':').map(Number);
        const ts = new Timespan(year, month, day, startH, startM, endH, endM);
        
        const bookedRooms = booking[ROOM].replace(/^"|"$/g, '').split(',');

        // If we haven't seen this date before, initialize its structure
        if (!broadDict[dateKey]) {
            broadDict[dateKey] = {};
            const blocks = makeBlocks(new Date(year, month - 1, day));
            blocks.forEach((block, i) => {
                broadDict[dateKey][i] = {
                    [TS]: block,
                    [AVAILABLE]: [...ROOMS] // Create a copy of the rooms list
                };
            });
        }

        // Check for overlaps and remove booked rooms from available list
        for (const blockKey in broadDict[dateKey]) {
            if (broadDict[dateKey][blockKey][TS].overlaps(ts)) {
                for (const room of bookedRooms) {
                    const available = broadDict[dateKey][blockKey][AVAILABLE];
                    const index = available.indexOf(room);
                    if (index > -1) {
                        available.splice(index, 1);
                    }
                }
            }
        }
    }

    showAvailableRooms(broadDict);
}

main().catch(console.error);
