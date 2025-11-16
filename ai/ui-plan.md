# Architektura Interfejsu Użytkownika dla NoteFlow

## 1. Przegląd Struktury UI

NoteFlow to aplikacja webowa do zarządzania notatkami z wykorzystaniem sztucznej inteligencji do automatycznej kategoryzacji i semantycznego wyszukiwania. Interfejs użytkownika jest zbudowany w oparciu o Next.js 14 z App Router, wykorzystując grupy tras do logicznej organizacji funkcjonalności.

Aplikacja składa się z dwóch głównych sekcji:
- **Sekcja autentykacji** (`(auth)`) - niezależne strony logowania i rejestracji
- **Sekcja aplikacji** (`(app)`) - główna funkcjonalność dostępna po zalogowaniu

Architektura opiera się na podejściu mobile-first z responsywną adaptacją tego samego interfejsu na wszystkich urządzeniach. Nawigacja wykorzystuje sidebar na desktopie i menu hamburger na urządzeniach mobilnych.

Zarządzanie stanem jest podzielone na:
- **React Query (TanStack Query)** - dla wszystkich danych serwerowych (notatki, kategorie, wyniki wyszukiwania)
- **Zustand** - dla stanu UI po stronie klienta (modały, filtry, stan formularzy)

Komponenty UI są oparte na bibliotece Shadcn/ui zbudowanej na Radix UI, zapewniając dostępność i spójność designu.

## 2. Lista Widoków

### 2.1 Widok Logowania
- **Ścieżka**: `/app/(auth)/login`
- **Główny cel**: Umożliwienie użytkownikom zalogowania się do aplikacji
- **Kluczowe informacje do wyświetlenia**:
  - Formularz logowania z polami username i password
  - Link do strony rejestracji
  - Komunikaty błędów autentykacji
- **Kluczowe komponenty widoku**:
  - `LoginForm` - formularz logowania z walidacją (React Hook Form + Zod)
  - `AuthLayout` - layout dla stron autentykacji
  - `ErrorMessage` - wyświetlanie błędów walidacji i autentykacji
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Walidacja w czasie rzeczywistym z jasnymi komunikatami błędów
  - Wsparcie dla nawigacji klawiaturowej
  - Bezpieczne przechowywanie tokenów JWT
  - Automatyczne przekierowanie po udanym logowaniu
  - Obsługa błędów 401 z jasnymi komunikatami

### 2.2 Widok Rejestracji
- **Ścieżka**: `/app/(auth)/register`
- **Główny cel**: Umożliwienie nowym użytkownikom utworzenia konta
- **Kluczowe informacje do wyświetlenia**:
  - Formularz rejestracji z polami username (min 3, max 50 znaków) i password (min 8 znaków)
  - Link do strony logowania
  - Komunikaty walidacji i błędów (np. username już istnieje)
- **Kluczowe komponenty widoku**:
  - `RegisterForm` - formularz rejestracji z walidacją
  - `AuthLayout` - wspólny layout dla autentykacji
  - `PasswordStrengthIndicator` - wskaźnik siły hasła (opcjonalnie)
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Walidacja formatu username (tylko alfanumeryczne i podkreślenia)
  - Sprawdzanie unikalności username w czasie rzeczywistym
  - Wsparcie dla screen readerów
  - Rate limiting dla ochrony przed atakami brute force
  - Automatyczne przekierowanie do listy notatek po rejestracji

### 2.3 Widok Listy Notatek
- **Ścieżka**: `/app/(notes)/notes`
- **Główny cel**: Główny widok aplikacji umożliwiający tworzenie i przeglądanie notatek
- **Kluczowe informacje do wyświetlenia**:
  - Formularz tworzenia notatki na górze strony z tytułem "What's on your mind?"
  - Lista notatek z infinite scroll
  - Dla każdej notatki: tytuł, podgląd, kategoria, tagi, słowa kluczowe, data utworzenia
  - Status analizy AI (pending, completed, failed) z możliwością ponowienia
  - Licznik słów podczas tworzenia (aktualna/pozostała liczba z 2000)
- **Kluczowe komponenty widoku**:
  - `NoteCreationForm` - formularz tworzenia notatki z obsługą obrazów (copy/paste), tagów (#[tag name]), licznikiem słów
  - `NotesList` - lista notatek z infinite scroll wykorzystująca `useInfiniteQuery`
  - `NoteCard` - karta pojedynczej notatki z możliwością rozszerzenia szczegółów
  - `AIAnalysisBadge` - badge pokazujący status analizy AI
  - `RetryAnalysisButton` - przycisk do ponowienia analizy dla nieudanych analiz
  - `WordCounter` - komponent licznika słów z wizualnymi ostrzeżeniami
  - `SkeletonLoader` - skeleton loader dla początkowego ładowania
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Infinite scroll z automatycznym ładowaniem kolejnych notatek
  - Obsługa kopiowania/wklejania obrazów (jeden obraz na notatkę)
  - Tworzenie tagów przez składnię `#[tag name]` w treści
  - Toast notifications dla sukcesu/błędów operacji
  - Polling dla statusu analizy AI w czasie rzeczywistym
  - Responsywny layout dostosowujący się do rozmiaru ekranu
  - Wsparcie dla nawigacji klawiaturowej w liście

### 2.4 Widok Szczegółów Notatki
- **Ścieżka**: `/app/(notes)/notes/[id]`
- **Główny cel**: Wyświetlenie pełnej treści notatki z możliwością edycji i udostępniania
- **Kluczowe informacje do wyświetlenia**:
  - Pełna treść notatki (tekst renderowany przez React Markdown)
  - Linki jako klikalne elementy
  - Obraz (jeśli istnieje) wyświetlany jako część treści
  - Kategoria, tagi, słowa kluczowe wygenerowane przez AI
  - Informacje o udostępnieniu (kto udostępnił, kiedy)
  - Status analizy AI z opcją ponowienia
  - Data utworzenia i ostatniej aktualizacji
- **Kluczowe komponenty widoku**:
  - `NoteDetailView` - główny komponent widoku szczegółów
  - `NoteContentRenderer` - renderowanie treści z obsługą Markdown
  - `NoteImage` - komponent obrazu z optymalizacją Next.js Image
  - `NoteMetadata` - wyświetlanie metadanych (kategoria, tagi, daty)
  - `ShareNoteDialog` - dialog do udostępniania notatki innym użytkownikom
  - `EditNoteForm` - formularz edycji (inline lub osobny tryb)
  - `AIAnalysisStatus` - szczegółowy status analizy AI
  - `SharingInfo` - informacje o udostępnieniu notatki
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Unikalny URL dla każdej notatki umożliwiający bezpośrednie linkowanie
  - Obsługa konfliktów wersji (409) z prostymi komunikatami błędów
  - Weryfikacja uprawnień (tylko właściciel może edytować)
  - Obsługa błędów 403 i 404 z odpowiednimi komunikatami
  - Wsparcie dla screen readerów w renderowaniu treści
  - Bezpieczne renderowanie linków (walidacja URL)

### 2.5 Widok Udostępnionych Notatek
- **Ścieżka**: `/app/(notes)/shared`
- **Główny cel**: Wyświetlenie notatek udostępnionych użytkownikowi przez innych
- **Kluczowe informacje do wyświetlenia**:
  - Lista notatek udostępnionych z infinite scroll
  - Dla każdej notatki: tytuł, podgląd, kategoria, tagi
  - Informacja o osobie udostępniającej (username, data udostępnienia)
  - Oznaczenie, że notatka jest udostępniona (read-only)
- **Kluczowe komponenty widoku**:
  - `SharedNotesList` - lista udostępnionych notatek z infinite scroll
  - `SharedNoteCard` - karta notatki z informacją o udostępniającym
  - `SharerInfo` - komponent wyświetlający informacje o osobie udostępniającej
  - `ReadOnlyBadge` - badge oznaczający tryb tylko do odczytu
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Oddzielny widok od własnych notatek użytkownika
  - Ten sam layout co lista własnych notatek dla spójności
  - Brak możliwości edycji (tylko odczyt)
  - Weryfikacja uprawnień do wyświetlania udostępnionych notatek
  - Jasne oznaczenie różnicy między własnymi a udostępnionymi notatkami

### 2.6 Widok Wyszukiwania
- **Ścieżka**: `/app/(search)/search`
- **Główny cel**: Umożliwienie wielomodalnego wyszukiwania notatek (data, kategoria, słowa kluczowe, semantyczne)
- **Kluczowe informacje do wyświetlenia**:
  - Zunifikowany interfejs wyszukiwania z przełącznikiem typu wyszukiwania
  - Dla wyszukiwania po dacie: selektor zakresu dat
  - Dla wyszukiwania po kategorii: lista kategorii użytkownika
  - Dla wyszukiwania słowami kluczowymi/semantycznego: pole wprowadzania zapytania
  - Wyniki wyszukiwania w formacie listy z infinite scroll
  - Wskaźnik ładowania (spinner z tekstem informacyjnym dla wyszukiwania semantycznego)
- **Kluczowe komponenty widoku**:
  - `SearchInterface` - główny interfejs wyszukiwania
  - `SearchTypeSelector` - przełącznik typu wyszukiwania (tabs lub dropdown)
  - `DateRangePicker` - selektor zakresu dat dla wyszukiwania po dacie
  - `CategorySelector` - selektor kategorii dla wyszukiwania po kategorii
  - `SearchQueryInput` - pole wprowadzania zapytania dla wyszukiwania słowami kluczowymi/semantycznego
  - `SearchResultsList` - lista wyników z infinite scroll
  - `SearchResultCard` - karta pojedynczego wyniku
  - `SearchLoadingIndicator` - wskaźnik ładowania z informacją tekstową
  - `SearchTimeoutHandler` - obsługa timeoutu z automatycznym przejściem na wyszukiwanie słowami kluczowymi
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Wszystkie typy wyszukiwania w jednym interfejsie dla spójności
  - Wyniki zawsze sortowane po dacie (nie po trafności dla wyszukiwania semantycznego)
  - Automatyczne przejście na wyszukiwanie słowami kluczowymi przy timeoutcie semantycznego
  - Obsługa timeoutu 408 z jasnymi komunikatami
  - Wsparcie dla nawigacji klawiaturowej w formularzu wyszukiwania
  - Walidacja parametrów wyszukiwania przed wysłaniem zapytania

### 2.7 Widok Zarządzania Kategoriami
- **Ścieżka**: `/app/(categories)/categories`
- **Główny cel**: Zarządzanie kategoriami użytkownika (przeglądanie, tworzenie, edycja, usuwanie)
- **Kluczowe informacje do wyświetlenia**:
  - Lista wszystkich kategorii użytkownika
  - Dla każdej kategorii: nazwa, liczba notatek
  - Możliwość tworzenia nowych kategorii
  - Możliwość edycji nazwy kategorii
  - Możliwość usuwania kategorii (ciche usunięcie bez potwierdzenia)
- **Kluczowe komponenty widoku**:
  - `CategoriesList` - lista kategorii z liczbą notatek
  - `CategoryCard` - karta pojedynczej kategorii
  - `CreateCategoryDialog` - dialog tworzenia nowej kategorii
  - `EditCategoryDialog` - dialog edycji nazwy kategorii
  - `DeleteCategoryButton` - przycisk usuwania kategorii
  - `CategoryNoteCount` - wyświetlanie liczby notatek w kategorii
- **Uwagi dotyczące UX, dostępności i bezpieczeństwa**:
  - Ciche usuwanie kategorii (notatki automatycznie tracą kategorię)
  - Walidacja unikalności nazwy kategorii (case-insensitive)
  - Weryfikacja własności kategorii przed edycją/usunięciem
  - Toast notifications dla operacji CRUD
  - Wsparcie dla nawigacji klawiaturowej
  - Obsługa błędów 409 (konflikt nazwy)

## 3. Mapa Podróży Użytkownika

### 3.1 Główna Podróż: Nowy Użytkownik

1. **Wejście do aplikacji** → Widok logowania (`/app/(auth)/login`)
   - Użytkownik widzi formularz logowania
   - Możliwość przejścia do rejestracji

2. **Rejestracja** → Widok rejestracji (`/app/(auth)/register`)
   - Wprowadzenie username i password
   - Walidacja w czasie rzeczywistym
   - Po udanej rejestracji: automatyczne przekierowanie do listy notatek

3. **Pierwsze użycie** → Widok listy notatek (`/app/(notes)/notes`)
   - Użytkownik widzi pustą listę z formularzem tworzenia na górze
   - Tytuł "What's on your mind?" zachęca do utworzenia pierwszej notatki

4. **Tworzenie notatki** → Widok listy notatek (formularz na górze)
   - Wprowadzenie treści notatki (max 2000 słów)
   - Licznik słów pokazuje postęp
   - Opcjonalnie: wklejenie obrazu (copy/paste)
   - Opcjonalnie: dodanie tagów przez składnię `#[tag name]`
   - Zapis notatki z wyświetleniem spinnera
   - Toast notification o sukcesie
   - Notatka pojawia się na liście ze statusem "pending" analizy AI

5. **Analiza AI** → Widok listy notatek (polling)
   - Status analizy zmienia się z "pending" na "completed"
   - Subtelne powiadomienie o zakończeniu analizy
   - Notatka zaktualizowana o kategorie, tagi, słowa kluczowe

6. **Przeglądanie notatki** → Widok szczegółów notatki (`/app/(notes)/notes/[id]`)
   - Kliknięcie w notatkę na liście
   - Wyświetlenie pełnej treści z metadanymi
   - Możliwość edycji, udostępnienia, ponowienia analizy AI

### 3.2 Podróż: Wyszukiwanie Notatek

1. **Wejście do wyszukiwania** → Widok wyszukiwania (`/app/(search)/search`)
   - Użytkownik wybiera typ wyszukiwania (data, kategoria, słowa kluczowe, semantyczne)

2. **Wyszukiwanie po dacie**:
   - Wybór zakresu dat przez date picker
   - Wyświetlenie wyników posortowanych po dacie
   - Infinite scroll dla dużej liczby wyników

3. **Wyszukiwanie po kategorii**:
   - Wybór kategorii z listy
   - Wyświetlenie notatek w wybranej kategorii

4. **Wyszukiwanie semantyczne**:
   - Wprowadzenie zapytania w języku naturalnym
   - Wyświetlenie spinnera z informacją o trwającym wyszukiwaniu
   - W przypadku timeoutu: automatyczne przejście na wyszukiwanie słowami kluczowymi
   - Wyniki posortowane po dacie

5. **Przejście do notatki** → Widok szczegółów notatki
   - Kliknięcie w wynik wyszukiwania
   - Wyświetlenie pełnej treści notatki

### 3.3 Podróż: Udostępnianie Notatek

1. **Otwarcie notatki** → Widok szczegółów notatki (`/app/(notes)/notes/[id]`)
   - Użytkownik przegląda notatkę, którą chce udostępnić

2. **Udostępnianie** → Dialog udostępniania
   - Kliknięcie przycisku "Udostępnij"
   - Wprowadzenie username odbiorcy
   - Walidacja istnienia użytkownika
   - Toast notification o sukcesie

3. **Odbiorca widzi notatkę** → Widok udostępnionych notatek (`/app/(notes)/shared`)
   - Odbiorca przechodzi do sekcji "Udostępnione"
   - Widzi notatkę z informacją o osobie udostępniającej
   - Może przeglądać notatkę (tylko odczyt)

### 3.4 Podróż: Zarządzanie Kategoriami

1. **Wejście do kategorii** → Widok zarządzania kategoriami (`/app/(categories)/categories`)
   - Użytkownik widzi listę swoich kategorii z liczbą notatek

2. **Tworzenie kategorii** → Dialog tworzenia
   - Wprowadzenie nazwy kategorii
   - Walidacja unikalności
   - Toast notification o sukcesie

3. **Edycja kategorii** → Dialog edycji
   - Kliknięcie przycisku edycji
   - Zmiana nazwy kategorii
   - Walidacja unikalności nowej nazwy

4. **Usuwanie kategorii** → Ciche usunięcie
   - Kliknięcie przycisku usuwania
   - Kategoria zostaje usunięta bez potwierdzenia
   - Notatki automatycznie tracą kategorię
   - Toast notification o sukcesie

## 4. Layout Nawigacji i Struktura

### 4.1 Struktura Nawigacji Desktop

Nawigacja główna wykorzystuje **sidebar** po lewej stronie z następującymi sekcjami:

- **Notatki** - link do `/app/(notes)/notes` (główny widok)
- **Udostępnione** - link do `/app/(notes)/shared`
- **Kategorie** - link do `/app/(categories)/categories`
- **Wyszukiwanie** - link do `/app/(search)/search`

Sidebar jest kolapsowalny, umożliwiając więcej miejsca na treść. Aktywna sekcja jest wyróżniona wizualnie.

### 4.2 Struktura Nawigacji Mobile

Na urządzeniach mobilnych sidebar jest zastąpiony **menu hamburger** w górnej części ekranu. Po kliknięciu otwiera się overlay z opcjami nawigacji w formie pionowej listy.

### 4.3 Layout Główny

Wszystkie widoki w sekcji aplikacji (`(app)`) wykorzystują wspólny layout zawierający:
- **Header** - z menu hamburger (mobile) lub logo (desktop)
- **Sidebar** (desktop) lub menu overlay (mobile)
- **Main Content Area** - obszar treści z responsywnym paddingiem
- **Toast Container** - kontener dla powiadomień toast

### 4.4 Grupy Tras Next.js

Aplikacja wykorzystuje grupy tras Next.js dla logicznej organizacji:

- `(auth)` - strony autentykacji (login, register) bez sidebaru
- `(notes)` - widoki związane z notatkami (lista, szczegóły, udostępnione)
- `(search)` - widok wyszukiwania
- `(categories)` - widok zarządzania kategoriami

Każda grupa może mieć własny layout, umożliwiając różne struktury dla różnych sekcji.

### 4.5 Ochrona Tras

Wszystkie trasy w sekcji `(app)` wymagają autentykacji. Middleware Next.js sprawdza token JWT i przekierowuje do logowania w przypadku braku lub nieprawidłowego tokenu.

## 5. Kluczowe Komponenty

### 5.1 Komponenty Formularzy

- **`FormInput`** - uniwersalne pole wprowadzania z walidacją (React Hook Form + Zod)
- **`FormTextarea`** - pole tekstowe dla treści notatek z licznikiem słów
- **`FormSelect`** - selektor dla kategorii i innych opcji
- **`FormDatePicker`** - selektor daty dla wyszukiwania po dacie
- **`SubmitButton`** - przycisk submit z obsługą stanu ładowania

### 5.2 Komponenty Wyświetlania Danych

- **`NoteCard`** - karta notatki z podglądem, metadanymi i statusem AI
- **`NoteList`** - lista notatek z infinite scroll
- **`CategoryCard`** - karta kategorii z liczbą notatek
- **`SearchResultCard`** - karta wyniku wyszukiwania
- **`SkeletonLoader`** - skeleton loader dla początkowego ładowania

### 5.3 Komponenty Statusu i Wskaźników

- **`AIAnalysisBadge`** - badge pokazujący status analizy AI (pending, completed, failed)
- **`WordCounter`** - licznik słów z wizualnymi ostrzeżeniami
- **`LoadingSpinner`** - spinner dla operacji w toku
- **`RetryButton`** - przycisk do ponowienia operacji (np. analizy AI)

### 5.4 Komponenty Nawigacji

- **`Sidebar`** - sidebar nawigacji dla desktopu
- **`MobileMenu`** - menu hamburger dla urządzeń mobilnych
- **`NavigationLink`** - link nawigacyjny z obsługą aktywnego stanu

### 5.5 Komponenty Dialogów i Modalów

- **`ShareNoteDialog`** - dialog udostępniania notatki
- **`CreateCategoryDialog`** - dialog tworzenia kategorii
- **`EditCategoryDialog`** - dialog edycji kategorii
- **`ConfirmDialog`** - uniwersalny dialog potwierdzenia (używany tam, gdzie potrzebny)

### 5.6 Komponenty Powiadomień

- **`Toast`** - komponent toast notification (Shadcn/ui)
- **`ToastContainer`** - kontener dla toastów w layoutcie głównym
- **`ErrorToast`** - specjalny toast dla błędów
- **`SuccessToast`** - specjalny toast dla sukcesu

### 5.7 Komponenty Wyszukiwania

- **`SearchTypeSelector`** - przełącznik typu wyszukiwania
- **`SearchInput`** - pole wprowadzania zapytania wyszukiwania
- **`SearchFilters`** - filtry wyszukiwania (data, kategoria)
- **`SearchResults`** - lista wyników wyszukiwania

### 5.8 Komponenty Renderowania Treści

- **`MarkdownRenderer`** - renderowanie treści notatek z obsługą Markdown (React Markdown)
- **`NoteImage`** - komponent obrazu z optymalizacją (Next.js Image)
- **`LinkRenderer`** - renderowanie linków z walidacją bezpieczeństwa

### 5.9 Komponenty Zarządzania Stanem

- **`AuthProvider`** - provider autentykacji z zarządzaniem tokenami
- **`QueryClientProvider`** - provider React Query z konfiguracją cache
- **`ZustandStoreProvider`** - provider dla stanu UI (opcjonalnie, jeśli potrzebny)

### 5.10 Komponenty Obsługi Błędów

- **`ErrorBoundary`** - globalny error boundary dla nieoczekiwanych błędów
- **`NotFoundPage`** - strona 404 dla nieistniejących notatek
- **`ForbiddenPage`** - strona 403 dla nieautoryzowanego dostępu
- **`ErrorMessage`** - komponent wyświetlania błędów w formularzach

Wszystkie komponenty są zbudowane w oparciu o Shadcn/ui i Radix UI, zapewniając dostępność, spójność designu i łatwość utrzymania. Komponenty są zorganizowane w strukturze folderów odpowiadającej funkcjonalności (forms, display, navigation, dialogs, etc.).

