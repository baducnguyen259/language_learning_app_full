import 'package:flutter/material.dart';

/// Một hàng gọn gồm leading/title/content và widget trailing tùy chọn.
///
/// Dùng [content] cho văn bản đơn giản hoặc [contentWidget] cho nội dung phong phú hơn.
///
/// Ví dụ:
/// ```dart
/// const CustomListTile(
///   prefix: Icon(Icons.school_outlined),
///   title: 'Cấp độ',
///   content: 'B1',
/// );
/// ```
class CustomListTile extends StatelessWidget {
  /// Tạo một list tile tùy chỉnh.
  ///
  /// Có thể bỏ qua [content] khi đã cung cấp [contentWidget].
  const CustomListTile({
    super.key,
    required this.prefix,
    required this.title,
    this.content = '',
    this.contentWidget,
    this.titleStyle,
    this.contentStyle,
    this.crossAxisAlignment,
    this.suffixMainAxisAlignment,
    this.horizontalSpacing = 12,
    this.verticalSpacing = 0,
    this.suffixSpacing = 8,
    this.suffix,
  }) : assert(horizontalSpacing >= 0),
       assert(verticalSpacing >= 0),
       assert(suffixSpacing >= 0);

  final Widget prefix;
  final Widget? contentWidget;
  final String title;
  final String content;
  final TextStyle? titleStyle;
  final TextStyle? contentStyle;
  final CrossAxisAlignment? crossAxisAlignment;
  final MainAxisAlignment? suffixMainAxisAlignment;
  final double horizontalSpacing;
  final double verticalSpacing;

  /// Khoảng cách giữa title và [suffix].
  final double suffixSpacing;

  final Widget? suffix;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Row(
      crossAxisAlignment: crossAxisAlignment ?? CrossAxisAlignment.center,
      children: [
        prefix,
        SizedBox(width: horizontalSpacing),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment:
                    suffixMainAxisAlignment ?? MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style:
                          titleStyle ??
                          theme.textTheme.titleMedium?.copyWith(
                            color: colorScheme.onSurface,
                          ),
                    ),
                  ),
                  if (suffix != null) SizedBox(width: suffixSpacing),
                  ?suffix,
                ],
              ),
              SizedBox(height: verticalSpacing),
              contentWidget ??
                  Text(
                    content,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style:
                        contentStyle ??
                        theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                  ),
            ],
          ),
        ),
      ],
    );
  }
}
