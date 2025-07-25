import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Asset } from '@/types';

const dataDir = path.join(process.cwd(), 'public/data');
const dataFilePath = path.join(dataDir, 'assets.json');

async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // If the file doesn't exist, create the directory and the file with an empty array
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
    } else {
      throw error;
    }
  }
}

async function readAssets(): Promise<Asset[]> {
  await ensureDataFileExists();
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeAssets(assets: Asset[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(assets, null, 2));
}

export async function GET() {
  try {
    const assets = await readAssets();
    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newAsset: Asset = await req.json();
    const assets = await readAssets();
    assets.push(newAsset);
    await writeAssets(assets);
    return NextResponse.json({ message: 'Asset added successfully', asset: newAsset }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedAsset: Asset = await req.json();
    let assets = await readAssets();
    const assetIndex = assets.findIndex(a => a.id === updatedAsset.id);

    if (assetIndex === -1) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    assets[assetIndex] = updatedAsset;
    await writeAssets(assets);
    return NextResponse.json({ message: 'Asset updated successfully', asset: updatedAsset });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: 'Asset ID is required' }, { status: 400 });
    }

    let assets = await readAssets();
    const updatedAssets = assets.filter(a => a.id !== id);

    if (assets.length === updatedAssets.length) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    await writeAssets(updatedAssets);
    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}
