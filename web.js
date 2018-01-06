const express = require("express");
const app = express();
app.set("view engine", "ejs");
const api = require("./api").api;
const port = process.env.PORT || 8302;
app.get("/", async (req, res) => {
    if (api.stats.player_count > 1 && api.stats.server_count > 1) {
        res.render("yes", {playercount: api.stats.player_count});
    } else {
        res.sendFile(__dirname+"/views/no.html");
    }
});
app.listen(port, ()=>{
    console.log("Listening on port "+port);
});