# Fixture Conventions

These rules apply to synthetic data under `src/data/fixtures`.

- Keep fixtures deterministic: do not use the current date, `Math.random`, locale-sensitive formatting, or network data.
- Export immutable domain-shaped values and use explicit unit-bearing field names.
- Make all entity references valid and let repository validation reject inconsistencies rather than silently dropping them.
- Label the dataset as synthetic in documentation and any future UI that presents it.
- Choose values to exercise product behavior and edge cases, not to assert current vendor performance.
