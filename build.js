const fs = require('fs');
const version = new Date().toString();

// Actualiza environment.prod.ts
const environmentProdFilePath = 'src/environments/environment.prod.ts';
let environmentProdFileContent = fs.readFileSync(environmentProdFilePath, 'utf8');
environmentProdFileContent = environmentProdFileContent.replace(/version: '.*'/, `version: '${version}'`);
fs.writeFileSync(environmentProdFilePath, environmentProdFileContent, 'utf8');

// Actualiza environment.ts
const environmentFilePath = 'src/environments/environment.ts';
let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf8');
environmentFileContent = environmentFileContent.replace(/version: '.*'/, `version: '${version}'`);
fs.writeFileSync(environmentFilePath, environmentFileContent, 'utf8');
