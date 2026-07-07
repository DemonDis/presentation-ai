require("dotenv/config");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const users = [
    { id: "filin", name: "filin", email: "filin@filin.filin" },
    { id: "sav", name: "sav", email: "sav@sav.sav" },
    { id: "alx", name: "alx", email: "alx@alx.alx" },
    { id: "dap", name: "dap", email: "dap@dap.dap" },
    { id: "daa", name: "daa", email: "daa@daa.daa" },
    { id: "yvi", name: "yvi", email: "yvi@yvi.yvi" },
    { id: "kgv", name: "kgv", email: "kgv@kgv.kgv" },
    { id: "sdd", name: "sdd", email: "sdd@sdd.sdd" },
    { id: "vev", name: "vev", email: "vev@vev.vev" },
    { id: "mee", name: "mee", email: "mee@mee.mee" },
    { id: "iea", name: "iea", email: "iea@iea.iea" },
    { id: "ass", name: "ass", email: "ass@ass.ass" },
    { id: "bma", name: "bma", email: "bma@bma.bma" },
    { id: "knv", name: "knv", email: "knv@knv.knv" },
    { id: "olegv", name: "olegv", email: "olegv@olegv.olegv" },
    { id: "sre", name: "sre", email: "sre@sre.sre" },
    { id: "gsa", name: "gsa", email: "gsa@gsa.gsa" },
    { id: "lsa", name: "lsa", email: "lsa@lsa.lsa" },
    { id: "sls", name: "sls", email: "sls@sls.sls" },
    { id: "ptl", name: "ptl", email: "ptl@ptl.ptl" },
  ];

  const { rows: existing } = await pool.query(
    'SELECT email FROM "User" WHERE email = ANY($1)',
    [users.map((u) => u.email)]
  );
  const existingEmails = new Set(existing.map((r) => r.email));
  const newUsers = users.filter((u) => !existingEmails.has(u.email));

  if (newUsers.length === 0) {
    console.log("All users already exist, skipping");
  } else {
    const hashedPassword = await bcrypt.hash("123", 10);

    const values = newUsers
      .map(
        (u, i) =>
          `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, 'USER', true, NOW(), NOW())`
      )
      .join(", ");

    const params = newUsers.flatMap((u) => [u.id, u.name, u.email, hashedPassword]);

    await pool.query(
      `INSERT INTO "User" (id, name, email, password, role, "hasAccess", "createdAt", "updatedAt")
       VALUES ${values}
       ON CONFLICT (email) DO NOTHING`,
      params
    );

    console.log(`Created ${newUsers.length} user(s): ${newUsers.map((u) => u.email).join(", ")}`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
