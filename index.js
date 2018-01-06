/* Made by RONTheCookie - ronthecookie.me */
const express = require("express");
const app = express();
const pongInterval = 300000; // ms
let status;
const port = process.env.PORT || 8302;
const ping = require('minecraft-ping');
app.get("/", async (req, res) => {
    if (status) {
        res.sendFile(__dirname+"/pages/yes.html");
    } else {
        res.sendFile(__dirname+"/pages/no.html");
    }
});
check();
async function check(){
    let p = await pong();
    status = p.playersOnline > 1;
}
setInterval(check, pongInterval);
app.listen(port, ()=>{
    console.log("Listening on port "+port);
});
/**
 * @typedef {Object} PongResponse
 * @property {Number} pingVersion the ping version
 * @property {Number} protocolVersion
 * @property {String} gameVersion
 * @property {String} motd
 * @property {Number} playersOnline
 * i dont care about maxplayers 
 */
/**
 * @returns {Promise<PongResponse>} the response
 */
function pong() {
    return new Promise((resolve, reject) => {
        ping.ping_fe01fa({host: "minehut.com", port:25565}, (err, response) => {
            if (err) reject(err);
            resolve(response);
        });
    });
}