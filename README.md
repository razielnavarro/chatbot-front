# Restaurant Menu WhatsApp Ordering System

A Next.js application for restaurant menu ordering with WhatsApp integration via N8N automation.

## Features

- Interactive Google Maps address selection
- Address form with auto-fill from map selection
- N8N webhook integration for WhatsApp automation
- Responsive design for mobile and desktop

## Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# N8N Webhook Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/address-confirmation

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### N8N Webhook Setup

1. In your N8N instance, create a new workflow
2. Add a "Webhook" trigger node
3. Copy the webhook URL and add it to your `.env.local` file
4. Configure the webhook to receive POST requests with JSON data

The webhook will receive the following payload structure:

```json
{
  "fullAddress": "Complete address string from Google Maps",
  "addressDetails": {
    "additionalInfo": "Additional information from user",
    "provincia": "Province",
    "distrito": "District",
    "calle": "Street",
    "zona": "Zone",
    "numero": "Number",
    "codigoPostal": "Postal code",
    "coordinates": {
      "lat": 8.4273,
      "lng": -82.4308
    },
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "source": "whatsapp_ordering_system"
}
```

## Installation

```bash
npm install
# or
pnpm install
```

## Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Navigate to `/address` to access the address selection page
2. Use the map to select your location or search for an address
3. Fill in any additional address details
4. Click "CONFIRMAR DIRECCIÓN" to send the address to N8N
5. The address data will be sent to your N8N webhook for WhatsApp automation
