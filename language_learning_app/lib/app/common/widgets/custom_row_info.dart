import 'package:flutter/material.dart';

/// Hiển thị cặp label/value với nội dung leading và văn bản trợ giúp tùy chọn.
///
/// [tooltip] là văn bản trợ giúp/trạng thái cố định bên dưới hàng; đây không phải
/// là Material `Tooltip` xuất hiện khi di chuột.
///
/// Ví dụ:
/// ```dart
/// const CustomRowInfo(
///   label: 'Cấp độ',
///   value: 'B1',
///   dividerBottom: true,
/// );
/// ```
class CustomRowInfo extends StatelessWidget {
  /// Tạo một hàng thông tin mô tả.
  const CustomRowInfo({
    super.key,
    this.paddingContent = const EdgeInsets.symmetric(vertical: 10),
    required this.label,
    this.value = '',
    this.valueWidget,
    this.leading,
    this.labelTextStyle,
    this.valueTextStyle,
    this.dividerBottom = false,
    this.dividerColor,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.maxLine = 2,
    this.tooltip,
  }) : assert(maxLine == null || maxLine > 0);

  final EdgeInsetsGeometry paddingContent;
  final String label;
  final String value;
  final Widget? valueWidget;
  final Widget? leading;
  final TextStyle? labelTextStyle;
  final TextStyle? valueTextStyle;
  final bool dividerBottom;
  final Color? dividerColor;
  final CrossAxisAlignment crossAxisAlignment;
  final int? maxLine;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final hasTooltip = tooltip?.isNotEmpty ?? false;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: paddingContent,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: crossAxisAlignment,
            children: [
              ?leading,
              if (leading != null) const SizedBox(width: 8),
              Flexible(
                child: Text(
                  label,
                  style:
                      labelTextStyle ??
                      theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                  textAlign: TextAlign.start,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child:
                    valueWidget ??
                    Text(
                      value,
                      style:
                          valueTextStyle ??
                          theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface,
                            fontWeight: FontWeight.w500,
                          ),
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.end,
                      maxLines: maxLine,
                    ),
              ),
            ],
          ),
        ),
        if (hasTooltip)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.check_circle, color: colorScheme.primary, size: 18),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    tooltip!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        if (dividerBottom)
          Divider(
            height: 1,
            thickness: 1,
            color: dividerColor ?? colorScheme.outlineVariant,
          ),
      ],
    );
  }
}
