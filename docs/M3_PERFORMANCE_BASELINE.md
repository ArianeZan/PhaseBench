# M3 Performance Baseline

## Reproduce the measurements

Run `npm run performance`. The command creates a production build, starts it on port 3200, and measures representative routes in desktop Chrome. Measurements use encoded response sizes and a buffered layout-shift observer. Generated Playwright output remains ignored by Git.

## MVP budgets

| Measure                 | Per-route budget |
| ----------------------- | ---------------: |
| HTML document           |    150,000 bytes |
| Initial JavaScript      |    300,000 bytes |
| Initial CSS             |     50,000 bytes |
| Cumulative layout shift |             0.10 |

These budgets are guardrails for the current MVP, not claims about field performance. They should be tightened only with recorded before/after evidence.

## Baseline — 2026-09-20

| Route        |     HTML | JavaScript |     CSS | CLS |
| ------------ | -------: | ---------: | ------: | --: |
| Dashboard    | 76,808 B |  243,176 B | 5,522 B |   0 |
| Comparison   | 61,131 B |  141,251 B | 5,522 B |   0 |
| Runs         | 56,659 B |  141,251 B | 5,522 B |   0 |
| Model detail | 33,377 B |  141,251 B | 5,522 B |   0 |
| Run detail   | 46,289 B |  141,251 B | 5,522 B |   0 |

All measured routes pass the initial budgets.

## Largest costs and boundaries

The repository has five explicit client boundaries: theme provider, theme control, product navigation, product error handling, and history chart. Only the dashboard includes the chart boundary. Its initial JavaScript is 101,925 bytes larger than the other measured routes, making Recharts and the chart implementation the clearest optimization target for PB-025B.

The comparison and detail screens remain server-rendered apart from shared shell behavior. Their production client manifests do not include fixture or recommendation-domain modules, so synthetic catalog and benchmark data are not duplicated into the browser JavaScript bundle. HTML output is largest on the dashboard and comparison routes because their server-rendered decision evidence is intentionally visible before hydration.

## Limitations

These are controlled local measurements on desktop Chrome, not Core Web Vitals from real users. Network latency, device CPU, cache state, and hosting infrastructure are not represented. The suite protects payload and layout stability; public deployment should add field telemetry later.

## PB-025B optimization evidence

The chart's legend and table alternative now remain server-rendered while the Recharts visual loads when its reserved container approaches the viewport. The fixed-height container prevents layout shift. Browser coverage confirms that the visual appears after scrolling and that the table remains keyboard accessible.

| Dashboard measure  |    Before |     After |              Change |
| ------------------ | --------: | --------: | ------------------: |
| Initial JavaScript | 243,176 B | 142,279 B | −100,897 B (−41.5%) |
| HTML document      |  76,808 B |  94,316 B |           +17,508 B |
| Initial CSS        |   5,522 B |   5,522 B |           No change |
| CLS                |         0 |         0 |           No change |

The HTML increase contains the serializable history values needed by the deferred visual and always-available table. The net initial payload is lower, and dashboard JavaScript is now within roughly 1 KB of routes without a chart.
