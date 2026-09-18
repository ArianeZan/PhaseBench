# Data boundary

This directory will contain data-source implementations and repository adapters. UI components must not import fixtures, database clients, or provider SDKs directly.

No data abstraction is introduced during M0 because the application does not yet read benchmark data. PB-007 will define the first repository contract.
