const path = require("path");

const parentDir = path.basename(path.dirname(__dirname));
if (parentDir === "node_modules") {
  console.log("Husky: skipping as code is used as a package");
} else {
  require("husky").install();
}
