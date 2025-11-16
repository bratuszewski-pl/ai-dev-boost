# Widok Logowania

## Opis Widoku

Widok logowania umożliwia zarejestrowanym użytkownikom zalogowanie się do aplikacji NoteFlow. Widok zawiera formularz z polami username i password, obsługuje walidację w czasie rzeczywistym oraz wyświetla odpowiednie komunikaty błędów.

**Ścieżka**: `/app/(auth)/login`

## Powiązane User Stories z PRD

### US-002: User Authentication
**Tytuł**: Secure Login
**Opis**: Jako zarejestrowany użytkownik, chcę bezpiecznie zalogować się do mojego konta, aby uzyskać dostęp do moich notatek.
**Kryteria akceptacji**:
- Użytkownik może wprowadzić username i password
- System waliduje dane logowania
- Udane logowanie przekierowuje do dashboardu
- Nieudane logowanie wyświetla odpowiedni komunikat błędu
- Sesja jest utrzymywana bezpiecznie

## Powiązane Endpointy API

### POST /api/auth/login
- **Opis**: Uwierzytelnienie użytkownika i utworzenie sesji
- **Request Payload**:
  - `username`: string (required)
  - `password`: string (required)
- **Response Payload** (200 OK):
  - `message`: string
  - `token`: string (JWT token)
  - `user`: { id: string, username: string }
- **Kody błędów**:
  - `400 Bad Request`: Brak username lub password
  - `401 Unauthorized`: Nieprawidłowe dane logowania
  - `500 Internal Server Error`: Błąd serwera podczas autentykacji

### GET /api/auth/me
- **Opis**: Pobranie informacji o aktualnie zalogowanym użytkowniku
- **Użycie**: Weryfikacja sesji po zalogowaniu
- **Response Payload** (200 OK):
  - `user`: { id: string, username: string, createdAt: ISO 8601 datetime }
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token

## Główne Funkcjonalności

1. Formularz logowania z walidacją
2. Obsługa błędów autentykacji
3. Bezpieczne przechowywanie tokenu JWT
4. Automatyczne przekierowanie po udanym logowaniu
5. Link do strony rejestracji

