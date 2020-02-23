const fs = require("fs");
const archiver = require("archiver");

const archive = archiver("zip");
const outputFilename = "phaserquest.zip";

if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
}

const output = fs.createWriteStream(__dirname + `/dist/${outputFilename}`);
output.on("close", function() {
    console.log(archive.pointer() + " total bytes");
    console.log(`${outputFilename} has been created in the dist folder.`);
});
output.on("end", function() {
    console.log("stream end event detected");
});
archive.on("warning", function(err) {
    throw err;
});
archive.on("error", function(err) {
    throw err;
});

archive.pipe(output);

archive.file("index.html", { name: "index.html" });
archive.file("phaserquest-bundle.js", { name: "phaserquest-bundle.js" });
archive.directory("assets/", "assets");

archive.finalize();
