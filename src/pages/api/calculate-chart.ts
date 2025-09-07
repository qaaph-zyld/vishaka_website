import { NextApiRequest, NextApiResponse } from 'next';
import { calculateChart } from '../../../server/vedic-calculations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { birthDate, birthTime, latitude, longitude } = req.body;
    
    // Validate input
    if (!birthDate || !birthTime || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Calculate the chart (server-side only)
    const chart = await calculateChart({
      birthDate: new Date(birthDate),
      birthTime: birthTime.toString(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    return res.status(200).json(chart);
  } catch (error: unknown) {
    console.error('Error calculating chart:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ 
      error: 'Failed to calculate chart',
      details: errorMessage
    });
  }
}
