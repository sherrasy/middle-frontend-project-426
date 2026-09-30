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
  @doc("ИД")
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
  @doc("ИД")
  @example(1)
  id: int32;

  @doc("Название категории")
  @example("Процессоры")
  name: string;
}

@doc("Товар")
model Product {
  @doc("ИД")
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

  @doc("ИД категории")
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

@doc("Промо-блок")
model PromoBlock {
  @doc("ИД промо-блока")
  @example(1)
  id: int32;

  @doc("Заголовок промо-блока")
  @example("Мощный процессор для игр")
  title: string;

  @doc("Текст промо-блока")
  @example("AMD Ryzen 5 7600X — идеальный выбор для гейминга.")
  description: string;

  @doc("Рекламируемый товар")
  product: Product;
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

@doc("Способ получения заказа")
enum DeliveryMethod {
  @doc("Курьерская доставка")
  Delivery: "delivery",

  @doc("Самовывоз из пункта выдачи")
  Pickup: "pickup",
}

@doc("Статус заказа")
enum OrderStatus {
  @doc("Заказ успешно оформлен и оплачен")
  Paid: "paid",
}

@doc("Позиция заказа (снимок товара)")
model OrderItem {
  @doc("ИД товара")
  @example(1)
  productId: int32;

  @doc("Название товара на момент покупки")
  @example("AMD Ryzen 5 7600X")
  productName: string;

  @doc("Количество единиц товара")
  @minValue(1)
  @example(2)
  quantity: int32;

  @doc("Цена за единицу товара")
  @example(21990)
  price: Money;

  @doc("Сумма по данной позиции")
  @example(43980)
  total: Money;
}

@doc("Заказ")
model Order {
  @doc("ИД заказа")
  @example(1001)
  id: int32;

  @doc("Дата и время создания заказа")
  @format("date-time")
  @example("2026-10-01T12:00:00Z")
  createdAt: string;

  @doc("Статус заказа")
  status: OrderStatus;

  @doc("Способ получения")
  deliveryMethod: DeliveryMethod;

  @doc("Имя получателя")
  @example("Иван Петров")
  recipientName: string;

  @doc("Телефон получателя")
  @example("+7 (999) 000-11-22")
  recipientPhone: string;

  @doc("Адрес доставки")
  @example("ул. Ленина, д. 15, кв. 42")
  deliveryAddress?: string | null;

  @doc("Позиции заказа")
  items: OrderItem[];

  @doc("Итоговая сумма заказа")
  @example(43980)
  totalAmount: Money;
}

@doc("Элементы корзины для создания заказа")
model CartItemRequest {
  @doc("ИД товара")
  @example(1)
  productId: int32;

  @doc("Количество товара")
  @minValue(1)
  @example(2)
  quantity: int32;
}

@doc("Тело запроса на создание заказа")
model CreateOrderRequest {
  @doc("Способ получения")
  deliveryMethod: DeliveryMethod;

  @doc("Имя получателя")
  @minLength(1)
  @example("Иван Иванов")
  recipientName: string;

  @doc("Телефон получателя")
  @minLength(5)
  @example("+79991234567")
  recipientPhone: string;

  @doc("Адрес доставки ")
  @example("г. Москва, ул. Примерная, д. 1")
  deliveryAddress?: string;

  @doc("Состав корзины")
  @minItems(1)
  items: CartItemRequest[];
}

@doc("Проблемный товар, из-за которого невозможно создать заказ")
model ProblematicProduct {
  @doc("ИД товара")
  @example(1)
  productId: int32;

  @doc("Причина проблемы")
  @example("Товар недоступен для покупки")
  reason: string;
}

@error
@doc("Ошибка создания заказа")
model OrderCreationError extends Error {
  @doc("Список проблемных товаров")
  problematicProducts: ProblematicProduct[];
}

@doc("Список заказов пользователя")
model OrderList {
  @doc("Заказы пользователя")
  items: Order[];

  @doc("Общее количество заказов")
  @example(5)
  total: int32;
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

  @get
  @route("/products/{id}")
  @doc("Получить один товар")
  getProduct(@path id: int32): Product | ValidationError | Error;
}
@route("/promo")
@tag("Promo")
interface PromoApi {
  @get
  @doc("Получить список промо-блоков для главной страницы")
  getPromoBlocks(): PromoBlock[] | Error;
}

@route("/orders")
@tag("Orders")
interface OrdersApi {
  @post
  @doc("Создать новый заказ.")
  createOrder(@body body: CreateOrderRequest):
    | {
        @statusCode code: 201;
        @body order: Order;
      }
    | ValidationError
    | OrderCreationError
    | Error;

  @get
  @doc("Получить список всех заказов пользователя")
  getMyOrders():
    | {
        @statusCode code: 200;
        @body orders: OrderList;
      }
    | Error;

  @get
  @route("/{id}")
  @doc("Получить детализацию заказа")
  getOrder(
    @path
    @doc("ИД заказа")
    @example(1)
    id: int32,
  ):
    | {
        @statusCode code: 200;
        @body order: Order;
      }
    | Error;
}
