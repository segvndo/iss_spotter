const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip
  return request(`ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const {latitude, longitude} = JSON.parse(body);
  //const coordinates = {latitude, longitude}
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
  return request(url);
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const {response} = JSON.parse(data);
      return response;
    })
};

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime * 1000);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
  }
};

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation, printPassTimes};