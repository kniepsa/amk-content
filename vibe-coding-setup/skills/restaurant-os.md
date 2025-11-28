---
description: Restaurant OS platform knowledge - SDK, API patterns, multi-restaurant architecture
globs:
  - "**/restaurant-os/**"
  - "**/salvator-standalone/**"
  - "**/em-hoettche-restaurant-standalone/**"
  - "**/restaurant-os-sdk/**"
alwaysApply: false
---

# Restaurant OS Platform

## Architecture
```
Restaurant Sites → Restaurant OS SDK → Restaurant OS API → Supabase
```

## Restaurant IDs
- Salvator: `11111111-1111-1111-1111-111111111111`
- Em Höttche: `22222222-2222-2222-2222-222222222222`

## SDK Usage
```typescript
import { RestaurantOSClient } from '@restaurant-os/sdk'

const restaurantOS = new RestaurantOSClient({
  apiUrl: process.env.NEXT_PUBLIC_RESTAURANT_OS_API_URL,
  restaurantId: RESTAURANT_ID,
  revalidate: 60, // ISR seconds
})

// Fetch data
const menu = await restaurantOS.getHauptspeisekarte()
const events = await restaurantOS.getUpcomingEvents()
const pdfUrl = await restaurantOS.getMenuPdfUrl('hauptspeisekarte')
```

## Menu Types
- Hauptspeisekarte (main menu)
- Getränkekarte (drinks)
- Mittagskarte (lunch)
- Saisonkarte (seasonal)

## Common Gotchas
- ISR with 60s revalidation is standard
- Always handle hydration for date/time components
- Check translation coverage before deploy
- Menu PDFs are fetched separately from menu items

## Notion Teamspace
Projects belong to **Bonn Gastro** teamspace.
