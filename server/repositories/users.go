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

type Users struct {
	col *mongo.Collection
}

func GetUsersRepository(db *mongo.Database) *Users {
	return &Users{col: db.Collection("user")}
}

func (repo *Users) CreateUser(ctx context.Context, name string) error {
	doc := bson.M{"name": name}
	result, err := repo.col.InsertOne(ctx, doc)
	if err != nil {
		fmt.Println("MongoDB error", err)
		return status.Error(codes.Internal, "MongoDB insert operation failed")
	}
	log.Printf("Inserted document ID: %v\n", result.InsertedID)
	return nil
}

func (repo *Users) GetUsers(pagination *models.Pagination, ctx context.Context) (*mongo.Cursor, error) {
	ops := options.Find().SetSkip(int64(pagination.Skip)).SetLimit(int64(pagination.Limit))
	cursor, err := repo.col.Find(ctx, bson.M{}, ops)
	if err != nil {
		log.Printf("Error executing MongoDB query: %v", err)
		return nil, status.Error(codes.Internal, "Error executing MongoDB query")
	}
	return cursor, nil
}

func (repo *Users) GetUser(id string, ctx context.Context) (*models.UserDocument, error) {
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("ID: %v is invalid", id))
	}
	filter := bson.M{
		"_id": _id,
	}
	result := repo.col.FindOne(ctx, filter)
	if err := result.Err(); err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("ID: %v not found", id))
	}
	var user models.UserDocument
	if err := result.Decode(&user); err != nil {
		return nil, status.Error(codes.Internal, "Failed to decode user")
	}
	fmt.Printf("User ID: %s, Name: %s\n", user.ID.Hex(), user.Name)
	return &user, nil
}
