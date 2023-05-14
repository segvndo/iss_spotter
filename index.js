//will require main fetch function

// URL for retrieving our IPv4 IP address in JSON format.
// https://api.ipify.org?format=json
// ip	"99.237.70.155"

const { fetchMyIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

