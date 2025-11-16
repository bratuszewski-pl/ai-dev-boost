# Widok Zarządzania Kategoriami

## Opis Widoku

Widok zarządzania kategoriami umożliwia użytkownikowi przeglądanie, tworzenie, edycję i usuwanie swoich kategorii. Widok wyświetla listę wszystkich kategorii użytkownika z liczbą notatek w każdej kategorii.

**Ścieżka**: `/app/(categories)/categories`

## Powiązane User Stories z PRD

### US-014: Manage Categories
**Tytuł**: Organize Categories
**Opis**: Jako użytkownik, chcę zarządzać moimi kategoriami notatek, aby efektywnie organizować moje treści.
**Kryteria akceptacji**:
- Użytkownik może wyświetlić wszystkie istniejące kategorie
- Użytkownik może utworzyć nowe kategorie ręcznie
- Użytkownik może zmienić nazwę istniejących kategorii
- Użytkownik może zobaczyć liczbę notatek na kategorię
- Kategorie są hierarchiczne, gdy ma to zastosowanie

## Powiązane Endpointy API

### GET /api/categories
- **Opis**: Pobranie wszystkich kategorii dla zalogowanego użytkownika
- **Query Parameters**:
  - `includeCounts`: boolean (optional, default: false, uwzględnia liczbę notatek na kategorię)
- **Response Payload** (200 OK):
  - `categories`: array of Category (z opcjonalną liczbą notatek)
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `500 Internal Server Error`: Błąd serwera

### GET /api/categories/:id
- **Opis**: Pobranie pojedynczej kategorii po ID
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (200 OK):
  - `category`: CategoryWithCount object
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej kategorii
  - `404 Not Found`: Kategoria nie znaleziona
  - `500 Internal Server Error`: Błąd serwera

### POST /api/categories
- **Opis**: Utworzenie nowej kategorii
- **Request Payload**:
  - `name`: string (required, min: 1, max: 100, unique per user)
- **Response Payload** (201 Created):
  - `message`: string
  - `category`: Category object
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe lub błędy walidacji
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `409 Conflict`: Nazwa kategorii już istnieje dla użytkownika
  - `500 Internal Server Error`: Błąd serwera

### PUT /api/categories/:id
- **Opis**: Aktualizacja nazwy istniejącej kategorii
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Payload**:
  - `name`: string (required, min: 1, max: 100, unique per user)
- **Response Payload** (200 OK):
  - `message`: string
  - `category`: Category object
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe lub błędy walidacji
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej kategorii
  - `404 Not Found`: Kategoria nie znaleziona
  - `409 Conflict`: Nazwa kategorii już istnieje dla użytkownika
  - `500 Internal Server Error`: Błąd serwera

### DELETE /api/categories/:id
- **Opis**: Usunięcie kategorii (notatki z tą kategorią będą miały categoryId ustawione na null)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (200 OK):
  - `message`: string
  - `notesUpdated`: number (liczba notatek, które miały categoryId ustawione na null)
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej kategorii
  - `404 Not Found`: Kategoria nie znaleziona
  - `500 Internal Server Error`: Błąd serwera

## Główne Funkcjonalności

1. Lista wszystkich kategorii użytkownika
2. Wyświetlanie liczby notatek w każdej kategorii
3. Tworzenie nowych kategorii przez dialog
4. Edycja nazwy kategorii przez dialog
5. Usuwanie kategorii (ciche usunięcie bez potwierdzenia)
6. Walidacja unikalności nazwy kategorii (case-insensitive)
7. Weryfikacja własności kategorii przed edycją/usunięciem
8. Toast notifications dla operacji CRUD
9. Obsługa błędów 409 (konflikt nazwy)

