default: test

BIN = $(CURDIR)/node_modules/.bin
MOCHA = $(BIN)/mocha -u tdd --check-leaks
VERSION = $(SHELL node -pe 'require("./package.json").version')

all: test

.PHONY: release test loc clean no_targets__ help

no_targets__:
help:
	@sh -c "$(MAKE) -rpn no_targets__ | awk -F':' '/^[a-zA-Z0-9][^\$$#\/\\t=]*:([^=]|$$)/ {split(\$$1,A,/ /);for(i in A)print A[i]}' | grep -v '__\$$' | grep -v 'Makefile' | grep -v 'make\[1\]' | sort"

tag:
	@git tag -a "v$(VERSION)" -m "Version $(VERSION)"

tag-push: tag
	@git push --tags origin HEAD:master

test:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --grep @slow --invert

test-slow:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --grep @slow --timeout 10000

test-all:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --timeout 10000

lint:
	$(ESLINT) .

loc:
	@find src/ -name *.js | xargs wc -l

deps: setup

setup:
	@npm install . -d

clean-dep:
	@rm -rf node_modules

