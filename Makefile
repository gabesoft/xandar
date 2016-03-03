default: test

BIN = $(CURDIR)/node_modules/.bin
NODE_DEV = $(BIN)/node-dev
ESLINT = $(BIN)/eslint
BROCCOLI = $(BIN)/broccoli
MPR = $(BIN)/mpr
MOCHA = $(BIN)/mocha -u tdd --check-leaks -R mocha-better-spec-reporter
VERSION = $(SHELL node -pe 'require("./package.json").version')
TESTS := $(shell find ./test -name '[^.]*-spec.js')

all: test

.PHONY: release test loc clean

tag:
	@git tag -a "v$(VERSION)" -m "Version $(VERSION)"

tag-push: tag
	@git push --tags origin HEAD:master

clean:
	@$(RM) -r dist

build: clean
	@$(BROCCOLI) build dist

build-serve:
	@$(BROCCOLI) serve --cors --port 4400

build-prod: export NODE_ENV=production
build-prod: build

test: export NODE_ENV=test
test:
	@$(MOCHA) $(TESTS)

lint:
	$(ESLINT) .

lint-fix:
	$(ESLINT) . --fix

loc:
	@find src/ -name *.js | xargs wc -l

run:
	@$(NODE_DEV) server.js

deps: setup

setup:
	@npm install . -d

clean-dep:
	@rm -rf node_modules

deploy: setup build-prod
