import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'public/data');
const dataFilePath = path.join(dataDir, 'exchange-rates.json');

const defaultRates = {
    "USD": 32.5,
    "BTC": 65000,
    "CNY": 4.5
};

async function ensureDataFileExists(): Promise<void> {
    try {
        await fs.access(dataFilePath);
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.mkdir(dataDir, { recursive: true });
            await fs.writeFile(dataFilePath, JSON.stringify(defaultRates, null, 2));
        } else {
            throw error;
        }
    }
}

async function readRates(): Promise<Record<string, number>> {
    await ensureDataFileExists();
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
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
