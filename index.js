const http = require('http');
const childProc = require('child_process');
const spawn = childProc.spawnSync;
const fs = require('fs');
const JSON5 = require('json5')

const args = process.argv.slice(2);
const path = args[0];
const packageObj = JSON.parse(fs.readFileSync(path, 'utf8'));
const retrieve = [
  ...Object.keys(packageObj.dependencies),
  ...Object.keys(packageObj.devDependencies)
]
  .map(dep => getInfo(dep))
  .map(info => "<li><a target='__blank' href='"+info.repo+"'><h3>"+info.name+"</h3></a><p>"+info.description+"</p></li>");

const server = http.createServer(function (req, res) {
  var html = buildHtml(packageObj.name, retrieve);

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
  res.end(html);
}).listen(8080);

childProc.exec('open -a "Google Chrome" http://localhost:8080');




/*
 * Helpers
 */
function getInfo (depName) {
  console.log("- " + depName);
  const output = spawn("npm", [
    "view",
    depName 
  ]).stdout;

  const data = JSON5.parse(output); 
  const repo = data.repository && githubLink(data.repository.url)

  return {
    name: data.name,
    description: data.description,
    repo
  };
}

function buildHtml(name, list) {
  return '<!DOCTYPE html><html><head>'
    + name
    + '</head><body><ul>'
    + list.join('')
    + '</ul></body></html>';
};


function githubLink (repo) {
  const path = repo.split("github.com/")[1];
  return "https://github.com/" + path;
}

