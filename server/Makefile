.PHONY: all proto build run clean

protogen: proto_clean proto

proto_clean:
	rm -rf ./chat/
	mkdir chat

proto:
	protoc -I . \
        -I $(GOPATH)/pkg/mod/github.com/grpc-ecosystem/grpc-gateway/v2@v2.15.2 \
        --go_out=./chat/ \
        --go_opt=paths=source_relative \
        --go-grpc_out=./chat/ \
        --go-grpc_opt=paths=source_relative \
		--grpc-gateway_out=./chat/ \
    	--grpc-gateway_opt=paths=source_relative \
    	--grpc-gateway_opt=generate_unbound_methods=true \
    	--openapiv2_out=./chat/ \
    	--openapiv2_opt=logtostderr=true \
        --openapiv2_opt=generate_unbound_methods=true \
        chat.proto

swagger:
	swagger serve -F=swagger -p 8989 --doc-url localhost:8081 chat/chat.swagger.json

run: build start

build:
	go build -o server

start:
	./server

clean:
	rm -f server
