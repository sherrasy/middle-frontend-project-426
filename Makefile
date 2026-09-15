frontend-build:
	cd frontend && npm run build

backend-build:
	cd backend && npm run build

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && npm run dev

frontend-install:
	cd frontend && npm ci

backend-install:
	cd backend && npm ci

start: 
	cd backend && npm run start

test:
	cd frontend && npm run test:e2e

db-generate:
	cd backend && npm run db:generate

db-migrate:
	cd backend && npm run db:migrate

compile-openapi:
	cd contract && npm run compile

generate-frontend-types:
	cd contract && npm run generate:frontend

generate-backend-types:
	cd contract && npm run generate:backend

mock-contract-server:
	cd contract && npm run mock:api
