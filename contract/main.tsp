import "@typespec/http";

using Http;
@service(#{ title: "Computer shop app" })
namespace ComputerShopApi;

@doc("Денежная сумма в целых рублях без копеек")
@minValue(0)
@example(1500)
scalar Money extends int32;

@error
model Error {
  @doc("Код ошибки")
  @example(404)
  code: int32;

  @doc("Текст ошибки для пользователя")
  @example("Данные не найдены")
  message: string;
}
model MoneyResponse {
  @doc("Сумма в рублях")
  @example(1500)
  amount: Money;
}

@route("/test-money")
@tag("Test")
interface TestApi {
  @get getTestMoney(): MoneyResponse | Error;
}
