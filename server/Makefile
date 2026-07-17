BINARY_NAME=watchlore
MAIN_PACKAGE=./cmd/api
BUILD_DIR=./bin

.PHONY: tidy
tidy:
	go fmt ./...
	go vet ./...
	go mod tidy

.PHONY: lint
lint: 
	golangci-lint run ./...

.PHONY: test
test:
	go test -race -count=1 ./...

.PHONY: build
build: tidy     ## Compile a production binary
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PACKAGE)
	@echo "✓ Binary ready: $(BUILD_DIR)/$(BINARY_NAME)"

.PHONY: run
run:            ## Dev only — run without building a binary
	go run $(MAIN_PACKAGE)/main.go

.PHONY: check
check: tidy lint test   ## Full quality gate before pushing
	@echo "✓ All checks passed"

.PHONY: clean
clean:          ## Delete build artifacts
	rm -rf $(BUILD_DIR)

