install:
    pnpm install

dev:
    pnpm dev

build:
    pnpm build

test:
    pnpm vitest run --coverage

e2e:
    pnpm playwright test

lint:
    pnpm eslint . && pnpm prettier --check .

typecheck:
    pnpm tsc --noEmit

check: lint typecheck test e2e

storybook:
    pnpm exec storybook dev -p 6006

storybook-build:
    pnpm exec storybook build
