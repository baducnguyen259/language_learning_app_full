// ignore_for_file: constant_identifier_names

/// Chọn độ sáng của biểu tượng thanh trạng thái được khung trang sử dụng.
///
/// `DARK` là biểu tượng tối trên nền sáng; `LIGHT` là biểu tượng sáng
/// trên nền tối.
///
/// Ví dụ:
/// ```dart
/// BaseScaffold(statusBarBrightness: StatusBarBrightness.DARK);
/// ```
enum StatusBarBrightness {
  /// Biểu tượng thanh trạng thái tối, phù hợp với nền sáng.
  DARK,

  /// Biểu tượng thanh trạng thái sáng, phù hợp với nền tối.
  LIGHT,
}
