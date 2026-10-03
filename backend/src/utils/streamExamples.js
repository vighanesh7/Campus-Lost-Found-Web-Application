// Syllabus demo of readable / writable / standard streams.
// Run: node src/utils/streamExamples.js   (copies this file to stdout in UPPERCASE)
const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');
const upper = new Transform({ transform(chunk, enc, cb) { cb(null, chunk.toString().toUpperCase()); } });
if (require.main === module) {
  pipeline(fs.createReadStream(__filename), upper, process.stdout)   // fs read stream -> transform -> stdout
    .catch((e) => console.error(e.message));
}
