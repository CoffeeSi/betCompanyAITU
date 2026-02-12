package dto

type MarketOddsResponse struct {
	MarketID   uint               `json:"market_id"`
	MarketType string             `json:"market_type"`
	Odds       map[string]float64 `json:"odds"`
}
