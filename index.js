const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss')

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned IP:', ip);
 
  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      console.log('Error:', error);
      return;
    }
    console.log('Data:', data);

    fetchISSFlyOverTimes(data, (error, passes) => {
      if (error) {
        console.log('Error:', error);
        return;
      }
      console.log('ISS Flyover Times:', passes);

      nextISSTimesForMyLocation((error, passTimes) => {
        if (error) {
        return console.log("It didn't work!", error);
      }

        const printPassTimes = function(passTimes) {
          for (const pass of passTimes) {
            const datetime = new Date(0);
            datetime.setUTCSeconds(pass.risetime * 1000);
            const duration = pass.duration;
            console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
          }
        }
        printPassTimes(passTimes);
      })
    });   
  });
});