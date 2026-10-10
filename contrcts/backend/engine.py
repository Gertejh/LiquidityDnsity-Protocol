import time
import numpy as np

class LiquidityEngine:
    def __init__(self, base_price=64000):
        self.base_price = base_price

    def fetch_raw_orderbook(self):
        """Processes leverage and position sizes from derivatives market"""
        prices = np.random.normal(self.base_price, 400, 200)
        sizes = np.random.exponential(150000, 200)
        leverages = np.random.choice([10, 20, 50], 200)  # Исправлено: добавлены плечи
        return list(zip(prices, sizes, leverages))

    def calculate_density_clusters(self, bucket_size=50):
        """Mathematical dynamic-window order clustering for risk walls"""
        raw_data = self.fetch_raw_orderbook()
        clusters = {}
        
        for price, size, lev in raw_data:
            bucket = int(price // bucket_size) * bucket_size
            liquidation_price = bucket if price < self.base_price else bucket + bucket_size
            
            if liquidation_price not in clusters:
                clusters[liquidation_price] = {"volume": 0.0, "weight": 0.0}
            
            risk_weight = size * (lev / 10)
            clusters[liquidation_price]["volume"] += size
            clusters[liquidation_price]["weight"] += risk_weight

        max_weight = max([c["weight"] for c in clusters.values()]) if clusters else 1
        formatted_clusters = []
        
        for price, metrics in clusters.items():
            density_score = int((metrics["weight"] / max_weight) * 100)
            if density_score > 15:
                formatted_clusters.append({
                    "price": price,
                    "volume": round(metrics["volume"], 2),
                    "density": density_score
                })
        return formatted_clusters

if __name__ == "__main__":
    engine = LiquidityEngine()
    print("--- STARTING LOCAL LIQUIDITY CLUSTER CALCULATION ---")
    processed = engine.calculate_density_clusters()
    for cluster in processed[:5]:
        print(f"Trigger Price: ${cluster['price']} | Vol at Risk: ${cluster['volume']:,} | Density: {cluster['density']}/100")
