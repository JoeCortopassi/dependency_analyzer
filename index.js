const spawn = require('child_process').spawnSync
const fs = require('fs');
const JSON5 = require('json5')

const args = process.argv.slice(2);
const path = args[0];
const packageObj = JSON.parse(fs.readFileSync(path, 'utf8'));
const retrieve = [
  ...Object.keys(packageObj.dependencies),
  ...Object.keys(packageObj.devDependencies)
].map(dep => getInfo(dep));

console.log(retrieve);



function getInfo (depName) {
  console.log("- " + depName);
  const output = spawn("npm", [
    "view",
    depName 
  ]).stdout;

  const data = JSON5.parse(output); 
  return {
    name: data.name,
    description: data.description,
    repo: data.repository && data.repository.url
  };
}
