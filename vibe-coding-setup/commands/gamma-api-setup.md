# Gamma API Setup & Configuration

## Overview

This guide documents how to use the Gamma API to generate professional, sleek presentations programmatically. Gamma is ranked #1 for aesthetic design and provides AI-native presentation generation.

## Prerequisites

- Gamma Pro, Ultra, Team, or Business account
- API key from https://gamma.app/settings/api

## Initial Setup

### 1. Generate API Key

1. Go to https://gamma.app/settings/api
2. Click "Create API key"
3. Copy the key (format: `sk-gamma-xxxxxxxx`)

### 2. Set Environment Variable

```bash
# Temporary (current session)
export GAMMA_API_KEY=sk-gamma-xxxxxxxx

# Permanent (add to shell profile)
echo 'export GAMMA_API_KEY=sk-gamma-xxxxxxxx' >> ~/.zshrc
source ~/.zshrc
```

## API Configuration

**Base URL:** `https://public-api.gamma.app/v1.0`

**Authentication:** Use `X-API-KEY` header (NOT `Authorization: Bearer`)

### Required Parameters

```json
{
  "inputText": "Your content with \\n---\\n as slide breaks",
  "textMode": "preserve" // or "generate" or "condense"
}
```

### Complete Working Example

```bash
curl -X POST 'https://public-api.gamma.app/v1.0/generations' \
  -H 'X-API-KEY: sk-gamma-xxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{
    "inputText": "# Slide 1\\nContent\\n---\\n# Slide 2\\nMore content",
    "textMode": "preserve",
    "format": "presentation",
    "cardSplit": "inputTextBreaks",
    "additionalInstructions": "Professional design with green/gold color scheme",
    "imageOptions": {
      "source": "webFreeToUseCommercially"
    },
    "cardOptions": {
      "dimensions": "16x9"
    }
  }'
```

## Parameter Reference

### Text Mode (`textMode` - REQUIRED)

- `"preserve"` - Keeps exact text (best for structured content)
- `"generate"` - AI expands brief prompts
- `"condense"` - AI summarizes long content

### Format (`format`)

- `"presentation"` - Slides (default)
- `"document"` - Document
- `"social"` - Social media post
- `"webpage"` - Web page

### Card Split (`cardSplit`)

- `"inputTextBreaks"` - Uses `\n---\n` as slide breaks (recommended)
- `"auto"` - AI decides based on `numCards`

### Image Source (`imageOptions.source`)

**Valid options:**

- `webFreeToUseCommercially` ✅ (for commercial pitches)
- `webFreeToUse`
- `webAllImages`
- `aiGenerated` (requires `imageOptions.model` and `imageOptions.style`)
- `pictographic`
- `giphy`
- `pexels`
- `placeholder`
- `noImages`
- `themeAccent`

**Invalid:** `unsplash` ❌

### Card Dimensions (`cardOptions.dimensions`)

- `"16x9"` - Widescreen (recommended for pitches)
- `"4x3"` - Standard
- `"fluid"` - Expands with content

## Workflow

### 1. Generate Presentation

```bash
RESPONSE=$(curl -s -X POST 'https://public-api.gamma.app/v1.0/generations' \
  -H "X-API-KEY: $GAMMA_API_KEY" \
  -H 'Content-Type: application/json' \
  -d @request.json)

GENERATION_ID=$(echo $RESPONSE | jq -r '.generationId')
echo "Generation ID: $GENERATION_ID"
```

### 2. Check Status

```bash
curl -X GET "https://public-api.gamma.app/v1.0/generations/$GENERATION_ID" \
  -H "X-API-KEY: $GAMMA_API_KEY" \
  -H 'accept: application/json'
```

### 3. Get Final URL

```json
{
  "generationId": "abc123",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/xxxxxxxx",
  "credits": { "deducted": 30, "remaining": 7970 }
}
```

## Content Structure

Use markdown with `\n---\n` as slide breaks:

```markdown
# Slide 1 Title

Content for slide 1

- Bullet point 1
- Bullet point 2

---

# Slide 2 Title

## Content for slide 2

...
```

## Common Patterns

### Professional Pitch Deck

```json
{
  "inputText": "# Title\n...\n---\n# Problem\n...",
  "textMode": "preserve",
  "format": "presentation",
  "cardSplit": "inputTextBreaks",
  "additionalInstructions": "Use professional color scheme. Bold headlines. Clear visual hierarchy.",
  "imageOptions": {
    "source": "webFreeToUseCommercially"
  },
  "cardOptions": {
    "dimensions": "16x9"
  }
}
```

### AI-Generated Content

```json
{
  "inputText": "Best practices for remote team management",
  "textMode": "generate",
  "format": "presentation",
  "numCards": 10,
  "cardSplit": "auto",
  "textOptions": {
    "amount": "detailed",
    "tone": "professional, inspiring",
    "audience": "startup founders",
    "language": "en"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "flux-1-pro",
    "style": "modern, minimalist"
  }
}
```

## Error Handling

### Common Errors

**401 Unauthorized:**

- Check API key is correct
- Ensure using `X-API-KEY` header (not `Authorization`)

**400 Validation Error:**

- Verify `textMode` is included ("generate", "condense", or "preserve")
- Check `imageOptions.source` is valid (not "unsplash")
- Ensure `inputText` is a string

**403 Forbidden:**

- Check credit balance
- Ensure auto-recharge is enabled

**429 Rate Limited:**

- Contact Gamma support for higher capacity

## Claude MCP Integration

### MCP Server Installation

```bash
claude mcp add gamma --transport stdio -- npx -y @mercuryml/gamma-mcp-server
```

**Note:** The MCP server uses API v0.1 (deprecated). Use direct API calls instead.

### Direct API Call from Claude

Use the Bash tool with curl commands as shown above.

## Best Practices

1. **Use `textMode: "preserve"`** for structured content
2. **Use `cardSplit: "inputTextBreaks"`** with `\n---\n` for precise control
3. **Specify brand colors** in `additionalInstructions`
4. **Use `webFreeToUseCommercially`** for business presentations
5. **Set `dimensions: "16x9"`** for professional pitch decks
6. **Keep `inputText` under 100,000 tokens** (~400,000 characters)

## Examples

### Real-World: Lithotech M&A Pitch

```bash
curl -X POST 'https://public-api.gamma.app/v1.0/generations' \
  -H 'X-API-KEY: sk-gamma-xxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{
    "inputText": "# Lithotech Can Own This Platform\n...\n---\n# The Problem\n...",
    "textMode": "preserve",
    "format": "presentation",
    "cardSplit": "inputTextBreaks",
    "additionalInstructions": "Use professional green and gold color scheme. Bold headlines. Clear hierarchy.",
    "imageOptions": {
      "source": "webFreeToUseCommercially"
    },
    "cardOptions": {
      "dimensions": "16x9"
    }
  }'
```

**Result:**

- Credits used: 30
- Generation time: ~5 seconds
- Output: https://gamma.app/docs/fvmmrc2ezjxiqcj

## Resources

- **API Reference:** https://developers.gamma.app/reference/generate-a-gamma
- **Parameters Guide:** https://developers.gamma.app/docs/generate-api-parameters-explained
- **Getting Started:** https://developers.gamma.app/docs/getting-started
- **Help Center:** https://help.gamma.app/en/articles/11962420-does-gamma-have-an-api
- **Troubleshooting:** https://help.gamma.app/en/articles/12805003-gamma-api-troubleshooting

## Gotchas

- **API Key Header:** Must use `X-API-KEY` (not `Authorization: Bearer`)
- **Parameter Name:** `inputText` (not `text`)
- **Text Mode:** Required parameter
- **Image Source:** "unsplash" is NOT valid; use "webFreeToUseCommercially"
- **Warnings Are OK:** Ignored parameters generate warnings but don't fail
- **MCP Server:** Uses deprecated v0.1 API - use direct curl instead

## Cost

- **Typical pitch deck (10 slides):** 30 credits
- **Pro plan:** Generous limits (thousands of credits)
- **Check balance:** Returned in API response

---

**Last Updated:** January 27, 2026
**Tested With:** Lithotech M&A pitch deck (10 slides, M&A acquisition presentation)
