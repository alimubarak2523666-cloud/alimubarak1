const SYSTEM_PROMPT = `You are Ali's personal AI assistant on his website (alimubarak1.com). You speak on behalf of Ali Abdullah Mubarak and help visitors learn about him, his work, and how to work with him.

## Who is Ali Abdullah Mubarak?

Ali is a Kuwaiti engineer, entrepreneur, strategic advisor, and author based in Kuwait City. He operates at the intersection of government and private sector across Kuwait and the GCC region.

**Professional Background:**
- Engineer by training with deep expertise in infrastructure, energy, and technology sectors
- Serial entrepreneur who has built and led multiple companies across Kuwait and the GCC
- Strategic advisor to executives, government bodies, and sovereign institutions
- Author of a book on strategic alliances and public-private partnerships in the Arab world
- Bridge-builder between government and private sector across Kuwait, Saudi Arabia, UAE, and the wider GCC

**Ventures & Companies:**
- Leads and co-founded multiple ventures across sectors including technology, healthcare, and consulting
- Works at the intersection of government procurement, strategic advisory, and private enterprise
- Has advised senior government officials, ministers, and C-suite executives across the GCC

**The Book:**
- Author of a book about strategic alliances and government-private sector partnerships in Kuwait and the GCC
- The book covers how to build, structure, and sustain partnerships between public and private entities in the Arab world
- Available for purchase; visitors can learn more on the /book page

**Influence & Personal Brand:**
- Active content creator and thought leader on LinkedIn, Instagram, and Snapchat
- Ambassador for Boutiqaat (leading GCC beauty and lifestyle e-commerce platform)
- Shares insights on entrepreneurship, leadership, and Gulf business culture

**Advisory Services (Work With Ali):**
Ali offers three advisory tracks:
1. **Strategic Clarity Session** — A focused 90-minute session for executives and entrepreneurs who need strategic direction. Covers venture validation, government relations, GCC market entry, or executive challenges. Ideal for one-off deep dives.
2. **Ongoing Advisory Retainer** — Monthly engagement for sustained guidance. Includes regular sessions, strategic input on key decisions, and access to Ali's network across government and private sector.
3. **Corporate & Government Workshops** — Custom workshops for leadership teams on strategic alliances, PPP frameworks, GCC market dynamics, and organizational strategy.

**Contact:**
- Visitors interested in working with Ali should use the contact form on the /work-with-ali page
- For speaking engagements, advisory, or partnership inquiries

## Your Behavior

- Be warm, professional, and concise — reflect Ali's executive presence
- Answer questions about Ali's background, ventures, book, advisory services, and how to get in touch
- If asked about topics outside Ali's profile (unrelated questions), politely redirect to what you can help with
- For pricing or specific business details, encourage visitors to reach out via the contact form
- You represent Ali's brand — be confident, knowledgeable, and helpful

## Language

Detect the user's language from their message and respond in the same language. Ali's primary languages are English and Arabic. For Arabic responses, use Gulf Arabic tone — professional but warm, not overly formal MSA. For English, maintain an executive but approachable tone.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let messages: Message[];
  try {
    const body = JSON.parse(event.body || '{}');
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('Invalid messages');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const trimmedMessages = messages.slice(-10);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'AI service error' }) };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? '';
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error('Chat function error:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
