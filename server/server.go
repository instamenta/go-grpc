package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"strings"

	wp "github.com/golang/protobuf/ptypes/wrappers"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	_ "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	pb "guthub.com/chat-go-server/chat"
	"guthub.com/chat-go-server/models"
	"guthub.com/chat-go-server/repositories"
)

type server struct {
	messagesRepo *repositories.Messages
	usersRepo    *repositories.Users
	pb.UnimplementedChatServiceServer
}

func (s *server) GetUser(ctx context.Context, req *pb.GetById) (*pb.User, error) {
	if req.GetId() == nil {
		return nil, status.Error(codes.InvalidArgument, "ID is required")
	}
	user, err := s.usersRepo.GetUser(req.GetId().GetValue(), ctx)
	if err != nil {
		log.Println("Error with getting users", err)
		return nil, err
	}
	return &pb.User{
		Id:   &wp.StringValue{Value: user.ID.Hex()},
		Name: &wp.StringValue{Value: user.Name},
	}, nil
}

func (s *server) SendMessage(ctx context.Context, req *pb.Message) (*pb.Empty, error) {
	if req.GetSender() == nil {
		return nil, status.Error(codes.InvalidArgument, "Sender is required")
	}
	if req.GetRecipient() == nil {
		return nil, status.Error(codes.InvalidArgument, "Recipient is required")
	}
	if req.GetContent() == nil {
		return nil, status.Error(codes.InvalidArgument, "Content is required")
	}
	if err := s.messagesRepo.CreateMessage(
		req.GetSender().GetValue(),
		req.GetRecipient().GetValue(),
		req.GetContent().GetValue(),
		ctx,
	); err != nil {
		return nil, err
	}
	return &pb.Empty{}, nil
}

func (s *server) GetMultipleUsers(req *pb.Pagination, stream pb.ChatService_GetMultipleUsersServer) error {
	pagination := models.Pagination{Limit: 10, Skip: 0}
	if req.GetSkip() != nil {
		pagination.Skip = req.GetSkip().GetValue()
	}
	if req.GetLimit() != nil {
		pagination.Limit = req.GetLimit().GetValue()
	}
	cursor, err := s.usersRepo.GetUsers(&pagination, stream.Context())
	if err != nil {
		return err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Mongo error while closing cursor: %v", err)
		}
	}(cursor, stream.Context())
	for cursor.Next(stream.Context()) {
		var user models.UserDocument
		if err := cursor.Decode(&user); err != nil {
			log.Printf("Error decoding MongoDB document: %v", err)
			return status.Error(codes.Internal, "Error decoding MongoDB document")
		}
		if err := stream.Send(&pb.User{
			Id:   &wp.StringValue{Value: user.ID.Hex()},
			Name: &wp.StringValue{Value: user.Name},
		}); err != nil {
			log.Printf("Error with sending user doc: %v", err)
			return err
		}
	}
	if err := cursor.Err(); err != nil {
		log.Printf("Error during MongoDB cursor iteration: %v", err)
		return status.Error(codes.Internal, "Error during MongoDB cursor iteration")
	}
	log.Println("Ending stream")
	return nil
}

func (s *server) SendMultipleMessages(stream pb.ChatService_SendMultipleMessagesServer) error {
	for {
		req, err := stream.Recv()
		if err == io.EOF {
			return stream.SendAndClose(&pb.Empty{})
		} else if err != nil {
			return err
		}
		if req.GetSender() == nil {
			return status.Error(codes.InvalidArgument, "Sender is required")
		}
		if req.GetRecipient() == nil {
			return status.Error(codes.InvalidArgument, "Recipient is required")
		}
		if req.GetContent() == nil {
			return status.Error(codes.InvalidArgument, "Content is required")
		}
		err = s.messagesRepo.CreateMessage(
			req.GetSender().GetValue(),
			req.GetRecipient().GetValue(),
			req.GetContent().GetValue(),
			stream.Context(),
		)
		if err != nil {
			return err
		}
	}
}

func (s *server) GetMessages(req *pb.GetMessagesRequest, stream pb.ChatService_GetMessagesServer) error {
	if req.GetSender() == nil {
		return status.Error(codes.InvalidArgument, "Sender is required")
	}
	if req.GetRecipient() == nil {
		return status.Error(codes.InvalidArgument, "Recipient is required")
	}
	pagination := models.Pagination{Limit: 10, Skip: 0}
	if req.GetLimit() != nil {
		pagination.Limit = req.GetLimit().GetValue()
	}
	if req.GetSkip() != nil {
		pagination.Skip = req.GetSkip().GetValue()
	}
	cursor, err := s.messagesRepo.GetMessagesBySenderAndRecipient(
		req.GetSender().GetValue(),
		req.GetRecipient().GetValue(),
		&pagination,
		stream.Context(),
	)
	if err != nil {
		log.Printf("Error executing MongoDB query: %v", err)
		return err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Mongo error while closing cursor: %v", err)
		}
	}(cursor, stream.Context())
	for cursor.Next(stream.Context()) {
		var message models.MessageDocument
		if err := cursor.Decode(&message); err != nil {
			log.Printf("Error decoding MongoDB document: %v", err)
			return status.Error(codes.Internal, "Error decoding MongoDB document")
		}
		if err := stream.Send(&pb.Message{
			Sender:    &wp.StringValue{Value: message.Sender.Hex()},
			Recipient: &wp.StringValue{Value: message.Recipient.Hex()},
			Content:   &wp.StringValue{Value: message.Content},
		}); err != nil {
			log.Printf("Error sending message to client: %v", err)
			return err
		}
	}
	if err := cursor.Err(); err != nil {
		log.Printf("Error during MongoDB cursor iteration: %v", err)
		return status.Error(codes.Internal, "Error during MongoDB cursor iteration")
	}
	log.Println("Ending stream")
	return nil
}

func (s *server) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.Empty, error) {
	if req.GetName() == nil {
		return nil, status.Error(codes.InvalidArgument, "Name is required")
	}
	err := s.usersRepo.CreateUser(ctx, req.GetName().GetValue())
	if err != nil {
		return nil, err
	}
	return &pb.Empty{}, nil
}

func main() {
	//* MONGO
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	dbOpts := options.
		Client().
		ApplyURI("mongodb+srv://janoopsi:janoopsi9999@clickercluster.ltycehn.mongodb.net/?retryWrites=true&w=majority").
		SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.TODO(), dbOpts)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	if err = client.Database("chat").
		RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	log.Println("Successfully connected to MongoDB! Starting grpc server...")

	// Grpc Server
	lis, _ := net.Listen("tcp", fmt.Sprintf("localhost:%d", 50051))
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)
	db := client.Database("chat")
	pb.RegisterChatServiceServer(grpcServer, &server{
		messagesRepo: repositories.GetMessagesRepository(db),
		usersRepo:    repositories.GetUsersRepository(db),
	})

	// gRPC gateway
	gwmux := runtime.NewServeMux()
	optsGateway := []grpc.DialOption{grpc.WithInsecure()}
	err = pb.RegisterChatServiceHandlerFromEndpoint(context.TODO(), gwmux, fmt.Sprintf("localhost:%d", 50051), optsGateway)
	if err != nil {
		log.Fatalf("Failed to register gateway: %v", err)
	}

	// HTTP server
	httpServer := &http.Server{
		Addr:    ":8081",
		Handler: grpcHandlerFunc(grpcServer, gwmux),
	}

	// Start servers
	go func() {
		log.Printf("gRPC server listening on %s", lis.Addr())
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC server: %v", err)
		}
	}()

	log.Printf("gRPC gateway listening on %s", httpServer.Addr)
	if err := httpServer.ListenAndServe(); err != nil {
		log.Fatalf("Failed to serve gRPC gateway: %v", err)
	}
}

func grpcHandlerFunc(grpcServer *grpc.Server, other http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.Header.Get("Content-Type"), "application/grpc") {
			grpcServer.ServeHTTP(w, r)
		} else {
			other.ServeHTTP(w, r)
		}
	})
}
