'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up(qi) {
    const now = new Date();
    const hash = (p) => bcrypt.hashSync(p, 10);
    await qi.bulkInsert('users', [
      { id: 1, name: 'Campus Admin', email: 'admin@campus.edu', password: hash('Admin@123'), studentId: 'ADMIN001', department: 'Administration', year: null, phone: '9000000001', role: 'ADMIN', createdAt: now, updatedAt: now },
      { id: 2, name: 'Aarav Nair', email: 'aarav@campus.edu', password: hash('Student@123'), studentId: 'BCA2024001', department: 'BCA', year: 2, phone: '9000000002', role: 'STUDENT', createdAt: now, updatedAt: now },
      { id: 3, name: 'Meera Joseph', email: 'meera@campus.edu', password: hash('Student@123'), studentId: 'BCA2024002', department: 'BCA', year: 2, phone: '9000000003', role: 'STUDENT', createdAt: now, updatedAt: now },
      { id: 4, name: 'Rohan Thomas', email: 'rohan@campus.edu', password: hash('Student@123'), studentId: 'BCOM2023007', department: 'B.Com', year: 3, phone: '9000000004', role: 'STUDENT', createdAt: now, updatedAt: now },
    ]);
  },
  async down(qi) { await qi.bulkDelete('users', null, {}); },
};
