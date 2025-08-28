import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// Initialize Neynar client (for future use)
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || '',
});

const _client = new NeynarAPIClient(config);

interface GameScore {
  fid: number;
  username: string;
  score: number;
  timestamp: number;
  gameMode: string;
}

// In-memory storage for demo purposes
// In production, use a proper database
let gameScores: GameScore[] = [
  { fid: 5650, username: "vitalik.eth", score: 150, timestamp: Date.now(), gameMode: "classic" },
  { fid: 3, username: "dwr.eth", score: 120, timestamp: Date.now(), gameMode: "classic" },
  { fid: 1234, username: "alice.eth", score: 100, timestamp: Date.now(), gameMode: "classic" },
  { fid: 5678, username: "bob.eth", score: 80, timestamp: Date.now(), gameMode: "classic" },
  { fid: 9012, username: "charlie.eth", score: 60, timestamp: Date.now(), gameMode: "classic" },
];

// GET: Fetch leaderboard
export async function GET() {
  try {
    // Sort by score (highest first) and return top 10
    const leaderboard = gameScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// POST: Submit new score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, score, gameMode = "classic" } = body;

    // Validate input
    if (!fid || !username || typeof score !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Create new score entry
    const newScore: GameScore = {
      fid,
      username,
      score,
      timestamp: Date.now(),
      gameMode,
    };

    // Add to scores array
    gameScores.push(newScore);

    // Keep only top 100 scores to prevent memory issues
    if (gameScores.length > 100) {
      gameScores = gameScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
    }

    // Optional: Post to Farcaster if user is connected
    if (process.env.NEYNAR_API_KEY && fid) {
      try {
        // This would require additional setup with your backend
        // to handle Farcaster posting with proper authentication
        console.log(`New high score posted: ${username} scored ${score} in ${gameMode} mode`);
      } catch (farcasterError) {
        console.error('Error posting to Farcaster:', farcasterError);
        // Don't fail the request if Farcaster posting fails
      }
    }

    return NextResponse.json({
      success: true,
      data: newScore,
      message: 'Score submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}

// PUT: Update existing score
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, newScore } = body;

    if (!fid || typeof newScore !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Find and update existing score
    const scoreIndex = gameScores.findIndex(score => score.fid === fid);
    if (scoreIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Score not found' },
        { status: 404 }
      );
    }

    // Only update if new score is higher
    if (newScore > gameScores[scoreIndex].score) {
      gameScores[scoreIndex].score = newScore;
      gameScores[scoreIndex].timestamp = Date.now();

      return NextResponse.json({
        success: true,
        data: gameScores[scoreIndex],
        message: 'Score updated successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'New score is not higher than existing score',
      });
    }
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update score' },
      { status: 500 }
    );
  }
}
