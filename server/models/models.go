package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserDocument struct {
	ID   primitive.ObjectID `bson:"_id"`
	Name string             `bson:"name"`
}

type MessageDocument struct {
	ID        primitive.ObjectID `bson:"_id"`
	Sender    primitive.ObjectID `bson:"sender"`
	Recipient primitive.ObjectID `bson:"recipient"`
	Content   string             `bson:"content"`
}

type Pagination struct {
	Skip  int32
	Limit int32
}
