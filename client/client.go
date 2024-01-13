package main

import (
	"context"
	"io"
	"log"
	"time"

	"github.com/chat-go-client/builders"
	pb "github.com/chat-go-client/chat"
	"github.com/chat-go-client/models"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	wp "google.golang.org/protobuf/types/known/wrapperspb"
)

type chatClient struct {
	ctx    context.Context
	client pb.ChatServiceClient
}

func (client *chatClient) createUser(data *models.UserModel) {
	_, err := client.client.CreateUser(
		client.ctx,
		&pb.CreateUserRequest{Name: &wp.StringValue{Value: data.Name}},
	)
	if err != nil {
		log.Println("Crashna createUser")
	}
}

func (client *chatClient) sendMessage(data *models.MessageModel) {
	_, err := client.client.SendMessage(client.ctx, &pb.Message{
		Sender:    &wp.StringValue{Value: data.Sender},
		Content:   &wp.StringValue{Value: data.Content},
		Recipient: &wp.StringValue{Value: data.Recipient},
	})
	if err != nil {
		log.Println("Crashna sayhello")
	}
}

func (client *chatClient) getUser(id string) {
	response, err := client.client.GetUser(
		client.ctx,
		&pb.GetById{Id: &wp.StringValue{Value: id}},
	)
	if err != nil {
		log.Println("Crashna getUser", err)
	}
	log.Println(response)
}

func (client *chatClient) GetMessages(data *models.GetMessagesRequest, pagination *models.Pagination) {
	stream, err := client.client.GetMessages(client.ctx, &pb.GetMessagesRequest{
		Sender:    &wp.StringValue{Value: data.Sender},
		Recipient: &wp.StringValue{Value: data.Recipient},
		Skip:      &wp.Int32Value{Value: *pagination.Skip},
		Limit:     &wp.Int32Value{Value: *pagination.Limit},
	})
	if err != nil {
		log.Println("Error calling GetMessages:", err)
		return
	}
	for {
		response, err := stream.Recv()
		if err == io.EOF {
			break
		} else if err != nil {
			log.Println("Error receiving message from stream:", err)
			break
		}
		log.Println("Received message:", response)
	}
}

func (client *chatClient) GetMultipleUsers(pagination *models.Pagination) {
	stream, err := client.client.GetMultipleUsers(client.ctx, &pb.Pagination{
		Skip:  &wp.Int32Value{Value: *pagination.Skip},
		Limit: &wp.Int32Value{Value: *pagination.Limit},
	})
	if err != nil {
		log.Println("GetMultipleUsers getUser", err)
		return
	}
	for {
		response, err := stream.Recv()
		if err == io.EOF {
			log.Println("Stream closed")
			break
		} else if err != nil {
			log.Println("Error receiving message from stream:", err)
			break
		}
		log.Println("Received user:", response)
	}
}

func (client *chatClient) sendMultipleMessages(messages []*models.MessageModel) error {
	stream, err := client.client.SendMultipleMessages(context.Background())
	if err != nil {
		return err
	}

	for _, message := range messages {
		if err := stream.Send(&pb.Message{
			Sender:    &wp.StringValue{Value: message.Sender},
			Content:   &wp.StringValue{Value: message.Content},
			Recipient: &wp.StringValue{Value: message.Recipient},
		}); err != nil {
			return err
		}
	}
	if _, err := stream.CloseAndRecv(); err != nil {
		log.Println(err)
		return err
	}
	log.Println("Finished stream")
	return nil
}

func main() {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	conn, err := grpc.Dial("localhost:50051", opts...)
	if err != nil {
		log.Fatalf("fail to dial: %v", err)
	}
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Println("failed to close connection")
		}
	}(conn)
	client := pb.NewChatServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	c := chatClient{ctx: ctx, client: client}

	c.GetMultipleUsers(builders.BuildPagination(0, 0))
	_ = c.sendMultipleMessages([]*models.MessageModel{
		{Content: "Hello", Sender: "65a154f7db5f54bd19cfd067", Recipient: "65a1588be138b35f7c2d672d"},
		{Content: "Hi", Sender: "65a154f7db5f54bd19cfd067", Recipient: "65a1588be138b35f7c2d672d"},
		{Content: "How are you Ani?", Sender: "65a154f7db5f54bd19cfd067", Recipient: "65a1588be138b35f7c2d672d"},
		{Content: "Crazy :p", Sender: "65a154f7db5f54bd19cfd067", Recipient: "65a1588be138b35f7c2d672d"},
		{Content: "get good noob", Sender: "65a154f7db5f54bd19cfd067", Recipient: "65a1588be138b35f7c2d672d"},
	})
	c.GetMessages(
		&models.GetMessagesRequest{
			Recipient: "65a1588be138b35f7c2d672d",
			Sender:    "65a154f7db5f54bd19cfd067",
		},
		builders.BuildPagination(0, 0),
	)
	c.sendMessage(&models.MessageModel{
		Content:   "Sudurjanie",
		Sender:    "65a154f7db5f54bd19cfd067",
		Recipient: "65a1588be138b35f7c2d672d",
	})
	c.createUser(&models.UserModel{
		Name: "new user",
	})
	c.getUser("65a154f7db5f54bd19cfd067")
}
