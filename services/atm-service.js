const locations = require('mastercard-locations');
const MasterCardAPI = locations.MasterCardAPI;
const {promisify} = require('util');


exports.atmService = async function (location) {
  const atmString = 'ATM';

  const consumerKey = "";
  const keyStorePath = "";
  const keyAlias = "";
  const keyPassword = "";

  const authentication = new MasterCardAPI.OAuth(consumerKey, keyStorePath, keyAlias, keyPassword);
  MasterCardAPI.init({
    sandbox: true,
    debug: true,
    authentication: authentication
  });


  const requestData = {
    "PageOffset": "0",
    "PageLength": "5",
    "PostalCode": location
  };

  const atmLocationQuery =  promisify(locations.ATMLocations.query);
  return atmLocationQuery(requestData);

}