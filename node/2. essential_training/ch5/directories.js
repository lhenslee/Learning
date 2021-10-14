const fs = require("fs");

fs.readdirSync("./storage-files").forEach(fileName => {
    fs.unlinkSync(`./storage-files/${fileName}`);
});

fs.rmdir("./storage-files", err => {
    if (err) {
        throw err;
    }
    console.log("./storage-files directory removed")
})