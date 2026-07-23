import 'package:flutter/material.dart';

/// Wrapper nhỏ theo theme cho [Text].
///
/// [color] được chỉ định sẽ được ưu tiên hơn màu có sẵn trong [style].
/// Nếu cả hai đều không có màu, color scheme Material hiện tại sẽ được
/// sử dụng.
///
/// Ví dụ:
/// ```dart
/// CustomText(
///   text: 'Từ mới',
///   style: Theme.of(context).textTheme.titleMedium,
/// );
/// ```
class CustomText extends StatelessWidget {
  /// Tạo văn bản theo theme và giữ nguyên các thuộc tính từ [style].
  const CustomText({
    super.key,
    this.text = '',
    this.color,
    this.textAlign = TextAlign.start,
    this.style,
    this.maxLines,
    this.textOverflow,
    this.height,
    this.textDecoration,
  });

  final String text;
  final Color? color;
  final TextAlign textAlign;
  final TextStyle? style;
  final int? maxLines;
  final TextOverflow? textOverflow;
  final TextDecoration? textDecoration;
  final double? height;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final baseStyle = style ?? theme.textTheme.bodyMedium ?? const TextStyle();

    return Text(
      text,
      style: baseStyle.copyWith(
        color: color ?? baseStyle.color ?? theme.colorScheme.onSurface,
        height: height,
        decoration: textDecoration,
      ),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: textOverflow,
    );
  }
}
