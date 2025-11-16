# Widok Udostępnionych Notatek

## Opis Widoku

Widok udostępnionych notatek wyświetla wszystkie notatki, które zostały udostępnione użytkownikowi przez innych użytkowników. Widok ma taki sam layout jak lista własnych notatek, ale z dodatkowymi informacjami o osobie udostępniającej. Notatki są dostępne tylko do odczytu.

**Ścieżka**: `/app/(notes)/shared`

## Powiązane User Stories z PRD

### US-013: View Shared Notes
**Tytuł**: Access Shared Content
**Opis**: Jako użytkownik, chcę wyświetlić notatki udostępnione mi, aby uzyskać dostęp do treści współdzielonych.
**Kryteria akceptacji**:
- Użytkownik może zobaczyć listę notatek udostępnionych mu
- Udostępnione notatki są wyraźnie oznaczone jako udostępnione
- Użytkownik może zobaczyć pełną treść udostępnionych notatek
- Użytkownik może zobaczyć, kto udostępnił notatkę
- Udostępnione notatki są oddzielone od osobistych notatek

## Powiązane Endpointy API

### GET /api/notes/shared
- **Opis**: Pobranie wszystkich notatek udostępnionych zalogowanemu użytkownikowi
- **Query Parameters**:
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime dla paginacji opartej na kursorze)
- **Response Payload** (200 OK):
  - `notes`: array of SharedNotePreview (z informacją o osobie udostępniającej)
  - `pagination`: { page, limit, hasMore, nextCursor }
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `400 Bad Request`: Nieprawidłowe parametry zapytania
  - `500 Internal Server Error`: Błąd serwera

### GET /api/notes/:id
- **Opis**: Pobranie szczegółów udostępnionej notatki (używane po kliknięciu w notatkę)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (200 OK):
  - `note`: Note object with full content
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie ma dostępu do tej notatki
  - `404 Not Found`: Notatka nie znaleziona
  - `500 Internal Server Error`: Błąd serwera

## Główne Funkcjonalności

1. Lista udostępnionych notatek z infinite scroll
2. Wyświetlanie informacji o osobie udostępniającej (username, data udostępnienia)
3. Oznaczenie notatek jako read-only (brak możliwości edycji)
4. Ten sam layout co lista własnych notatek dla spójności
5. Oddzielny widok od własnych notatek użytkownika
6. Możliwość przejścia do szczegółów notatki (tylko odczyt)
7. Weryfikacja uprawnień do wyświetlania udostępnionych notatek

