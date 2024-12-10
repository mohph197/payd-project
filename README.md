# Payd Project

## Requirements

- PHP
- Composer
- MySQL
- Apache

## Installation

1. Clone the repository
2. Run `composer install`

## Configuration

### Environment

```bash
cp .env.example .env
php artisan key:generate
```

#### Environment Variables

```bash
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

## Database

```bash
php artisan migrate --seed
```

## Run

```bash
npm run build
php artisan serve
```
