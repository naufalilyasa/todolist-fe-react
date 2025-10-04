# Todo List App

Aplikasi Todo List fullstack dengan **React (frontend)** dan **Golang + PostgreSQL (backend)** menggunakan Docker.

---

## 1. Frontend

Frontend dibangun dengan React + Vite.

1. **Clone repository frontend:**

```bash
git clone https://github.com/naufalilyasa/todolist-fe-react
```
```bash
cd todolist-fe-react
```

2. **Install dependencies dan jalankan**
```bash
npm install
```
```bash
npm run dev
```
Frontend akan berjalan di default http://localhost:5173

## 2. Backend
1. **Clone repository backend:**
```bash
git clone https://github.com/naufalilyasa/todolist-be-golang
```
```bash
cd todolist-be-golang
```
2. **Jalankan Docker Compose:**
```bash
docker-compose up --build
```
Jika berhasil, akan muncul:

Database connected & migrated successfully.

Server running at: 8080


##
## Database Design Questions

### 1. What database tables did you create and why?

**Jawaban:**

- **Table `todos`**  
  Menyimpan semua todo yang dibuat oleh user. Kolom utama: `id`, `title`, `description`, `is_completed`, `category_id`, `created_at`, `updated_at`.  
- **Table `categories`**  
  Menyimpan kategori todo, misal `Personal`, `Work`, `Shopping`. Kolom utama: `id`, `name`, `color`, `created_at`.  
- **Relationships**  
  - `todos.category_id` → `categories.id` (Many todos ke One category).  
  - Struktur ini memisahkan data kategori dan todo agar lebih fleksibel, mempermudah filter berdasarkan kategori, dan mengurangi duplikasi data.

### 2. How did you handle pagination and filtering in the database?

**Jawaban:**

- **Filtering & Sorting:**  
  Query dibuat dengan parameter opsional `category`, `is_completed`, dan `search` (title/description).  
  Contoh query SQL:

  ```sql
  SELECT * FROM todos
  WHERE category_id = $1 AND is_completed = $2
  ORDER BY created_at DESC
  LIMIT $3 OFFSET $4;
  ```
# Todo List App - Technical Questions

## Database & Pagination

- **Pagination:**  
  Menggunakan limit-offset karena dataset relatif kecil dan mudah diimplementasikan.

- **Index:**  
  - Index pada `category_id` dan `created_at` untuk mempercepat query filter dan sort.

## Technical Decisions

### 1. Responsive Design

- Menggunakan **Ant Design Grid** (`Row` dan `Col`) dengan breakpoints standar: `xs`, `sm`, `md`, `lg`, `xl`.  
- UI menyesuaikan layout secara otomatis:  
  - Mobile: kolom tunggal  
  - Tablet: 2 kolom  
  - Desktop: 3+ kolom  
- Komponen Ant Design seperti `Table`, `Card`, dan `Form` sudah mendukung responsivitas built-in.

### 2. React Component Structure

- **Component hierarchy:**  
  `App` → `Layout` → `TodoListPage` → `TodoTable`, `TodoForm`, `FilterBar`  
- **State management:**  
  - `useState` + `useEffect` untuk local state  
  - TanStack Query (`react-query`) untuk data fetching dan cache global  
- **Filtering & pagination state:**  
  Disimpan di `TodoListPage` dan diteruskan ke `TodoTable` sebagai props.  
  Saat filter/pagination berubah, TanStack Query otomatis fetch data baru dari backend.

### 3. Backend Architecture

- **API architecture:** RESTful API dengan Go Fiber.  
- **Code structure:**  
  - `handlers/` → handle request & response  
  - `services/` → business logic  
  - `repositories/` → database query  
  - `middlewares/` → cors
  - `models/` -> struktur table
- **Error handling:**  
  Centralized error handler untuk menangkap panic atau error dari database, dikembalikan sebagai JSON dengan kode status HTTP.

### 4. Data Validation

- Validasi dilakukan **frontend + backend**.  
- **Frontend:** Rules ant design form untuk validasi input user sebelum submit.  
- **Backend:** Validator untuk memastikan data valid sebelum masuk database.  
- Pendekatan ini mengurangi kemungkinan data invalid masuk ke database dan memberikan feedback cepat ke user.

---

## Testing & Quality

### 1. Unit Testing

- Fungsi core di backend yang tidak bergantung ke database diuji (contoh: helper, validator).  
- **Edge cases:**  
  - Insert todo dengan data kosong  
  - Update todo yang tidak ada  
  - Delete todo yang sudah dihapus  
- Struktur test: menggunakan `testify` + table-driven tests untuk backend Golang.

### 2. Future Improvements

- **Technical debt:**  
  - Tambahkan logging lebih lengkap di backend  
  - Perbaiki error handling untuk edge case database  
- **Features:**  
  - Otentikasi user  
  - Label/tag fleksibel untuk todo  
  - Filter by date, priority, atau multiple categories  
- **Refactor:**  
  - Pisahkan service & repository layer lebih jelas  
  - Tambahkan caching untuk data yang sering diakses


