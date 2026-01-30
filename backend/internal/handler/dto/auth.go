package dto

type RegisterRequest struct {
	FullName        string `json:"full_name" binding:"required,min=2,max=100"`
	Email           string `json:"email" binding:"required,email,max=100"`
	Phone           string `json:"phone" binding:"required,e164"`
	Dob             string `json:"dob" binding:"required,datetime=2006-01-02"`
	Password        string `json:"password" binding:"required,min=8,max=100"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
