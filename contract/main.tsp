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
