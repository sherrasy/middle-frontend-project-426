import "@typespec/http";

using Http;
@service(#{ title: "Computer shop app" })
namespace ComputerShopApi;

@doc("Денежная сумма в целых рублях без копеек")
@minValue(0)
scalar Money extends int32;

@error
model Error {
  code: int32;
  message: string;
}

// @route("/widgets")
// @tag("Widgets")
// interface Widgets {
//   /** List widgets */
//   @get list(): WidgetList | Error;
//   /** Read widgets */
//   @get read(@path id: string): Widget | Error;
//   /** Create a widget */
//   @post create(@body body: Widget): Widget | Error;
//   /** Update a widget */
//   @patch update(@path id: string, @body body: MergePatchUpdate<Widget>):
//     | Widget
//     | Error;
//   /** Delete a widget */
//   @delete delete(@path id: string): void | Error;

//   /** Analyze a widget */
//   @route("{id}/analyze") @post analyze(@path id: string): AnalyzeResult | Error;
// }
