import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public/data/exchange-rates.json');

async function readRates(): Promise<Record<string, number>> {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {
                "USD": 32.5,
                "BTC": 65000,
                "CNY": 4.5
            };
        }
        throw error;
    }
}

async function writeRates(rates: Record<string, number>): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(rates, null, 2));
}

export async function GET() {
  try {
    const rates = await readRates();
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading rates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const newRates: Record<string, number> = await req.json();
        await writeRates(newRates);
        return NextResponse.json({ message: 'Rates updated successfully', rates: newRates });
    } catch (error) {
        return NextResponse.json({ message: 'Error writing rates' }, { status: 500 });
    }
}
