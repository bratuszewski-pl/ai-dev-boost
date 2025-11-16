# Widok Rejestracji

## Opis Widoku

Widok rejestracji umożliwia nowym użytkownikom utworzenie konta w aplikacji NoteFlow. Widok zawiera formularz z polami username i password, waliduje unikalność username oraz zapewnia bezpieczne tworzenie konta.

**Ścieżka**: `/app/(auth)/register`

## Powiązane User Stories z PRD

### US-001: User Registration
**Tytuł**: Create User Account
**Opis**: Jako nowy użytkownik, chcę utworzyć konto z unikalnym username, aby uzyskać dostęp do aplikacji do zarządzania notatkami.
**Kryteria akceptacji**:
- Użytkownik może wprowadzić unikalny username
- System waliduje unikalność username
- Użytkownik może ustawić bezpieczne hasło
- Konto jest utworzone pomyślnie
- Użytkownik jest przekierowany do głównego interfejsu aplikacji

## Powiązane Endpointy API

### POST /api/auth/register
- **Opis**: Rejestracja nowego konta użytkownika
- **Request Payload**:
  - `username`: string (required, unique, min: 3, max: 50)
  - `password`: string (required, min: 8)
- **Response Payload** (201 Created):
  - `message`: string
  - `user`: { id: string, username: string, createdAt: ISO 8601 datetime }
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe lub błędy walidacji
  - `409 Conflict`: Username już istnieje
  - `500 Internal Server Error`: Błąd serwera podczas rejestracji

## Główne Funkcjonalności

1. Formularz rejestracji z walidacją
2. Sprawdzanie unikalności username w czasie rzeczywistym
3. Walidacja formatu username (alfanumeryczne i podkreślenia)
4. Walidacja długości hasła (minimum 8 znaków)
5. Obsługa błędów (username już istnieje, nieprawidłowy format)
6. Automatyczne przekierowanie do listy notatek po rejestracji
7. Link do strony logowania

