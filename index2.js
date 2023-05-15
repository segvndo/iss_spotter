const {fetchMyIP, nextISSTimesForMyLocation, printPassTimes} = require('./iss_promised');
const request = require('request-promise-native');

fetchMyIP()
  // .then(fetchCoordsByIP)
  // .then(fetchISSFlyOverTimes)
  .then(body => console.log(body));

  const fetchCoordsByIP = function(body) {
    const ip = JSON.parse(body).ip
    return request(`ipwho.is/${ip}`);
  };

  fetchMyIP()
    .then(fetchCoordsByIP)
    .then(body => console.log(body))
    nextISSTimesForMyLocation()
    .then((passTimes) => {
      printPassTimes(passTimes);
    })

// nextISSTimesForMyLocation()
//    .then((passTimes) => {
//     printPassTimes(passTimes);
//   })
//   .catch((error) => {
//     console.log("It didn't work: ", error.message);
//   });

module.exports = {fetchCoordsByIP};