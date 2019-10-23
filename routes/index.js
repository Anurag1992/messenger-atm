const express = require('express');
const router = express.Router();
const atmService = require("../services/atm-service")
const _ = require('lodash');
/**  
 * Main webhook entry to interact with the bot
 * source: https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
*/
router.post('/webhook', async (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    const lastEntry = body.entry[body.entry.length-1];
    let webhook_event = lastEntry.messaging[0];
    const response = await atmService.atmService(webhook_event.message).catch(e => res.sendStatus(500))

    // Returns a '200 OK' response to all requests
    const nearestATMName = _.get(response,'Atms.Atm.0.Location.Name')
    const nearestATMAddress = _.get(response,'Atms.Atm.0.Location.Address.Line1') +'\n'+_.get(response,'Atm.0.Location.Address.Line2');
    const msg = nearestATMName + '\n' + nearestATMAddress
    return res.status(200).send(msg);
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

/**  
 * Token validation
 * source: https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
*/
router.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "AOJHA"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


module.exports = router;
