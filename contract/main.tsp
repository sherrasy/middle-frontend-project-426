import "@typespec/http";
import "@typespec/rest";

using Http;
using Rest;

@service(#{ title: "Computer shop app" })
namespace ComputerShopApi;

@doc("Денежная сумма в целых рублях без копеек")
@minValue(0)
@example(1500)
scalar Money extends int32;

@error
model Error {
  @doc("HTTP-код ошибки")
  @example(404)
  code: int32;

  @doc("Текст ошибки для пользователя")
  @example("Данные не найдены")
  message: string;
}

@error
model ValidationError extends Error {
  @doc("Список проблемных полей")
  details?: ValidationDetail[];
}

model ValidationDetail {
  @doc("Имя поля")
  field: string;

  @doc("Описание проблемы")
  message: string;
}

@doc("Пользователь (покупатель)")
model User {
  @doc("Идентификатор")
  @example(42)
  id: int32;

  @doc("Email")
  @example("user@example.com")
  email: string;

  @doc("Отображаемое имя")
  @example("Иван")
  name?: string;
}

@doc("Ответ после успешной регистрации или входа")
model AuthResponse {
  @doc("Токен авторизации")
  @example("eyJhbGciOiJIUzI1NiIs...")
  token: string;

  @doc("Данные пользователя")
  user: User;
}

@doc("Тело запроса регистрации")
model RegisterRequest {
  @doc("Email пользователя")
  @format("email")
  @example("demo+1785426603748@example.com")
  email: string;

  @doc("Пароль (минимум 8 символов)")
  @minLength(8)
  @example("securepassword")
  password: string;
}

@doc("Тело запроса входа")
model LoginRequest {
  @doc("Email пользователя")
  @format("email")
  @example("demo+1785426603748@example.com")
  email: string;

  @doc("Пароль")
  @example("securepassword")
  password: string;
}

@doc("Ответ для успешного выхода")
model LogoutResponse {
  @statusCode code: 204;
}

@doc("Категория товара")
model Category {
  @doc("Идентификатор")
  @example(1)
  id: int32;

  @doc("Название категории")
  @example("Процессоры")
  name: string;
}

@doc("Товар")
model Product {
  @doc("Идентификатор")
  @example(1)
  id: int32;

  @doc("Название")
  @example("AMD Ryzen 5 7600X")
  name: string;

  @doc("Цена в рублях")
  @example(21990)
  price: Money;

  @doc("Краткое описание")
  @example("Процессор 6 ядер, 12 потоков, сокет AM5.")
  description: string;

  @doc("URL изображения или null")
  @example("https://example.com/ryzen5.jpg")
  image: string | null;

  @doc("Доступность товара")
  @example(true)
  isAccessible: boolean;

  @doc("Идентификатор категории")
  @example(1)
  categoryId: int32;
}

@doc("Список товаров с пагинацией")
model ProductList {
  @doc("Товары на текущей странице")
  items: Product[];

  @doc("Общее количество товаров")
  @example(150)
  total: int32;

  @doc("Номер текущей страницы")
  @example(1)
  page: int32;

  @doc("Размер страницы")
  @example(12)
  pageSize: int32;

  @doc("Общее количество страниц")
  @example(13)
  totalPages: int32;
}

@doc("Параметры фильтрации и пагинации")
model CatalogQuery {
  @doc("ID категории для фильтрации")
  @example(1)
  categoryId?: int32;

  @doc("Поиск по названию")
  @example("Ryzen")
  search?: string;

  @doc("Минимальная цена")
  @example(10000)
  priceFrom?: Money;

  @doc("Максимальная цена")
  @example(50000)
  priceTo?: Money;

  @doc("Только доступные товары")
  @example(false)
  onlyAvailable?: boolean;

  @doc("Номер страницы (начиная с 1)")
  @minValue(1)
  @example(1)
  page?: int32;

  @doc("Размер страницы")
  @minValue(1)
  @maxValue(100)
  @example(12)
  pageSize?: int32;
}

// API

@route("/auth")
@tag("Auth")
interface AuthApi {
  @post
  @route("/register")
  @doc("Регистрация нового пользователя")
  register(@body body: RegisterRequest): AuthResponse | ValidationError | Error;

  @post
  @route("/login")
  @doc("Вход по email и паролю")
  login(@body body: LoginRequest): AuthResponse | ValidationError | Error;

  @post
  @route("/logout")
  @doc("Выход из системы")
  logout(): LogoutResponse | Error;

  @get
  @route("/me")
  @doc("Получить текущего авторизованного пользователя")
  getCurrentUser(): User | Error;
}

@route("/catalog")
@tag("Catalog")
interface CatalogApi {
  @get
  @route("/products")
  @doc("Получить список товаров с фильтрацией и пагинацией")
  getProducts(@query query: CatalogQuery):
    | ProductList
    | ValidationError
    | Error;

  @get
  @route("/categories")
  @doc("Получить список категорий")
  getCategories(): Category[] | Error;
}
