const fs = require("fs");

const md = `
# This is a new file

Written by yours truly, Huncho.

* fs.readdir
* fs.readFile
* fs.writeFile

`

fs.writeFile("./assets/notes.md", md.trim(), err => {
    if (err) {
        throw err;
    }
    console.log("file saved");
})

fs.readFile("./assets/notes.md", "UTF-8", (err, text) => {
    console.log(text)
})
