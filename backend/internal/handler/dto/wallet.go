package dto

type WalletAmountRequest struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}
