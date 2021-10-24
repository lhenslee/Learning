const fs = require("fs");

const text = fs.readFile("./assets/alex.jpg", (err, img) => {
    if (err) {
        console.log(`An error has occured: ${err.messasge}`);
        process.exit();
    }
    console.log("file contents read");
    console.log(img);
});