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
            for (i = 0; i < data.length; i++) {
                data[i].scores = data[i].scores.split(",");
            }
            return res.json(data);
        });

    });



    app.post("/api/friends", function (req, res) {

        var scores = req.body.scores.toString();

        connection.query("SELECT * FROM profiles", function (err, result) {
            if (err) throw err;

            var data = JSON.stringify(result);
            data = JSON.parse(data);
            var scoresArray = [];
            var value = 0;
            var newScores = req.body.scores;
            var totalDifference = 0;

            for (i = 0; i < data.length; i++) {
                data[i].scores = data[i].scores.split(",");
            }

            for (i = 0; i < data.length; i++) {
                for (j = 0; j < data[i].scores.length; j++) {
                    totalDifference += Math.abs(parseInt(data[i].scores[j]) - parseInt(newScores[j]));
                }
                scoresArray.push(totalDifference);
                totalDifference = 0;
            }

            for (var i = 0; i < scoresArray.length; i++) {
                if (scoresArray[i] <= scoresArray[value]) {
                    value = i;

                }
            }
            res.json(data[value]);

        });

        connection.query("INSERT INTO profiles (name, photo, scores) VALUES (?, ?, ?)", [req.body.name, req.body.photo, scores], function (err, result) {
            if (err) {
                return res.status(500).end();
            }
        });
    });
}


