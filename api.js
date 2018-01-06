const request = require("request");
const index = require("./index");
const base = "https://pocket.minehut.com";

/**
 * @typedef {Object} MinehutStats
 * @property {Number} player_count Amount of players currently on minehut.
 * @property {Number} server_count Amount of servers currently running.
 * @property {Number} server_max Maximum amount of servers that can be ran.
 * @property {Number} ram_count Ram count in MB.
 */
/**
 * @typedef {Object} MinehutServerSession
 * @property {String} _id The server's id
 * @property {Number} playerCount amount of players online on the server
 * @property {Boolean} online Is the server on?
 * @property {Number} timeNoPlayers Amount of time the server is online without any players (NOT TESTED!!!)
 * @property {String} name The server's name, What do you expect?
 * @property {String} motd Server Description, also known as Message Of The Day
 * @property {Number} maxPlayers The maximum amount of players
 * @property {Boolean} visibility Not sure what this is???
 * @property {String} platform This value is usually "java"
 * @property {Number} startedAt The time this server was started
 * @property {Boolean} starting Is the server currently starting?
 * @property {Boolean} stopping Is the server currently stopping?
 * @property {Boolean} exited Not sure what this is???
 * @property {Number} lastOnlineAt The last time this server was online, shows current time if server is online
 */

/**
 * @typedef {Object} ServerProperties
 * @property {Number} gamemode 0 Survival, 1 Creative, 2 Adventure, 3 Spectator
 * @property {Boolean} pvp
 * @property {Boolean} force_gamemode
 * @property {Boolean} allow_flight
 * @property {Boolean} allow_nether
 * @property {Number} difficulty
 * @property {Boolean} enable_command_block
 * @property {Boolean} generate_structures
 * @property {Boolean} hardcore
 * @property {String} level_seed
 * @property {Number} max_players
 * @property {Boolean} spawn_animals
 * @property {Boolean} spawn_mobs
 */

/**
 * @typedef {Object} MinehutServerModal
 * @property {String} _id The server's ID
 * @property {String} owner Internal Server Owner ID
 * @property {String} name
 * @property {String} name_lower
 * @property {Number} creation the time the server was created at
 * @property {String} platform Usually java
 * @property {Number} credits_per_day Amount of credits per day
 * @property {String} motd Message of the day - server description
 * @property {Boolean} visibility Visibility
 * @property {ServerProperties} server_properties
 */



class MinehutAPI {
    constructor() {
        this.getServers().then(commServers => this.commServers = commServers);
        this.getStats().then(stats => this.stats = stats);
        this.getPlugins().then(plugins => this.plugins = plugins);
        const updateInterval = 300000;
        //Updates every 5 minutes
        setInterval(async () => {
            let s = await this.getStats();
            this.stats = s;

            let commServersU = await this.getServers();
            this.commServers = commServersU;
        }, updateInterval);
    }
    /**
     * Get a server by name
     * @param {String} serverName 
     * @returns {Promise<MinehutServerModal>} 
     */
    getServerByName(serverName) {
        return new Promise((resolve, reject) => {
            request.get(base + `/server/${encodeURI(serverName)}?byName=true`, (err, response, body) => {
                if (err) return reject(err);
                resolve(JSON.parse(body).server);
            });
        });
    }

    /**
     * Get a server session by it's name.
     * @param {String} name The minehut server's name
     * @returns {MinehutServerSession}
     */
    getServerSessionByName(name) {
        return this.commServers.find("name", name);
    }

    /**
     * Gets the global minehut stats.
     * @returns {Promise<MinehutStats>}
     */
    getStats() {
        return new Promise((resolve, reject) => {
            request.get(base + "/network/simple_stats", (error, response, body)=>{
                if (error) return reject(error);
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Gets all of the currently running servers.
     * @returns {Promise<MinehutServerSession[]>} 
     */
    getServers() {
        return new Promise((resolve, reject) => {
            request.get(base + "/servers?stats=true"/* not sure if this is needed but it wont hurt*/, (error, response, body) => {
                if (error) return reject(error);
                resolve(JSON.parse(body).servers);
            });
        });
    }

    getPlugins() {
        return new Promise((resolve, reject) => {
            request.get(base + "/plugins_public", (error, response, body) => {
                if (error) return reject(error);
                let plgs = JSON.parse(body).all;
                let map = {};
                plgs.forEach(pl => {
                    map[pl._id] = pl;
                });
                resolve(map);
            });
        });
    }

}
const api = new MinehutAPI();
module.exports = {
    api
}
