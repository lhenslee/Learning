const cp = require("child_process");

const questionApp = cp.spawn("node", ["questions"]);

questionApp.stdin.write("Huncho\n");
questionApp.stdin.write("Bay Area\n");
questionApp.stdin.write("Take over the world\n");

questionApp.stdout.on("data", data => {
    console.log(`from the question app: ${data}`);
});

questionApp.on("close", () => {
    console.log(`questionApp process exited`);
});