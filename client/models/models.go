package models

type UserModel struct {
	Name string
}

type MessageModel struct {
	Sender    string
	Content   string
	Recipient string
}

type GetMessagesRequest struct {
	Recipient string
	Sender    string
}

type Pagination struct {
	Limit *int32
	Skip  *int32
}
