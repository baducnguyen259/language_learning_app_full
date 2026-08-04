import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

/// Hiển thị biểu trưng ứng dụng và nhãn sản phẩm dạng viên thuốc.
///
/// Ví dụ:
/// ```dart
/// const CustomLogoApp(
///   logo: Icon(Icons.translate_rounded),
///   label: 'Language Learning',
/// );
/// ```
class CustomLogoApp extends StatelessWidget {
  /// Tạo logo ứng dụng.
  ///
  /// Tham số [borderWith] đã lỗi thời vẫn được giữ để tương thích;
  /// các nơi gọi mới nên dùng [borderWidth].
  const CustomLogoApp({
    super.key,
    this.color,
    this.backgroundColor,
    this.borderColor,
    double borderWidth = 1,
    @Deprecated('Use borderWidth instead.') double? borderWith,
    this.logoPath = '',
    this.logo,
    this.logoSize = 64,
    this.label = 'Language Learning',
    this.textStyle,
  }) : borderWidth = borderWith ?? borderWidth,
       assert(
         (borderWith ?? borderWidth) >= 0,
         'borderWidth phải lớn hơn hoặc bằng 0.',
       ),
       assert(logoSize > 0, 'logoSize phải lớn hơn 0.');

  final Color? color;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderWidth;

  /// Bí danh tương thích ngược của [borderWidth].
  @Deprecated('Use borderWidth instead.')
  double get borderWith => borderWidth;
  final String logoPath;
  final Widget? logo;
  final double logoSize;
  final String label;
  final TextStyle? textStyle;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final contentColor = color ?? colorScheme.onSurface;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        logo ??
            (logoPath.isNotEmpty
                ? CustomImage.asset(
                    logoPath,
                    width: logoSize,
                    height: logoSize,
                    color: color,
                  )
                : Icon(
                    Icons.translate_rounded,
                    size: logoSize,
                    color: colorScheme.primary,
                  )),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
          decoration: BoxDecoration(
            color: backgroundColor ?? colorScheme.surfaceContainer,
            border: Border.all(
              width: borderWidth,
              color: borderColor ?? colorScheme.outlineVariant,
            ),
            borderRadius: BorderRadius.circular(999),
          ),
          child: CustomText(
            text: label,
            style:
                textStyle ??
                theme.textTheme.labelSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
            color: contentColor,
          ),
        ),
      ],
    );
  }
}
