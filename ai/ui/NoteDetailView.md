# Widok Szczegółów Notatki

## Opis Widoku

Widok szczegółów notatki wyświetla pełną treść notatki wraz z wszystkimi metadanymi, umożliwiając edycję, udostępnianie oraz zarządzanie notatką. Każda notatka ma unikalny URL umożliwiający bezpośrednie linkowanie.

**Ścieżka**: `/app/(notes)/notes/[id]`

## Powiązane User Stories z PRD

### US-003: Create Text Note
**Tytuł**: Add Text Note
**Opis**: Jako zalogowany użytkownik, chcę utworzyć notatkę tekstową, aby zapisać ważne informacje.
**Kryteria akceptacji**:
- Użytkownik może wprowadzić treść notatki do 2000 słów
- System automatycznie zapisuje timestamp utworzenia
- Notatka jest zapisana w kolekcji użytkownika
- Analiza AI rozpoczyna się automatycznie
- Użytkownik otrzymuje potwierdzenie pomyślnego zapisu

### US-004: Add Links to Notes
**Tytuł**: Include Links in Notes
**Opis**: Jako użytkownik, chcę dodać linki do moich notatek, aby odwoływać się do zewnętrznych zasobów.
**Kryteria akceptacji**:
- Użytkownik może wkleić lub wpisać URL do notatek
- System waliduje format URL
- Linki są klikalne w widoku notatki
- Linki są uwzględniane w analizie AI
- Nieprawidłowe URL wyświetlają komunikat błędu

### US-005: Upload Images to Notes
**Tytuł**: Attach Images to Notes
**Opis**: Jako użytkownik, chcę przesłać obrazy do moich notatek, aby uwzględnić treści wizualne.
**Kryteria akceptacji**:
- Użytkownik może przesłać pliki obrazów
- System akceptuje popularne formaty obrazów (JPG, PNG, GIF)
- Obrazy są wyświetlane w widoku notatki
- Obrazy są przetwarzane do analizy AI
- Limity rozmiaru plików są egzekwowane

### US-006: AI Content Analysis
**Tytuł**: Automatic Content Analysis
**Opis**: Jako użytkownik, chcę, aby moje notatki były automatycznie analizowane, aby generowane były słowa kluczowe i kategorie.
**Kryteria akceptacji**:
- System przetwarza treść notatki używając OpenAI
- Słowa kluczowe są automatycznie generowane
- Treść jest kategoryzowana lub tworzona jest nowa kategoria
- Analiza kończy się w rozsądnym czasie
- Użytkownik jest powiadamiany, gdy analiza jest zakończona

### US-012: Share Note with User
**Tytuł**: Share Notes
**Opis**: Jako użytkownik, chcę udostępnić notatkę innemu użytkownikowi, aby współpracować nad informacjami.
**Kryteria akceptacji**:
- Użytkownik może wybrać notatkę do udostępnienia
- Użytkownik może wprowadzić username odbiorcy
- System waliduje, że odbiorca istnieje
- Odbiorca otrzymuje powiadomienie o udostępnionej notatce
- Udostępniona notatka pojawia się w dostępnych notatkach odbiorcy

### US-016: Error Handling for AI Processing
**Tytuł**: Handle AI Analysis Failures
**Opis**: Jako użytkownik, chcę, aby system obsługiwał błędy przetwarzania AI elegancko, aby móc kontynuować korzystanie z aplikacji.
**Kryteria akceptacji**:
- System wyświetla odpowiedni komunikat błędu, gdy analiza AI nie powiedzie się
- Notatka jest nadal zapisana bez analizy AI
- Użytkownik może ponownie uruchomić analizę AI ręcznie
- System loguje błędy do debugowania
- Aplikacja pozostaje funkcjonalna podczas awarii AI

## Powiązane Endpointy API

### GET /api/notes/:id
- **Opis**: Pobranie pojedynczej notatki po ID z pełną treścią
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (200 OK):
  - `note`: Note object with full content, metadata, sharing information
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie ma dostępu do tej notatki
  - `404 Not Found`: Notatka nie znaleziona
  - `500 Internal Server Error`: Błąd serwera

### PUT /api/notes/:id
- **Opis**: Aktualizacja istniejącej notatki z kontrolą optymistycznej współbieżności
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Payload**:
  - `content`: { text?: string, links?: string[], images?: string[] }
  - `categoryId`: string (optional)
  - `tags`: string[] (optional)
  - `version`: number (required, aktualna wersja dla optymistycznego blokowania)
- **Response Payload** (200 OK):
  - `message`: string
  - `note`: Updated Note object
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe, błędy walidacji lub niezgodność wersji
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej notatki
  - `404 Not Found`: Notatka nie znaleziona
  - `409 Conflict`: Konflikt wersji (wykryta współbieżna aktualizacja)
  - `413 Payload Too Large`: Rozmiar pliku obrazu przekracza limit
  - `500 Internal Server Error`: Błąd serwera

### DELETE /api/notes/:id
- **Opis**: Trwałe usunięcie notatki (hard delete)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (200 OK):
  - `message`: string
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej notatki
  - `404 Not Found`: Notatka nie znaleziona
  - `500 Internal Server Error`: Błąd serwera

### POST /api/notes/:id/analyze
- **Opis**: Ręczne uruchomienie analizy AI dla notatki (ponowienie nieudanej analizy)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Response Payload** (202 Accepted):
  - `message`: string
  - `noteId`: string
  - `status`: "pending"
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie ma dostępu do tej notatki
  - `404 Not Found`: Notatka nie znaleziona
  - `429 Too Many Requests`: Przekroczony limit dla przetwarzania AI
  - `500 Internal Server Error`: Błąd serwera

### POST /api/notes/:id/share
- **Opis**: Udostępnienie notatki innemu użytkownikowi
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Payload**:
  - `username`: string (required, username odbiorcy)
- **Response Payload** (200 OK):
  - `message`: string
  - `noteId`: string
  - `sharedWith`: { userId: string, username: string }
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe lub nie można udostępnić sobie
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `403 Forbidden`: Użytkownik nie jest właścicielem tej notatki
  - `404 Not Found`: Notatka nie znaleziona lub użytkownik odbiorcy nie znaleziony
  - `409 Conflict`: Notatka już udostępniona temu użytkownikowi
  - `500 Internal Server Error`: Błąd serwera

## Główne Funkcjonalności

1. Wyświetlanie pełnej treści notatki (renderowanie Markdown)
2. Wyświetlanie klikalnych linków
3. Wyświetlanie obrazu (jeśli istnieje) z optymalizacją
4. Wyświetlanie metadanych (kategoria, tagi, słowa kluczowe, daty)
5. Informacje o udostępnieniu (kto udostępnił, kiedy)
6. Status analizy AI z opcją ponowienia
7. Edycja notatki (inline lub osobny tryb)
8. Udostępnianie notatki innym użytkownikom
9. Usuwanie notatki
10. Obsługa konfliktów wersji (409) z prostymi komunikatami błędów
11. Weryfikacja uprawnień (tylko właściciel może edytować)
12. Obsługa błędów 403 i 404

