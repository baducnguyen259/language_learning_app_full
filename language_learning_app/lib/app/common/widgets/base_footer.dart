import 'package:flutter/material.dart';

/// Widget Footer dùng chung cho toàn bộ ứng dụng.
///
/// Footer luôn hiển thị phía trên vùng an toàn (Safe Area) của thiết bị,
/// kể cả khi [padding] được truyền từ bên ngoài.
///
/// Ví dụ:
/// ```dart
/// BaseFooter(
///   child: FilledButton(
///     onPressed: save,
///     child: const Text('Lưu'),
///   ),
/// );
/// ```
class BaseFooter extends StatelessWidget {
  /// Khởi tạo Footer với nội dung, khoảng đệm và kiểu hiển thị tùy chọn.
  const BaseFooter({
    super.key,
    this.child,
    this.showShadow = true,
    this.padding,
    this.backgroundColor,
    this.border,
  });

  static const double _horizontalPadding = 16;

  /// Nội dung hiển thị bên trong Footer.
  final Widget? child;

  /// Có hiển thị bóng đổ phía trên Footer hay không.
  final bool showShadow;

  /// Khoảng đệm bên trong Footer.
  ///
  /// Phần Safe Area ở phía dưới luôn được cộng thêm tự động.
  final EdgeInsetsGeometry? padding;

  /// Màu nền của Footer.
  ///
  /// Nếu không truyền vào sẽ sử dụng `colorScheme.surface`.
  final Color? backgroundColor;

  /// Viền của Footer.
  final BoxBorder? border;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final bottomSafeArea = MediaQuery.viewPaddingOf(context).bottom;
    final resolvedPadding =
        (padding ??
                const EdgeInsets.fromLTRB(
                  _horizontalPadding,
                  _horizontalPadding,
                  _horizontalPadding,
                  24,
                ))
            .resolve(Directionality.of(context));

    return Container(
      padding: resolvedPadding.copyWith(
        bottom: resolvedPadding.bottom + bottomSafeArea,
      ),
      decoration: BoxDecoration(
        color: backgroundColor ?? colorScheme.surface,
        border: border,
        boxShadow: showShadow
            ? [
                BoxShadow(
                  blurRadius: 40,
                  color: colorScheme.shadow.withValues(alpha: 0.06),
                ),
              ]
            : null,
      ),
      child: child,
    );
  }
}
