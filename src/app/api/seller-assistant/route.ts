import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { dbConnect } from '@/lib/db';
import SellerProfile from '@/models/SellerProfiles.models';
import User from '@/models/User.models';
import { authOptions } from '@/lib/auth-options';
import openrouter from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as any;
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const sellerProfile = await SellerProfile.findOne({ userId: user._id });
    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    if (!openrouter.isOpenRouterConfigured()) {
      return NextResponse.json({ error: 'AI features are not configured' }, { status: 503 });
    }

    const { task, payload } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    let result;

    switch (task) {
      case 'generate-listing': {
        const { name, category, features, costPrice } = payload || {};
        if (!name) return NextResponse.json({ error: 'Product name is required' }, { status: 400 });

        const prompt = `You are an expert E-commerce SEO, Copywriting, and Pricing Analyst.
A seller wants to list a new product. Please generate an optimized product title, a predicted category, a detailed and persuasive product description, a list of 5-10 SEO keywords/tags, and a competitive pricing strategy in Indian Rupees (INR/₹).

Product Name/Basic Idea: ${name}
Category Hint: ${category || 'Unknown'}
Key Features/Details: ${features || 'None provided'}
Estimated Cost Price: ${costPrice ? '₹' + costPrice : 'Unknown'}

Provide a recommended selling price and a brief justification based on general market trends. All prices MUST be in Indian Rupees (INR/₹) without commas (just numbers).

Respond ONLY with a valid JSON object in the following format:
{
  "title": "SEO Optimized Title here",
  "category": "Suggested exact category name like Electronics, Clothing, etc.",
  "description": "Detailed persuasive description here. Use HTML formatting like <p>, <ul>, <li>, <strong> for better presentation.",
  "suggestedPrice": 999,
  "pricingStrategy": "Value-based pricing - Brief justification here",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

        const response = await openrouter.chat([
          { role: 'system', content: 'You are a helpful e-commerce seller assistant that outputs JSON.' },
          { role: 'user', content: prompt }
        ], { temperature: 0.5 });

        try {
          // Attempt to parse JSON response. Sometimes LLMs wrap it in markdown code blocks.
          let cleaned = response.trim();
          if (cleaned.startsWith('\`\`\`json')) cleaned = cleaned.replace(/^\`\`\`json/, '');
          if (cleaned.startsWith('\`\`\`')) cleaned = cleaned.replace(/^\`\`\`/, '');
          if (cleaned.endsWith('\`\`\`')) cleaned = cleaned.replace(/\`\`\`$/, '');
          
          result = JSON.parse(cleaned.trim());
        } catch (e) {
          console.error("Failed to parse JSON from LLM:", response);
          return NextResponse.json({ error: 'Failed to generate a valid listing structure.' }, { status: 500 });
        }
        break;
      }

      case 'general-query': {
        const { query } = payload || {};
        if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 });

        const prompt = `You are an expert E-commerce Seller Assistant for the "Deligo" marketplace.
Answer the seller's question accurately, professionally, and concisely to help them succeed on the platform.

Seller's Question: ${query}

Provide a helpful text response.`;

        const response = await openrouter.chat([
          { role: 'system', content: 'You are a helpful e-commerce seller assistant.' },
          { role: 'user', content: prompt }
        ], { temperature: 0.7 });

        result = { answer: response };
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in seller assistant route:', error);
    return NextResponse.json(
      { error: 'Internal server error processing seller assistant task' },
      { status: 500 }
    );
  }
}
