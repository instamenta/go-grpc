package builders

import "github.com/chat-go-client/models"

func BuildPagination(skip, limit int32) *models.Pagination {
	pagination := models.Pagination{}
	if skip != 0 {
		pagination.Skip = &skip
	} else {
		var _skip int32 = 0
		pagination.Skip = &_skip
	}
	if limit != 0 {
		pagination.Limit = &limit
	} else {
		var _limit int32 = 10
		pagination.Limit = &_limit
	}
	return &pagination
}
