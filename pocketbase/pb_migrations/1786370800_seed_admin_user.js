/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users');

    // Reuse an existing admin@gmoney.com record if present, otherwise create it.
    let record = null;
    try {
      const found = app.findRecordsByFilter("users", "email = 'admin@gmoney.com'");
      if (found && found.length) record = found[0];
    } catch (_) {}

    if (!record) {
      record = new Record(users);
      record.set('email', 'admin@gmoney.com');
      record.set('name', 'Administrador GMONEY');
    }

    // Temporary test credential for this test copy.
    record.set('password', 'AdminGmoney@2025');
    record.set('passwordConfirm', 'AdminGmoney@2025');
    record.set('verified', true);
    app.save(record);
  },
  (app) => {
    try {
      const found = app.findRecordsByFilter("users", "email = 'admin@gmoney.com'");
      if (found && found.length) app.delete(found[0]);
    } catch (_) {}
  },
);
