// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LiquidityDensityRegistry
 * @dev Stores aggregated market risk clusters and manages on-chain subscriptions.
 */
contract LiquidityDensityRegistry {
    address public owner;
    
    struct LiquidationCluster {
        uint256 priceTrigger;
        uint256 volumeAtRisk;
        uint256 densityScore; // 1-100 hazard rating
        uint256 updatedAt;
    }
    
    // keccak256("BTC/USDC") => Array of dangerous liquidation clusters
    mapping(bytes32 => LiquidationCluster[]) private marketClusters;
    mapping(address => uint256) public subscriberExpiry;
    
    event ClusterUpdated(bytes32 indexed marketKey, uint256 priceTrigger, uint256 volumeAtRisk);
    event SubscriptionPurchased(address indexed subscriber, uint256 expiry);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: Owner only");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Pushes fresh algorithmic risk data into the smart contract.
     */
    function updateClusters(
        bytes32 marketKey, 
        uint256[] calldata prices, 
        uint256[] calldata volumes, 
        uint256[] calldata densities
    ) external onlyOwner {
        require(prices.length == volumes.length && volumes.length == densities.length, "Data arrays length mismatch");
        delete marketClusters[marketKey];
        
        for(uint256 i = 0; i < prices.length; i++) {
            marketClusters[marketKey].push(LiquidationCluster({
                priceTrigger: prices[i],
                volumeAtRisk: volumes[i],
                densityScore: densities[i],
                updatedAt: block.timestamp
            }));
            emit ClusterUpdated(marketKey, prices[i], volumes[i]);
        }
    }

    /**
     * @notice Allows institutional bots to unlock premium on-chain data streams.
     */
    function purchaseSubscription() external payable {
        require(msg.value >= 0.01 ether, "Insufficient Arbitrum ETH payment"); 
        subscriberExpiry[msg.sender] = block.timestamp + 30 days;
        emit SubscriptionPurchased(msg.sender, subscriberExpiry[msg.sender]);
    }

    function getClusters(bytes32 marketKey) external view returns (LiquidationCluster[] memory) {
        require(msg.sender == owner || subscriberExpiry[msg.sender] >= block.timestamp, "Access denied: Subscription inactive");
        return marketClusters[marketKey];
    }
}
