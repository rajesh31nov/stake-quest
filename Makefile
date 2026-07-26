.PHONY: all build test clean check fmt

all: build test

build:
	cargo build --target wasm32-unknown-unknown --release

test:
	cargo test

check:
	cargo check --all-targets

fmt:
	cargo fmt --all -- --check

clean:
	cargo clean
