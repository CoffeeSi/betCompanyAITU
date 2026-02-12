package dto

type AssignRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=user moderator admin"`
}
