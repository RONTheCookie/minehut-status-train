/* Made by RONTheCookie - ronthecookie.me */
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const pongInterval = 300000; // ms
let status;
let playercount = 0;
const port = process.env.PORT || 8302;
const ping = require('minecraft-ping');
app.get("/", async (req, res) => {
    if (status) {
        res.render("yes", {playercount: playercount});
    } else {
        res.sendFile(__dirname+"/views/no.html");
    }
});
check();
async function check(){
    let p = await pong();
    status = p.playersOnline > 1;
    playercount = p.playersOnline;
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