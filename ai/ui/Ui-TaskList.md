# Lista Zadań UI - NoteFlow

## Przegląd

Niniejszy dokument zawiera listę wszystkich widoków do utworzenia w aplikacji NoteFlow wraz z ich głównymi funkcjonalnościami. Każdy widok jest powiązany z odpowiednimi user stories z PRD oraz endpointami API.

## Widoki do Utworzenia

### 1. Widok Logowania (LoginView)
**Ścieżka**: `/app/(auth)/login`

**Główne funkcjonalności**:
- Formularz logowania z polami username i password
- Walidacja w czasie rzeczywistym
- Obsługa błędów autentykacji (401)
- Bezpieczne przechowywanie tokenu JWT
- Automatyczne przekierowanie po udanym logowaniu
- Link do strony rejestracji

**Powiązane User Stories**: US-002
**Powiązane Endpointy**: POST /api/auth/login, GET /api/auth/me

---

### 2. Widok Rejestracji (RegisterView)
**Ścieżka**: `/app/(auth)/register`

**Główne funkcjonalności**:
- Formularz rejestracji z polami username i password
- Walidacja formatu username (alfanumeryczne i podkreślenia, 3-50 znaków)
- Sprawdzanie unikalności username w czasie rzeczywistym
- Walidacja długości hasła (minimum 8 znaków)
- Obsługa błędów (409 - username już istnieje)
- Automatyczne przekierowanie do listy notatek po rejestracji
- Link do strony logowania

**Powiązane User Stories**: US-001
**Powiązane Endpointy**: POST /api/auth/register

---

### 3. Widok Listy Notatek (NotesListView)
**Ścieżka**: `/app/(notes)/notes`

**Główne funkcjonalności**:
- Formularz tworzenia notatki na górze strony z tytułem "What's on your mind?"
- Pole tekstowe z licznikiem słów (aktualna/pozostała liczba z 2000)
- Obsługa kopiowania/wklejania obrazów (jeden obraz na notatkę)
- Tworzenie tagów przez składnię `#[tag name]` w treści
- Lista notatek z infinite scroll wykorzystująca cursor-based pagination
- Wyświetlanie podglądu notatek (tytuł, podgląd, kategoria, tagi, słowa kluczowe)
- Status analizy AI (pending, completed, failed) z możliwością ponowienia
- Polling dla statusu analizy AI w czasie rzeczywistym
- Toast notifications dla sukcesu/błędów operacji
- Skeleton loader dla początkowego ładowania
- Filtrowanie i sortowanie notatek (opcjonalnie)

**Powiązane User Stories**: US-003, US-004, US-005, US-006, US-007, US-016
**Powiązane Endpointy**: GET /api/notes, POST /api/notes, POST /api/notes/:id/analyze

---

### 4. Widok Szczegółów Notatki (NoteDetailView)
**Ścieżka**: `/app/(notes)/notes/[id]`

**Główne funkcjonalności**:
- Wyświetlanie pełnej treści notatki (renderowanie Markdown)
- Wyświetlanie klikalnych linków
- Wyświetlanie obrazu (jeśli istnieje) z optymalizacją Next.js Image
- Wyświetlanie metadanych (kategoria, tagi, słowa kluczowe, daty)
- Informacje o udostępnieniu (kto udostępnił, kiedy)
- Status analizy AI z opcją ponowienia
- Edycja notatki (inline lub osobny tryb)
- Udostępnianie notatki innym użytkownikom przez dialog
- Usuwanie notatki
- Obsługa konfliktów wersji (409) z prostymi komunikatami błędów
- Weryfikacja uprawnień (tylko właściciel może edytować)
- Obsługa błędów 403 i 404

**Powiązane User Stories**: US-003, US-004, US-005, US-006, US-012, US-016
**Powiązane Endpointy**: GET /api/notes/:id, PUT /api/notes/:id, DELETE /api/notes/:id, POST /api/notes/:id/analyze, POST /api/notes/:id/share

---

### 5. Widok Udostępnionych Notatek (SharedNotesView)
**Ścieżka**: `/app/(notes)/shared`

**Główne funkcjonalności**:
- Lista udostępnionych notatek z infinite scroll
- Wyświetlanie informacji o osobie udostępniającej (username, data udostępnienia)
- Oznaczenie notatek jako read-only (brak możliwości edycji)
- Ten sam layout co lista własnych notatek dla spójności
- Oddzielny widok od własnych notatek użytkownika
- Możliwość przejścia do szczegółów notatki (tylko odczyt)
- Weryfikacja uprawnień do wyświetlania udostępnionych notatek

**Powiązane User Stories**: US-013
**Powiązane Endpointy**: GET /api/notes/shared, GET /api/notes/:id

---

### 6. Widok Wyszukiwania (SearchView)
**Ścieżka**: `/app/(search)/search`

**Główne funkcjonalności**:
- Zunifikowany interfejs wyszukiwania z przełącznikiem typu wyszukiwania (date, category, keyword, semantic)
- Date picker dla wyszukiwania po zakresie dat
- Selektor kategorii dla wyszukiwania po kategorii
- Pole wprowadzania zapytania dla wyszukiwania słowami kluczowymi/semantycznego
- Lista wyników wyszukiwania z infinite scroll
- Wszystkie wyniki sortowane po dacie (nie po trafności dla semantycznego)
- Wskaźnik ładowania (spinner z tekstem informacyjnym dla wyszukiwania semantycznego)
- Automatyczne przejście na wyszukiwanie słowami kluczowymi przy timeoutcie semantycznego
- Obsługa timeoutu 408 z jasnymi komunikatami
- Walidacja parametrów wyszukiwania przed wysłaniem zapytania

**Powiązane User Stories**: US-008, US-009, US-010, US-011
**Powiązane Endpointy**: GET /api/search

---

### 7. Widok Zarządzania Kategoriami (CategoriesManagementView)
**Ścieżka**: `/app/(categories)/categories`

**Główne funkcjonalności**:
- Lista wszystkich kategorii użytkownika
- Wyświetlanie liczby notatek w każdej kategorii
- Tworzenie nowych kategorii przez dialog
- Edycja nazwy kategorii przez dialog
- Usuwanie kategorii (ciche usunięcie bez potwierdzenia)
- Walidacja unikalności nazwy kategorii (case-insensitive)
- Weryfikacja własności kategorii przed edycją/usunięciem
- Toast notifications dla operacji CRUD
- Obsługa błędów 409 (konflikt nazwy)

**Powiązane User Stories**: US-014
**Powiązane Endpointy**: GET /api/categories, GET /api/categories/:id, POST /api/categories, PUT /api/categories/:id, DELETE /api/categories/:id

---

## Wspólne Komponenty i Funkcjonalności

### Komponenty Nawigacji
- Sidebar (desktop) / Menu hamburger (mobile)
- Linki nawigacyjne do wszystkich głównych widoków

### Komponenty Powiadomień
- Toast notifications dla wszystkich operacji
- Obsługa błędów i sukcesów

### Komponenty Ładowania
- Skeleton loaders dla początkowego ładowania
- Spinners dla operacji w toku
- Wskaźniki postępu dla długich operacji

### Komponenty Formularzy
- Walidacja w czasie rzeczywistym (React Hook Form + Zod)
- Obsługa błędów walidacji
- Liczniki i wskaźniki (np. licznik słów)

### Komponenty Bezpieczeństwa
- Weryfikacja autentykacji na wszystkich chronionych trasach
- Obsługa wygaśnięcia sesji
- Automatyczne odświeżanie tokenów

---

## Priorytety Implementacji

1. **Faza 1 - Autentykacja**: LoginView, RegisterView
2. **Faza 2 - Podstawowe Funkcjonalności**: NotesListView, NoteDetailView
3. **Faza 3 - Zaawansowane Funkcjonalności**: SearchView, CategoriesManagementView
4. **Faza 4 - Współdzielenie**: SharedNotesView

---

## Uwagi Techniczne

- Wszystkie widoki wykorzystują Next.js 14 App Router z grupami tras
- Stan serwerowy zarządzany przez React Query (TanStack Query)
- Stan UI zarządzany przez Zustand
- Komponenty UI oparte na Shadcn/ui i Radix UI
- Styling z Tailwind CSS (mobile-first)
- Formularze z React Hook Form i walidacją Zod
- Renderowanie treści z React Markdown
- Obrazy z Next.js Image component

