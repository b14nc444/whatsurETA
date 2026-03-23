# whatsurETA
What's my parcel's ETA

## Required Environment Variables
- `REDIS_URL`
- `DELIVERY_API_BASE_URL`
- `DELIVERY_API_KEY`
- `DELIVERY_API_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Copy `.env.example` to `.env.local` and fill real values.

## Pre-deploy Required Checks
```bash
npm run typecheck
npm run build
curl -sS http://127.0.0.1:3001/api/v1/couriers
curl -sS -X POST http://127.0.0.1:3001/api/v1/track \
  -H "Content-Type: application/json" \
  -d '{"courierCode":"cj","trackingNumber":"123456789012","destination":{"postalCode":"06236","baseAddress":"서울 강남구"}}'
curl -sS http://127.0.0.1:3001/api/v1/results/<queryId>
```

SEO required defaults:
- `result/[queryId]` is `noindex`
- `/robots.txt` disallows `/result/`
