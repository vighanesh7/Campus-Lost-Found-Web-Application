// Syllabus demo: blocking vs non-blocking. Run: node src/utils/asyncExamples.js
const fs = require('fs');
const fsp = require('fs/promises');

function blockingRead(file) {            // BLOCKS the event loop until finished
  return fs.readFileSync(file, 'utf8');
}
function nonBlockingRead(file) {         // Promise chaining, event loop stays free
  return fsp.readFile(file, 'utf8').then((t) => t.length).catch((e) => { console.error(e.message); return 0; });
}
function callbackRead(file, cb) {        // classic error-first callback
  fs.readFile(file, 'utf8', (err, data) => cb(err, data));
}
if (require.main === module) {
  console.log('1. blocking');   console.log('len', blockingRead(__filename).length);
  nonBlockingRead(__filename).then((n) => console.log('3. non-blocking len', n));
  callbackRead(__filename, (e, d) => console.log('4. callback len', d.length));
  console.log('2. this prints BEFORE the non-blocking results');
}
module.exports = { blockingRead, nonBlockingRead, callbackRead };
