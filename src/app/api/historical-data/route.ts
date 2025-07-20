import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { HistoricalData } from '@/types';

const dataFilePath = path.join(process.cwd(), 'public/data/historical-data.json');

async function readHistoricalData(): Promise<HistoricalData[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeHistoricalData(data: HistoricalData[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const historicalData = await readHistoricalData();
    return NextResponse.json(historicalData);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newSnapshot: HistoricalData = await req.json();
    const historicalData = await readHistoricalData();
    
    const existingIndex = historicalData.findIndex(d => d.date === newSnapshot.date);
    if (existingIndex !== -1) {
      historicalData[existingIndex] = newSnapshot;
    } else {
      historicalData.push(newSnapshot);
    }

    historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await writeHistoricalData(historicalData);
    return NextResponse.json({ message: 'Historical data updated successfully', snapshot: newSnapshot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const updatedData: HistoricalData = await req.json();
      let historicalData = await readHistoricalData();
      const dataIndex = historicalData.findIndex(d => d.date === updatedData.date);
  
      if (dataIndex === -1) {
        return NextResponse.json({ message: 'Historical data not found for this date' }, { status: 404 });
      }
  
      historicalData[dataIndex] = updatedData;
      await writeHistoricalData(historicalData);
      return NextResponse.json({ message: 'Historical data updated successfully', data: updatedData });
    } catch (error) {
      return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request) {
    try {
      const { date } = await req.json();
      if (!date) {
        return NextResponse.json({ message: 'Date is required' }, { status: 400 });
      }
  
      let historicalData = await readHistoricalData();
      const updatedHistoricalData = historicalData.filter(d => d.date !== date);
  
      if (historicalData.length === updatedHistoricalData.length) {
        return NextResponse.json({ message: 'Historical data not found for this date' }, { status: 404 });
      }
  
      await writeHistoricalData(updatedHistoricalData);
      return NextResponse.json({ message: 'Historical data deleted successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
    }
  }
