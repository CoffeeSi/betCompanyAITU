package dto

type SportResponse struct {
	Sports []SportItem `json:"sports"`
}

type SportItem struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
