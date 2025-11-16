# Widok Wyszukiwania

## Opis Widoku

Widok wyszukiwania umożliwia wielomodalne wyszukiwanie notatek użytkownika. Obsługuje wyszukiwanie po dacie, kategorii, słowach kluczowych oraz semantyczne wyszukiwanie. Wszystkie typy wyszukiwania są dostępne w jednym zunifikowanym interfejsie.

**Ścieżka**: `/app/(search)/search`

## Powiązane User Stories z PRD

### US-008: Search by Date
**Tytuł**: Find Notes by Date
**Opis**: Jako użytkownik, chcę wyszukać notatki po dacie, aby znaleźć treści z określonych okresów czasowych.
**Kryteria akceptacji**:
- Użytkownik może wybrać zakres dat
- System zwraca notatki utworzone w zakresie dat
- Wyniki są wyświetlane w porządku chronologicznym
- Puste wyniki wyświetlają odpowiedni komunikat
- Date picker jest przyjazny dla użytkownika

### US-009: Search by Category
**Tytuł**: Filter Notes by Category
**Opis**: Jako użytkownik, chcę filtrować notatki po kategorii, aby znaleźć powiązane treści.
**Kryteria akceptacji**:
- Użytkownik może wybrać z istniejących kategorii
- System wyświetla notatki w wybranej kategorii
- Lista kategorii zawiera wszystkie kategorie użytkownika
- Użytkownik może wybrać wiele kategorii
- Wyniki wyraźnie pokazują nazwę kategorii

### US-010: Keyword Search
**Tytuł**: Search Notes by Keywords
**Opis**: Jako użytkownik, chcę wyszukać notatki używając słów kluczowych, aby znaleźć określone treści.
**Kryteria akceptacji**:
- Użytkownik może wprowadzić terminy wyszukiwania
- System przeszukuje treść notatek i wygenerowane słowa kluczowe
- Wyniki są rankingowane według trafności
- Wyszukiwanie jest niewrażliwe na wielkość liter
- Częściowe dopasowania są obsługiwane

### US-011: Semantic Search
**Tytuł**: Intelligent Content Search
**Opis**: Jako użytkownik, chcę wyszukać notatki używając języka naturalnego, aby znaleźć treści nawet gdy nie pamiętam dokładnych terminów.
**Kryteria akceptacji**:
- Użytkownik może wprowadzić zapytania w języku naturalnym
- System używa Qdrant do wyszukiwania semantycznego
- Wyniki zawierają koncepcyjnie powiązane treści
- Czas odpowiedzi wyszukiwania jest poniżej 1 minuty
- Wyniki są rankingowane według podobieństwa semantycznego

## Powiązane Endpointy API

### GET /api/search
- **Opis**: Wielomodalny endpoint wyszukiwania obsługujący wyszukiwanie po dacie, kategorii, słowach kluczowych i semantyczne
- **Query Parameters**:
  - `type`: string (required, "date" | "category" | "keyword" | "semantic")
  - `query`: string (required dla keyword i semantic, optional dla innych)
  - `startDate`: string (optional, ISO 8601 date, required dla wyszukiwania po dacie)
  - `endDate`: string (optional, ISO 8601 date, required dla wyszukiwania po dacie)
  - `categoryId`: string (optional, required dla wyszukiwania po kategorii)
  - `tags`: string (optional, tagi oddzielone przecinkami)
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
- **Response Payload** (200 OK):
  - `results`: array of SearchResult
  - `pagination`: { page, limit, total, hasMore }
  - `searchType`: string
  - `queryTime`: number (milliseconds)
- **Kody błędów**:
  - `400 Bad Request`: Nieprawidłowy typ wyszukiwania lub brakujące wymagane parametry
  - `401 Unauthorized`: Nieprawidłowy lub brakujący token
  - `408 Request Timeout`: Wyszukiwanie semantyczne przekroczyło timeout 1 minuty
  - `500 Internal Server Error`: Błąd serwera

## Główne Funkcjonalności

1. Zunifikowany interfejs wyszukiwania z przełącznikiem typu wyszukiwania
2. Date picker dla wyszukiwania po zakresie dat
3. Selektor kategorii dla wyszukiwania po kategorii
4. Pole wprowadzania zapytania dla wyszukiwania słowami kluczowymi/semantycznego
5. Lista wyników wyszukiwania z infinite scroll
6. Wszystkie wyniki sortowane po dacie (nie po trafności dla semantycznego)
7. Wskaźnik ładowania (spinner z tekstem informacyjnym dla wyszukiwania semantycznego)
8. Automatyczne przejście na wyszukiwanie słowami kluczowymi przy timeoutcie semantycznego
9. Obsługa timeoutu 408 z jasnymi komunikatami
10. Walidacja parametrów wyszukiwania przed wysłaniem zapytania

