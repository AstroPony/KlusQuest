"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import NavigationBreadcrumb, { NavigationPatterns } from "@/components/ui/NavigationBreadcrumb";

type RewardRequest = {
  id: string;
  kidId: string;
  kidName: string;
  rewardId: string;
  rewardName: string;
  rewardDescription: string;
  coinCost: number;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'denied';
  parentNotes?: string;
};

type ParentRewardManagerProps = {
  householdId: string;
};

export default function ParentRewardManager({ householdId }: ParentRewardManagerProps) {
  const { user, isLoaded } = useUser();
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RewardRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [parentNotes, setParentNotes] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockRequests: RewardRequest[] = [
      {
        id: 'req-1',
        kidId: 'kid-1',
        kidName: 'Emma',
        rewardId: 'toy-1',
        rewardName: 'LEGO Set',
        rewardDescription: 'Build amazing creations with this LEGO set',
        coinCost: 50,
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending'
      },
      {
        id: 'req-2',
        kidId: 'kid-2',
        kidName: 'Lucas',
        rewardId: 'activity-1',
        rewardName: 'Movie Night',
        rewardDescription: 'Choose a movie for family movie night',
        coinCost: 40,
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: 'pending'
      },
      {
        id: 'req-3',
        kidId: 'kid-1',
        kidName: 'Emma',
        rewardId: 'privilege-1',
        rewardName: 'Extra Screen Time',
        rewardDescription: '30 minutes extra screen time today',
        coinCost: 15,
        requestedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'approved',
        parentNotes: 'Good behavior this week!'
      }
    ];
    
    setRewardRequests(mockRequests);
    setLoading(false);
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      // In real app, this would call an API
      setRewardRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const, parentNotes }
          : req
      ));
      
      setShowDetails(false);
      setSelectedRequest(null);
      setParentNotes('');
      
      // Show success message
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to approve reward request:', error);
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      // In real app, this would call an API
      setRewardRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'denied' as const, parentNotes }
          : req
      ));
      
      setShowDetails(false);
      setSelectedRequest(null);
      setParentNotes('');
      
      // Show success message
    } catch (error) {
      console.error('Failed to deny reward request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/20';
      case 'approved': return 'text-green-500 bg-green-500/20';
      case 'denied': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'denied': return '❌';
      default: return '❓';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-4">🔄</div>
        <p>Loading reward requests...</p>
      </div>
    );
  }

  const pendingRequests = rewardRequests.filter(req => req.status === 'pending');
  const processedRequests = rewardRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <NavigationBreadcrumb 
        items={NavigationPatterns.rewardManagement} 
        className="mb-4"
      />
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">👑 Parent Reward Manager</h2>
        <p className="text-muted">Review and manage your kids' reward requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-yellow-500">{pendingRequests.length}</div>
          <div className="text-sm text-muted">Pending Requests</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-green-500">
            {rewardRequests.filter(req => req.status === 'approved').length}
          </div>
          <div className="text-sm text-muted">Approved Today</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-blue-500">
            {rewardRequests.filter(req => req.status === 'denied').length}
          </div>
          <div className="text-sm text-muted">Denied Today</div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">⏳ Pending Requests</h3>
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div 
                key={request.id}
                className="p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedRequest(request);
                  setShowDetails(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{request.kidName}</span>
                      <span className="text-sm text-muted">wants</span>
                      <span className="font-semibold">{request.rewardName}</span>
                    </div>
                    <p className="text-sm text-muted mb-2">{request.rewardDescription}</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                        {request.coinCost} Coins
                      </span>
                      <span className="text-xs bg-gray-500/20 text-gray-500 px-2 py-1 rounded">
                        {formatTimeAgo(request.requestedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted">Click to review</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">📋 Recent Decisions</h3>
          <div className="space-y-3">
            {processedRequests.map(request => (
              <div 
                key={request.id}
                className="flex items-center justify-between p-3 border border-white/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)} {request.status}
                  </span>
                  <span className="font-medium">{request.kidName}</span>
                  <span className="text-muted">→</span>
                  <span>{request.rewardName}</span>
                </div>
                <div className="text-sm text-muted">
                  {formatTimeAgo(request.requestedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Requests Message */}
      {rewardRequests.length === 0 && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold mb-2">No Reward Requests</h3>
          <p className="text-muted">Your kids haven't requested any rewards yet.</p>
        </div>
      )}

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Review Reward Request</h3>
              <p className="text-muted">Make a decision for {selectedRequest.kidName}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedRequest.rewardName}</h4>
                <p className="text-sm text-muted mb-2">{selectedRequest.rewardDescription}</p>
                <div className="text-yellow-500 font-semibold">
                  Cost: {selectedRequest.coinCost} Coins
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Parent Notes (Optional)</label>
                <textarea
                  value={parentNotes}
                  onChange={(e) => setParentNotes(e.target.value)}
                  placeholder="Add a note about your decision..."
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg resize-none"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="btn btn-success flex-1"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleDeny(selectedRequest.id)}
                className="btn btn-error flex-1"
              >
                ❌ Deny
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRequest(null);
                  setParentNotes('');
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h4 className="font-semibold mb-2">💡 How to Manage Rewards</h4>
        <div className="text-sm text-muted space-y-1">
          <p>• <strong>Review Requests:</strong> Click on pending requests to see details</p>
          <p>• <strong>Add Notes:</strong> Include reasons for approval or denial</p>
          <p>• <strong>Quick Decisions:</strong> Approve or deny with one click</p>
          <p>• <strong>Track History:</strong> See all recent decisions</p>
        </div>
      </div>
    </div>
  );
} 