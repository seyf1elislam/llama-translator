import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/',
});

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    const prompt =
      req.nextUrl.searchParams.get('prompt') || 'Hello ,How are you ?';

    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const message = response.choices[0].message;

    return Response.json(message);
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
