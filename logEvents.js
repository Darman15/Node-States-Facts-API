const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

// log Events function receives a message
const logEvents = async (message) => {
  // Setting the date for the log files to show exact date and time
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  // dateTime is loged into log item with a uniqe id paired to each event along with the message
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
      if(!fs.existsSync(path.join(__dirname, 'logs'))) {
          await fsPromises.mkdir(path.join(__dirname, 'logs'));
      }

    // creates and adds to a eventLog file and writes the logItem we created above
    await fsPromises.appendFile(path.join(__dirname, "logs", "eventLog.txt"), logItem);
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;
