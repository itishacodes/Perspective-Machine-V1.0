import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

let client;
let db;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
}

async function getAuthUserId() {
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const a = await auth();
    return { userId: a?.userId || null };
  } catch (e) { return { userId: null }; }
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
const MODEL = 'llama-3.3-70b-versatile';

const PERSONAS = {
  professor: { label: 'Professor', sys: 'You are an academic Professor. Use formal, intellectual language. Focus on theory, foundational principles, and long-term research implications.' },
  investor: { label: 'Investor', sys: 'You are a VC Investor. Be brief, blunt, and obsessed with ROI, market size, and scalability. Identify if this is a "billion-dollar opportunity".' },
  designer: { label: 'Designer', sys: 'You are a Senior Product Designer. Obsess over user empathy, aesthetics, and frictionless experience. If it looks ugly or feels complex, it is a failure.' },
  marketer: { label: 'Marketer', sys: 'You are a Growth Marketer. Focus on positioning, virality, customer acquisition cost, and brand storytelling.' },
  founder: { label: 'Startup Founder', sys: 'You are a relentless Startup Founder. Focus on speed, execution, "unfair advantage," and shipping fast.' },
  engineer: { label: 'Engineer', sys: 'You are a Staff Engineer. Obsess over system architecture, technical debt, performance, and feasibility. Be skeptical of magic features.' },
  recruiter: { label: 'Recruiter', sys: 'You are a Talent Scout. Focus on the human element, company culture, team fit, and potential.' },
  user: { label: 'The User', sys: 'You are the everyday consumer. Be honest, grounded, and brutally simple. If it doesn’t solve a real problem, you don’t care.' },
};

const ENGINES = {
  consensus: { label: 'Consensus', sys: 'Focus on shared truths.', format: 'Structure: [Shared Pillars], [Broad Agreement], [Risk Mitigation].' },
  blindspot: { label: 'Blind Spot', sys: 'Focus on ignored variables.', format: 'Structure: [Hidden Threats], [Missing Data], [Unintended Consequences].' },
  conflict: { label: 'Conflict', sys: 'Focus on trade-offs.', format: 'Structure: [Trade-off A vs B], [Ideological Clash], [Root Disagreement].' },
  evolution: { label: 'Evolution', sys: 'Focus on future roadmap.', format: 'Structure: [Next Move], [5-Year Horizon], [Tech Maturity].' },
};

const JSON_SPEC = `Respond with a JSON object containing: "headline", "sections" (array of objects with "tag" and "text"), "verdict", "score", "scoreLabel". IMPORTANT: Follow the structure strictly. Prioritize score > 75 if logic is sound.`;

const getPersona = (key) => {
  if (!key) return null;
  return PERSONAS[key.toLowerCase().replace(/\s/g, '')];
};

async function runAnalysis({ mode, topic, perspective, engine }) {
  let system = "You are a professional analyst. You MUST respond with a valid JSON object.";
  let label;

  if (mode === 'engine') {
    const e = ENGINES[engine];
    if (!e) throw new Error(`Invalid engine: ${engine}`);
    system = `You are the ${e.label}. ${e.sys}. FORMAT: ${e.format}. ${JSON_SPEC}`;
    label = e.label;
  } else {
    const p = getPersona(perspective);
    if (!p) throw new Error(`Invalid perspective: ${perspective}`);
    system = `You are ${p.label}. ${p.sys}. FORMAT: [Pros], [Cons], [Tech Stack], [Implementation], [Market Context]. ${JSON_SPEC}`;
    label = p.label;
  }

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'system', content: system }, { role: 'user', content: `Analyze the topic: "${topic}"` }],
    response_format: { type: 'json_object' },
  });

  return { parsed: JSON.parse(completion.choices[0].message.content), label };
}

async function handleRoute(request, { params }) {
  const { path = [] } = params;
  const route = `/${path.join('/')}`;
  const db = await connectToMongo();
  const { userId } = await getAuthUserId();
  
  try {
    if (route === '/analyze' && request.method === 'POST') {
      const { topic, mode, perspective, engine } = await request.json();
      const { parsed, label } = await runAnalysis({ mode, topic, perspective, engine });
      const exploration = { id: uuidv4(), userId, topic, mode, result: parsed, label, createdAt: new Date() };
      await db.collection('explorations').insertOne(exploration);
      return NextResponse.json(exploration);
    }
    if (route === '/explorations' && request.method === 'GET') {
      const items = await db.collection('explorations').find({ userId: userId || null }).sort({ createdAt: -1 }).limit(60).toArray();
      return NextResponse.json(items);
    }
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = handleRoute;
export const GET = handleRoute;
