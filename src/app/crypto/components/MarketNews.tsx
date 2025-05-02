import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, MessageSquare, Users, Award, ThumbsUp,
  ThumbsDown, Share2, BarChart2, AlertTriangle
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: number;
  impact: 'positive' | 'negative' | 'neutral';
  sentiment: number;
  likes: number;
  comments: number;
  shares: number;
}

interface Trader {
  id: string;
  name: string;
  avatar: string;
  profit: number;
  profitPercentage: number;
  followers: number;
  trades: number;
  winRate: number;
}

export function MarketNews() {
  const [activeTab, setActiveTab] = useState<'news' | 'social' | 'leaderboard'>('news');
  const [newsFilter, setNewsFilter] = useState<'all' | 'positive' | 'negative'>('all');

  // Mock news data
  const news: NewsItem[] = [
    {
      id: '1',
      title: 'Major Crime Family Invests Heavily in MFIA',
      content: 'A prominent crime family has announced a significant investment in MFIA tokens, citing the platform\'s security features and reliability.',
      source: 'Underground Times',
      timestamp: Date.now() - 1800000,
      impact: 'positive',
      sentiment: 85,
      likes: 156,
      comments: 43,
      shares: 28
    },
    {
      id: '2',
      title: 'OMRT Reaches New All-Time High',
      content: 'OmertaCoin (OMRT) has surged to a new all-time high following increased adoption in underground markets.',
      source: 'Crypto Underground',
      timestamp: Date.now() - 3600000,
      impact: 'positive',
      sentiment: 92,
      likes: 234,
      comments: 67,
      shares: 89
    },
    {
      id: '3',
      title: 'Security Concerns Surface for SHDY',
      content: 'Security researchers have identified potential vulnerabilities in ShadowCoin\'s privacy features.',
      source: 'DarkNet Daily',
      timestamp: Date.now() - 7200000,
      impact: 'negative',
      sentiment: 35,
      likes: 89,
      comments: 145,
      shares: 56
    }
  ];

  // Mock top traders data
  const topTraders: Trader[] = [
    {
      id: '1',
      name: 'Shadow Master',
      avatar: '/images/avatars/trader1.png',
      profit: 50000,
      profitPercentage: 125,
      followers: 1234,
      trades: 456,
      winRate: 78
    },
    {
      id: '2',
      name: 'Crypto King',
      avatar: '/images/avatars/trader2.png',
      profit: 35000,
      profitPercentage: 85,
      followers: 987,
      trades: 321,
      winRate: 72
    },
    {
      id: '3',
      name: 'Dark Trader',
      avatar: '/images/avatars/trader3.png',
      profit: 28000,
      profitPercentage: 65,
      followers: 765,
      trades: 234,
      winRate: 68
    }
  ];

  // Filter news based on impact
  const filteredNews = newsFilter === 'all'
    ? news
    : news.filter(item => item.impact === newsFilter);

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-2">
        {(['news', 'social', 'leaderboard'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* News Feed */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex space-x-2 mb-4">
            {(['all', 'positive', 'negative'] as const).map((filter) => (
              <Button
                key={filter}
                variant={newsFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setNewsFilter(filter)}
                className={`capitalize ${
                  newsFilter === filter
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>

          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  item.impact === 'positive'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {item.sentiment}% Sentiment
                </div>
              </div>
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{item.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <MessageSquare className="w-4 h-4" />
                  <span>{item.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <Share2 className="w-4 h-4" />
                  <span>{item.shares}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Social Feed */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">Popular Discussions</h3>
            <div className="space-y-4">
              {['OMRT Price Prediction', 'MFIA Security Analysis', 'BNDT Trading Strategy'].map((topic, index) => (
                <motion.div
                  key={topic}
                  className="bg-gray-700/30 rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-white font-medium mb-2">{topic}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {Math.floor(Math.random() * 100)} participants
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {Math.floor(Math.random() * 50)} messages
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {topTraders.map((trader, index) => (
            <motion.div
              key={trader.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={trader.avatar} alt={trader.name} className="w-full h-full object-cover" />
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{trader.name}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-400">+${trader.profit.toLocaleString()}</span>
                    <span className="text-green-400">+{trader.profitPercentage}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Followers: {trader.followers.toLocaleString()}</div>
                    <div>Trades: {trader.trades}</div>
                    <div>Win Rate: {trader.winRate}%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 