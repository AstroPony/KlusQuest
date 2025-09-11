"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import NavigationBreadcrumb, { NavigationPatterns } from "@/components/ui/NavigationBreadcrumb";

type Reward = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'toy' | 'activity' | 'privilege' | 'special';
  coinCost: number;
  xpRequired: number;
  available: boolean;
  approved: boolean;
  claimed: boolean;
};

type RewardCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const rewardCategories: RewardCategory[] = [
  {
    id: 'toy',
    name: 'Toys & Games',
    icon: '🧸',
    description: 'Fun toys and games to play with'
  },
  {
    id: 'activity',
    name: 'Activities',
    icon: '🎯',
    description: 'Special activities and experiences'
  },
  {
    id: 'privilege',
    name: 'Privileges',
    icon: '👑',
    description: 'Special privileges and permissions'
  },
  {
    id: 'special',
    name: 'Special Rewards',
    icon: '⭐',
    description: 'Unique and special rewards'
  }
];

type RewardCatalogProps = {
  kidId: string;
  kidXp: number;
  kidCoins: number;
  onRewardClaim: (rewardId: string, cost: number) => void;
  isParent?: boolean;
};

export default function RewardCatalog({ 
  kidId, 
  kidXp, 
  kidCoins, 
  onRewardClaim, 
  isParent = false 
}: RewardCatalogProps) {
  const { user, isLoaded } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('toy');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Mock rewards data - in real app, this would come from API
  useEffect(() => {
    const mockRewards: Reward[] = [
      // Toy Category
      {
        id: 'toy-1',
        name: 'LEGO Set',
        description: 'Build amazing creations with this LEGO set',
        image: '🧱',
        category: 'toy',
        coinCost: 50,
        xpRequired: 100,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'toy-2',
        name: 'Board Game',
        description: 'Family board game for fun evenings',
        image: '🎲',
        category: 'toy',
        coinCost: 30,
        xpRequired: 50,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'toy-3',
        name: 'Art Supplies',
        description: 'Creative art kit with paints and brushes',
        image: '🎨',
        category: 'toy',
        coinCost: 25,
        xpRequired: 75,
        available: true,
        approved: false,
        claimed: false
      },
      
      // Activity Category
      {
        id: 'activity-1',
        name: 'Movie Night',
        description: 'Choose a movie for family movie night',
        image: '🎬',
        category: 'activity',
        coinCost: 40,
        xpRequired: 80,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'activity-2',
        name: 'Park Visit',
        description: 'Special trip to the playground',
        image: '🎠',
        category: 'activity',
        coinCost: 20,
        xpRequired: 30,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'activity-3',
        name: 'Baking Day',
        description: 'Bake cookies with parent supervision',
        image: '🍪',
        category: 'activity',
        coinCost: 35,
        xpRequired: 60,
        available: true,
        approved: false,
        claimed: false
      },
      
      // Privilege Category
      {
        id: 'privilege-1',
        name: 'Extra Screen Time',
        description: '30 minutes extra screen time today',
        image: '📱',
        category: 'privilege',
        coinCost: 15,
        xpRequired: 25,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'privilege-2',
        name: 'Choose Dinner',
        description: 'Pick what\'s for dinner tonight',
        image: '🍕',
        category: 'privilege',
        coinCost: 25,
        xpRequired: 40,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'privilege-3',
        name: 'Stay Up Late',
        description: '15 minutes extra bedtime',
        image: '🌙',
        category: 'privilege',
        coinCost: 45,
        xpRequired: 90,
        available: true,
        approved: false,
        claimed: false
      },
      
      // Special Category
      {
        id: 'special-1',
        name: 'Special Surprise',
        description: 'A mystery reward from your parents',
        image: '🎁',
        category: 'special',
        coinCost: 100,
        xpRequired: 200,
        available: true,
        approved: false,
        claimed: false
      },
      {
        id: 'special-2',
        name: 'Custom Reward',
        description: 'Create your own special reward',
        image: '✨',
        category: 'special',
        coinCost: 75,
        xpRequired: 150,
        available: true,
        approved: false,
        claimed: false
      }
    ];
    
    setRewards(mockRewards);
  }, []);

  const filteredRewards = rewards.filter(reward => reward.category === selectedCategory);
  const canAfford = (reward: Reward) => kidCoins >= reward.coinCost && kidXp >= reward.xpRequired;

  const handleClaimReward = (reward: Reward) => {
    if (!canAfford(reward)) return;
    
    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    if (selectedReward) {
      onRewardClaim(selectedReward.id, selectedReward.coinCost);
      
      // Update local state
      setRewards(prev => prev.map(r => 
        r.id === selectedReward.id ? { ...r, claimed: true } : r
      ));
      
      setShowClaimModal(false);
      setSelectedReward(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'toy': return 'from-blue-500/20 to-purple-500/20 border-blue-500/30';
      case 'activity': return 'from-green-500/20 to-teal-500/20 border-green-500/30';
      case 'privilege': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'special': return 'from-pink-500/20 to-red-500/20 border-pink-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <NavigationBreadcrumb 
        items={NavigationPatterns.rewardManagement} 
        className="mb-4"
      />
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎁 Reward Catalog</h2>
        <p className="text-muted">Spend your coins on amazing rewards!</p>
      </div>

      {/* Current Balance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-yellow-500">{kidCoins}</div>
          <div className="text-sm text-muted">Available Coins</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-primary">{kidXp}</div>
          <div className="text-sm text-muted">Total XP</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {rewardCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary text-white border-primary'
                : 'bg-white/5 border-white/20 hover:border-primary/40'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map(reward => (
          <div 
            key={reward.id}
            className={`card p-4 transition-all duration-200 ${
              reward.claimed 
                ? 'bg-green-500/20 border-green-500/30 opacity-60' 
                : canAfford(reward)
                  ? 'hover:scale-105 hover:shadow-lg'
                  : 'opacity-60'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{reward.image}</div>
              <h3 className="font-semibold mb-2">{reward.name}</h3>
              <p className="text-sm text-muted mb-3">{reward.description}</p>
              
              {/* Requirements */}
              <div className="flex justify-center gap-2 mb-3">
                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                  {reward.coinCost} Coins
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {reward.xpRequired} XP
                </span>
              </div>
              
              {/* Status */}
              {reward.claimed ? (
                <div className="text-green-500 font-semibold">✅ Claimed</div>
              ) : !canAfford(reward) ? (
                <div className="text-red-500 text-sm">
                  {kidCoins < reward.coinCost && `Need ${reward.coinCost - kidCoins} more coins`}
                  {kidXp < reward.xpRequired && `Need ${reward.xpRequired - kidXp} more XP`}
                </div>
              ) : (
                <button
                  onClick={() => handleClaimReward(reward)}
                  className="btn btn-primary btn-sm w-full"
                >
                  🎁 Claim Reward
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`card p-6 max-w-md w-full mx-4 bg-gradient-to-r ${getCategoryColor(selectedReward.category)}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedReward.image}</div>
              <h3 className="text-xl font-bold mb-2">Claim {selectedReward.name}?</h3>
              <p className="text-muted mb-4">{selectedReward.description}</p>
              
              <div className="text-lg mb-4">
                <div className="text-yellow-500">Cost: {selectedReward.coinCost} Coins</div>
                <div className="text-primary">Required: {selectedReward.xpRequired} XP</div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmClaim}
                  className="btn btn-primary flex-1"
                >
                  🎁 Yes, Claim It!
                </button>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h4 className="font-semibold mb-2">💡 How Rewards Work</h4>
        <div className="text-sm text-muted space-y-1">
          <p>• <strong>Earn Coins:</strong> Complete chores and play mini-games</p>
          <p>• <strong>Gain XP:</strong> Build your level through daily activities</p>
          <p>• <strong>Claim Rewards:</strong> Spend coins on items you've unlocked</p>
          <p>• <strong>Parent Approval:</strong> Some rewards may need parent permission</p>
        </div>
      </div>
    </div>
  );
} 