package repositories

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"guthub.com/chat-go-server/models"
)

type Messages struct {
	col *mongo.Collection
}

func GetMessagesRepository(db *mongo.Database) *Messages {
	return &Messages{col: db.Collection("messages")}
}

func (repo *Messages) GetMessagesBySenderAndRecipient(
	sender, recipient string, pagination *models.Pagination, ctx context.Context,
) (*mongo.Cursor, error) {
	senderId, err := primitive.ObjectIDFromHex(sender)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "Sender is invalid ObjectId")
	}
	recipientId, err := primitive.ObjectIDFromHex(recipient)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "Recipient is invalid ObjectId")
	}
	filter := bson.M{
		"sender":    senderId,
		"recipient": recipientId,
	}
	ops := options.Find().SetSkip(int64(pagination.Skip)).SetLimit(int64(pagination.Limit))
	cursor, err := repo.col.Find(ctx, filter, ops)
	if err != nil {
		return nil, status.Error(codes.Internal, "MongoDB error")
	}
	return cursor, nil
}

func (repo *Messages) CreateMessage(sender, recipient, content string, ctx context.Context) error {
	senderID, err := primitive.ObjectIDFromHex(sender)
	if err != nil {
		return status.Error(codes.InvalidArgument, "Sender is invalid ObjectId")
	}
	recipientID, err := primitive.ObjectIDFromHex(recipient)
	if err != nil {
		return status.Error(codes.InvalidArgument, "Recipient is invalid ObjectId")
	}
	doc := bson.M{
		"sender":    senderID,
		"content":   content,
		"recipient": recipientID,
	}
	log.Printf("Received message from client: %v", content)
	result, err := repo.col.InsertOne(ctx, doc)
	if err != nil {
		return status.Error(codes.Internal, fmt.Sprintf("Mongo error: %v", err))
	}
	log.Println("Inserted message with ID: ", result.InsertedID)
	return nil
}
