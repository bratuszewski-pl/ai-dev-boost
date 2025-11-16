# Widok Listy Notatek

## Opis Widoku

Widok listy notatek jest głównym widokiem aplikacji, umożliwiającym tworzenie nowych notatek oraz przeglądanie wszystkich zapisanych notatek użytkownika. Widok zawiera formularz tworzenia notatki na górze strony oraz listę notatek z infinite scroll poniżej.

**Ścieżka**: `/app/(notes)/notes`

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

### US-007: View All Notes
**Tytuł**: Browse Note Collection
**Opis**: Jako użytkownik, chcę wyświetlić wszystkie moje zapisane notatki, aby zobaczyć moją kompletną kolekcję.
**Kryteria akceptacji**:
- Użytkownik może zobaczyć listę wszystkich notatek
- Notatki wyświetlają tytuł, datę utworzenia i kategorię
- Notatki są sortowane według daty utworzenia (najnowsze pierwsze)
- Użytkownik może kliknąć na dowolną notatkę, aby zobaczyć pełną treść
- Paginacja obsługuje duże kolekcje notatek

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

### GET /api/notes
- **Opis**: Pobranie paginowanej listy notatek użytkownika z opcjonalnym filtrowaniem i sortowaniem
- **Query Parameters**:
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime dla paginacji opartej na kursorze)
  - `categoryId`: string (optional, filtrowanie po kategorii)
  - `tags`: string (optional, tagi oddzielone przecinkami)
  - `sortBy`: string (optional, "createdAt" | "updatedAt", default: "createdAt")
  - `sortOrder`: string (optional, "asc" | "desc", default: "desc")
- **Response Payload** (200 OK):
  - `notes`: array of NotePreview
  - `pagination`: { page, limit, hasMore, nextCursor }
- **Kody błędów**:
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `400 Bad Request`: Nieprawidłowe parametry zapytania
  - `500 Internal Server Error`: Błąd serwera

### POST /api/notes
- **Opis**: Utworzenie nowej notatki i uruchomienie analizy AI
- **Request Payload**:
  - `content`: { text: string (required, max: 2000 words), links?: string[], images?: string[] }
  - `categoryId`: string (optional)
  - `tags`: string[] (optional)
- **Response Payload** (201 Created):
  - `message`: string
  - `note`: Note object with aiAnalysisStatus: "pending"
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowe dane wejściowe, błędy walidacji lub treść przekracza 2000 słów
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `404 Not Found`: Kategoria nie znaleziona (jeśli categoryId podane)
  - `413 Payload Too Large`: Rozmiar pliku obrazu przekracza limit
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

## Główne Funkcjonalności

1. Formularz tworzenia notatki z tytułem "What's on your mind?"
2. Pole tekstowe z licznikiem słów (aktualna/pozostała liczba z 2000)
3. Obsługa kopiowania/wklejania obrazów (jeden obraz na notatkę)
4. Tworzenie tagów przez składnię `#[tag name]` w treści
5. Lista notatek z infinite scroll
6. Wyświetlanie podglądu notatek (tytuł, podgląd, kategoria, tagi, słowa kluczowe)
7. Status analizy AI (pending, completed, failed) z możliwością ponowienia
8. Polling dla statusu analizy AI w czasie rzeczywistym
9. Toast notifications dla sukcesu/błędów operacji
10. Skeleton loader dla początkowego ładowania

