# SQLite Data Rules

- Treat applied migrations as immutable; add a new ordered migration instead of editing released SQL.
- Enable and verify foreign keys on every connection.
- Keep completed benchmark evidence append-only and preserve exact version references.
- Keep SQL rows and driver types inside this directory; map them to domain values at the adapter boundary.
- Use in-memory databases for migration and contract tests. Never commit generated database files.
