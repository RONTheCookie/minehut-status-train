const express = require("express");
const app = express();
app.set("view engine", "ejs");
const api = require("./index").api;
const port = process.env.PORT || 8302;
const botInviteLink = "https://discordapp.com/api/oauth2/authorize?client_id=399245263312650241&permissions=2048&scope=bot";
app.get("/", async (req, res) => {
    if (api.stats.player_count > 1 && api.stats.server_count > 1) {
        res.render("yes", {playercount: api.stats.player_count, botInviteLink});
    } else {
        res.sendFile(__dirname+"/views/no.html");
    }
});
app.get("/invite", (req, res) => {
    res.redirect(botInviteLink);
});
app.listen(port, ()=>{
    console.log("Listening on port "+port);
});