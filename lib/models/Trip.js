const pool = require('../utils/pool');

module.exports = class Trips {
  id;
  creatorId;
  location;
  url;

  constructor(row) {
    this.id = row.id;
    this.creatorId = row.creator_id;
    this.location = row.location;
    this.url = row.url;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM trips');

    return rows.map((row) => new Trips(row));
  }
};
