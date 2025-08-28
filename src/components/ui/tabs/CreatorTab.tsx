"use client";

import React, { useState, useEffect } from 'react';
import { useMiniApp } from "@neynar/react";
import { useNeynarUser } from "../../../hooks/useNeynarUser";

interface CreatorProfile {
  username: string;
  fid: number;
  displayName: string;
  pfp: string;
  followerCount: number;
  creatorCoinSymbol: string;
  creatorCoinPrice: number;
  creatorCoinSupply: number;
  zoraAddress?: string;
}

interface CreatorCoin {
  symbol: string;
  name: string;
  price: number;
  supply: number;
  marketCap: number;
  holders: number;
  creator: string;
}

export default function CreatorTab() {
  const { context } = useMiniApp();
  const { user: neynarUser } = useNeynarUser(context || undefined);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [creatorCoins, setCreatorCoins] = useState<CreatorCoin[]>([]);
  const [showCreateCoin, setShowCreateCoin] = useState(false);
  const [newCoinData, setNewCoinData] = useState({
    symbol: '',
    name: '',
    initialSupply: 1000000,
    initialPrice: 0.01,
  });

  // Mock data for demonstration
  useEffect(() => {
    if (neynarUser) {
      setCreatorProfile({
        username: neynarUser.username,
        fid: neynarUser.fid,
        displayName: neynarUser.displayName || neynarUser.username,
        pfp: neynarUser.pfp?.url || '',
        followerCount: neynarUser.followerCount || 0,
        creatorCoinSymbol: 'SNAKE',
        creatorCoinPrice: 0.05,
        creatorCoinSupply: 1000000,
        zoraAddress: '0x1234...5678',
      });
    }

    // Mock creator coins data
    setCreatorCoins([
      {
        symbol: 'SNAKE',
        name: 'Snake Game Token',
        price: 0.05,
        supply: 1000000,
        marketCap: 50000,
        holders: 150,
        creator: 'snake.eth',
      },
      {
        symbol: 'FARCASTER',
        name: 'Farcaster Protocol Token',
        price: 2.50,
        supply: 10000000,
        marketCap: 25000000,
        holders: 5000,
        creator: 'dwr.eth',
      },
      {
        symbol: 'NEYNAR',
        name: 'Neynar Platform Token',
        price: 1.20,
        supply: 5000000,
        marketCap: 6000000,
        holders: 2500,
        creator: 'neynar.eth',
      },
    ]);
  }, [neynarUser]);

  const connectZoraAccount = async () => {
    try {
      // Here you would integrate with Zora's API to connect accounts
      console.log('Connecting Zora account...');
      // This would typically involve wallet connection and API calls
    } catch (error) {
      console.error('Error connecting Zora account:', error);
    }
  };

  const createCreatorCoin = async () => {
    try {
      if (!newCoinData.symbol || !newCoinData.name) {
        alert('Please fill in all fields');
        return;
      }

      // Here you would integrate with your backend to create the coin
      console.log('Creating creator coin:', newCoinData);
      
      // Mock creation
      const newCoin: CreatorCoin = {
        symbol: newCoinData.symbol,
        name: newCoinData.name,
        price: newCoinData.initialPrice,
        supply: newCoinData.initialSupply,
        marketCap: newCoinData.initialPrice * newCoinData.initialSupply,
        holders: 1,
        creator: neynarUser?.username || 'unknown',
      };

      setCreatorCoins(prev => [newCoin, ...prev]);
      setShowCreateCoin(false);
      setNewCoinData({ symbol: '', name: '', initialSupply: 1000000, initialPrice: 0.01 });
    } catch (error) {
      console.error('Error creating creator coin:', error);
    }
  };

  const buyCreatorCoin = async (symbol: string, price: number) => {
    try {
      // Here you would integrate with your backend to process the purchase
      console.log(`Buying ${symbol} at ${price}`);
      // This would involve wallet transactions and smart contract calls
    } catch (error) {
      console.error('Error buying creator coin:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Creator Profile Section */}
      {creatorProfile && (
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            {creatorProfile.pfp ? (
              <img 
                src={creatorProfile.pfp} 
                alt={creatorProfile.displayName}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {creatorProfile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{creatorProfile.displayName}</h2>
              <p className="text-blue-200">@{creatorProfile.username}</p>
              <p className="text-sm text-gray-300">{creatorProfile.followerCount} followers</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="text-sm text-gray-300">Creator Coin</div>
              <div className="text-xl font-bold text-yellow-400">{creatorProfile.creatorCoinSymbol}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="text-sm text-gray-300">Current Price</div>
              <div className="text-xl font-bold text-green-400">${creatorProfile.creatorCoinPrice}</div>
            </div>
          </div>
        </div>
      )}

      {/* Zora Integration */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔗 Connect Zora Account</h3>
        <p className="text-gray-300 mb-4">
          Connect your Zora account to publish creator coins and participate in the creator economy.
        </p>
        
        {creatorProfile?.zoraAddress ? (
          <div className="bg-green-900 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-white">Connected to Zora</span>
            </div>
            <p className="text-sm text-green-200 mt-1">Address: {creatorProfile.zoraAddress}</p>
          </div>
        ) : (
          <button
            onClick={connectZoraAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Connect Zora Account
          </button>
        )}
      </div>

      {/* Create Creator Coin */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">🪙 Create Creator Coin</h3>
          <button
            onClick={() => setShowCreateCoin(!showCreateCoin)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            {showCreateCoin ? 'Cancel' : 'Create New'}
          </button>
        </div>
        
        {showCreateCoin && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                <input
                  type="text"
                  value={newCoinData.symbol}
                  onChange={(e) => setNewCoinData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., SNAKE"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newCoinData.name}
                  onChange={(e) => setNewCoinData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Snake Game Token"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Supply</label>
                <input
                  type="number"
                  value={newCoinData.initialSupply}
                  onChange={(e) => setNewCoinData(prev => ({ ...prev, initialSupply: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  min="1000"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Price ($)</label>
                <input
                  type="number"
                  value={newCoinData.initialPrice}
                  onChange={(e) => setNewCoinData(prev => ({ ...prev, initialPrice: parseFloat(e.target.value) }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  min="0.001"
                  step="0.001"
                />
              </div>
            </div>
            <button
              onClick={createCreatorCoin}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
            >
              Create Creator Coin
            </button>
          </div>
        )}
      </div>

      {/* Creator Coins Marketplace */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">🏪 Creator Coins Marketplace</h3>
        <div className="space-y-3">
          {creatorCoins.map((coin, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🪙</span>
                    <div>
                      <h4 className="text-lg font-bold text-white">{coin.symbol}</h4>
                      <p className="text-sm text-gray-300">{coin.name}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">${coin.price}</div>
                  <div className="text-sm text-gray-400">Market Cap: ${coin.marketCap.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-400">Supply:</span>
                  <div className="text-white">{coin.supply.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-400">Holders:</span>
                  <div className="text-white">{coin.holders}</div>
                </div>
                <div>
                  <span className="text-gray-400">Creator:</span>
                  <div className="text-blue-400">@{coin.creator}</div>
                </div>
              </div>
              
              <button
                onClick={() => buyCreatorCoin(coin.symbol, coin.price)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
              >
                Buy {coin.symbol}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Economy Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💡 About Creator Economy</h3>
        <div className="space-y-3 text-gray-300">
                      <p>
              Creator coins allow fans to invest in their favorite creators and share in their success. 
              When you buy a creator coin, you&apos;re supporting their work and potentially earning rewards.
            </p>
          <p>
            Connect your Zora account to create your own creator coin, set initial pricing, 
            and start building your creator economy.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Create and manage your own creator coin</li>
            <li>Set initial supply and pricing</li>
            <li>Trade creator coins on the marketplace</li>
            <li>Earn from your creative work</li>
            <li>Build a community around your brand</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
