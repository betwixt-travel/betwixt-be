const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;
  homeZip;

  constructor(row) {
    this.id = row.id;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
    this.homeZip = row.home_zip;
  }

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [firstName, lastName, email, passwordHash]
    );
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE id=$1
      `,
      [id]
    );
    return new User(rows[0]);
  }

  static async update(id, attrs) {
    const user = await this.getById(id);
    if (!user) return null;
    const { firstName, lastName, homeZip } = { ...user, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE users
      SET first_name=$2, last_name=$3, home_zip=$4
      WHERE id=$1
      RETURNING *
      `,
      [id, firstName, lastName, homeZip]
    );
    console.log('rows[0]', rows[0]);
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
