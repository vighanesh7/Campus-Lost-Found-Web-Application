import { summarize, label } from './itemUtils';
const sample = [{ type: 'LOST', name: 'iPhone 13 Pro', location: 'College Canteen' }, { type: 'FOUND', name: 'Camera', location: 'Campus Garden' }];
console.log(sample.map(label), summarize(sample));
