const request = require('request');

//Define a function fetchMyIP which will asynchronously return our IP Address using an API.
const fetchMyIP = function(callback) {
  //Request to 'https://api.ipify.org?format=json', find URL retrieving IPv4 in JSON format
  request('https://api.ipify.org?format=json', (error, response, body) => {
    //If error occurs during request, initiate callback function callback(error)
    if (error) {
      callback(error, null);
      return;
    }

    //pass through the error to the callback if an error occurs when requesting the IP data
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //parse and extract the IP address using JSON and then pass that through to the callback (as the second argument) if there is no error
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//Define the fetchCoordsByIP function in iss.js; function will take in an IP address and return the latitude and longitude for it
const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    //parse the returned body in order to check its info
    const parsedBody = JSON.parse(body);

    //check if "success" is true or not; a false means returned IP and requested IP do not match
    if (!parsedBody.success || parsedBody.ip !== ip) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      //Initiate callback when error occurs
      callback(Error(message), null);
      return;
    }
    //
    const {latitude, longitude} = parsedBody;
    const coordinates = {latitude, longitude};
    callback(null, coordinates);
  });
};

//Define function fetchISSFlyOverTimes that fetches the ISS fly over times; will take in coordinate data and callback for error
const fetchISSFlyOverTimes = function(coordinates, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=Y${coordinates.latitude}&lon=${coordinates.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(msg, null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

//Define nextISSTimesForMyLocation function that will only take in callback to handle error
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        callback(error, null);
        return;
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};