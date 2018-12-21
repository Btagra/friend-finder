var mysql = require("mysql");

module.exports = function (app) {
    var connection;
    if (process.env.JAWSDB_URL) {
        connection = mysql.createConnection(process.env.JAWSDB_URL);
    } else {
        var connection = mysql.createConnection({
            host: "localhost",
            port: 3307,
            user: "root",
            password: "root",
            database: "friends_db"
        });
    };

    connection.connect(function (err) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        console.log("connected as id " + connection.threadId);
    });

    app.get("/api/friends", function (req, res) {
        connection.query("SELECT * FROM profiles", function (err, result) {
            if (err) throw err;
            var data = JSON.stringify(result);
            data = JSON.parse(data);
            console.log(data);
            for (i = 0; i < data.length; i++) {
                data[i].scores = data[i].scores.split(",");
            }
            return res.json(data);
        });
    });
};

