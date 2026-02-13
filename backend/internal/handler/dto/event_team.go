package dto

type EventTeamResponse struct {
	TeamIDs []int8 `json:"team_ids"`
}

type AssignTeamRequest struct {
	EventID uint   `json:"event_id" binding:"required"`
	TeamID  uint   `json:"team_id" binding:"required"`
	Role    string `json:"role" binding:"required,oneof=home away"`
}

type AssignTeamsRequest struct {
	Teams []AssignTeamRequest `json:"teams" binding:"required,min=2,max=2,dive"`
}
