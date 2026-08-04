import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';

/// Asset hoặc biểu tượng Material có thể nhấn, kèm metadata hỗ trợ tiếp cận tùy chọn.
///
/// Cần có ít nhất một nguồn hiển thị: [iconPath] không rỗng hoặc
/// [iconData]. Nên cung cấp [tooltip] cho các hành động chỉ có biểu tượng.
///
/// Ví dụ:
/// ```dart
/// CustomIconButton(
///   onTap: close,
///   iconData: Icons.close,
///   tooltip: 'Đóng',
/// );
/// ```
class CustomIconButton extends StatelessWidget {
  /// Tạo nút biểu tượng dựa trên đường dẫn asset hoặc [IconData].
  const CustomIconButton({
    super.key,
    required this.onTap,
    this.iconPath = '',
    this.iconData,
    this.padding = const EdgeInsets.all(16),
    this.radius = 100,
    this.size = 24,
    this.color,
    this.backgroundColor,
    this.tooltip,
    this.semanticLabel,
  }) : assert(radius >= 0, 'radius phải lớn hơn hoặc bằng 0.'),
       assert(size >= 0, 'size phải lớn hơn hoặc bằng 0.'),
       assert(
         iconPath != '' || iconData != null,
         'Phải truyền iconPath hoặc iconData.',
       );

  final VoidCallback onTap;
  final String iconPath;
  final IconData? iconData;
  final EdgeInsetsGeometry padding;
  final double radius;
  final double size;
  final Color? color;
  final Color? backgroundColor;

  /// Thông báo hiển thị khi di chuột qua hoặc nhấn giữ.
  final String? tooltip;

  /// Nhãn cho trình đọc màn hình; mặc định là [tooltip] nếu bị bỏ qua.
  final String? semanticLabel;

  /// Tạo nút biểu tượng hình tròn với hiệu ứng kính mờ.
  ///
  /// Ví dụ:
  /// ```dart
  /// CustomIconButton.glass(
  ///   onTap: openMenu,
  ///   iconData: Icons.menu,
  ///   tooltip: 'Mở menu',
  /// );
  /// ```
  static Widget glass({
    required VoidCallback onTap,
    String iconPath = '',
    IconData? iconData,
    double radius = 100,
    double size = 48,
    Color? iconColor,
    LinearGradient? gradient,
    String? tooltip,
    String? semanticLabel,
  }) {
    if (iconPath.isEmpty && iconData == null) {
      throw ArgumentError('Phải truyền iconPath hoặc iconData.');
    }
    if (radius < 0) {
      throw ArgumentError.value(radius, 'radius', 'Phải lớn hơn hoặc bằng 0.');
    }
    if (size <= 0) {
      throw ArgumentError.value(size, 'size', 'Phải lớn hơn 0.');
    }

    return _GlassIconButton(
      onTap: onTap,
      iconPath: iconPath,
      iconData: iconData,
      radius: radius,
      size: size,
      iconColor: iconColor,
      gradient: gradient,
      tooltip: tooltip,
      semanticLabel: semanticLabel,
    );
  }

  /// Tạo nút kính mờ chứa văn bản và tùy chọn biểu tượng.
  ///
  /// Ít nhất một trong [text], [iconPath] hoặc [iconData] phải cung cấp nội dung hiển thị.
  ///
  /// Ví dụ:
  /// ```dart
  /// CustomIconButton.glassText(
  ///   onTap: continueLesson,
  ///   text: 'Tiếp tục',
  ///   iconData: Icons.arrow_forward,
  ///   width: 160,
  ///   height: 48,
  /// );
  /// ```
  static Widget glassText({
    required VoidCallback onTap,
    String text = '',
    String iconPath = '',
    TextStyle? style,
    IconData? iconData,
    double radius = 100,
    required double width,
    required double height,
    Color? iconColor,
    LinearGradient? gradient,
    String? tooltip,
    String? semanticLabel,
  }) {
    if (text.isEmpty && iconPath.isEmpty && iconData == null) {
      throw ArgumentError('Phải truyền text, iconPath hoặc iconData.');
    }
    if (radius < 0) {
      throw ArgumentError.value(radius, 'radius', 'Phải lớn hơn hoặc bằng 0.');
    }
    if (width <= 0) {
      throw ArgumentError.value(width, 'width', 'Phải lớn hơn 0.');
    }
    if (height <= 0) {
      throw ArgumentError.value(height, 'height', 'Phải lớn hơn 0.');
    }

    return _GlassTextButton(
      onTap: onTap,
      text: text,
      iconPath: iconPath,
      style: style,
      iconData: iconData,
      radius: radius,
      width: width,
      height: height,
      iconColor: iconColor,
      gradient: gradient,
      tooltip: tooltip,
      semanticLabel: semanticLabel,
    );
  }

  @override
  Widget build(BuildContext context) {
    final button = Material(
      color: backgroundColor ?? Colors.transparent,
      borderRadius: BorderRadius.circular(radius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        child: Padding(
          padding: padding,
          child: _CustomIcon(
            iconPath: iconPath,
            iconData: iconData,
            size: size,
            color: color,
          ),
        ),
      ),
    );

    return _withButtonAccessibility(
      tooltip: tooltip,
      semanticLabel: semanticLabel,
      child: button,
    );
  }
}

class _GlassIconButton extends StatelessWidget {
  const _GlassIconButton({
    required this.onTap,
    required this.iconPath,
    required this.iconData,
    required this.radius,
    required this.size,
    required this.iconColor,
    required this.gradient,
    required this.tooltip,
    required this.semanticLabel,
  }) : assert(radius >= 0),
       assert(size > 0);

  final VoidCallback onTap;
  final String iconPath;
  final IconData? iconData;
  final double radius;
  final double size;
  final Color? iconColor;
  final LinearGradient? gradient;
  final String? tooltip;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final button = _GlassSurface(
      onTap: onTap,
      radius: radius,
      width: size,
      height: size,
      padding: const EdgeInsets.all(10),
      gradient: gradient,
      child: _CustomIcon(
        iconPath: iconPath,
        iconData: iconData,
        size: (size - 20).clamp(0, size),
        color: iconColor ?? Theme.of(context).colorScheme.onSurface,
      ),
    );

    return _withButtonAccessibility(
      tooltip: tooltip,
      semanticLabel: semanticLabel,
      child: button,
    );
  }
}

class _GlassTextButton extends StatelessWidget {
  const _GlassTextButton({
    required this.onTap,
    required this.text,
    required this.iconPath,
    required this.style,
    required this.iconData,
    required this.radius,
    required this.width,
    required this.height,
    required this.iconColor,
    required this.gradient,
    required this.tooltip,
    required this.semanticLabel,
  }) : assert(radius >= 0),
       assert(width > 0),
       assert(height > 0);

  final VoidCallback onTap;
  final String text;
  final String iconPath;
  final TextStyle? style;
  final IconData? iconData;
  final double radius;
  final double width;
  final double height;
  final Color? iconColor;
  final LinearGradient? gradient;
  final String? tooltip;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveIconColor = iconColor ?? theme.colorScheme.onSurface;
    final hasIcon = iconPath.isNotEmpty || iconData != null;

    final button = _GlassSurface(
      onTap: onTap,
      radius: radius,
      width: width,
      height: height,
      padding: const EdgeInsets.all(12),
      gradient: gradient,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (hasIcon)
            _CustomIcon(
              iconPath: iconPath,
              iconData: iconData,
              size: 24,
              color: effectiveIconColor,
            ),
          if (hasIcon && text.isNotEmpty) const SizedBox(width: 4),
          if (text.isNotEmpty)
            Flexible(
              child: Text(
                text,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style:
                    style ??
                    theme.textTheme.labelLarge?.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
              ),
            ),
        ],
      ),
    );

    return _withButtonAccessibility(
      tooltip: tooltip,
      semanticLabel: semanticLabel,
      child: button,
    );
  }
}

class _GlassSurface extends StatelessWidget {
  const _GlassSurface({
    required this.onTap,
    required this.radius,
    required this.width,
    required this.height,
    required this.padding,
    required this.gradient,
    required this.child,
  });

  final VoidCallback onTap;
  final double radius;
  final double width;
  final double height;
  final EdgeInsetsGeometry padding;
  final LinearGradient? gradient;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final borderRadius = BorderRadius.circular(radius);
    final innerRadius = BorderRadius.circular((radius - 1).clamp(0, radius));
    final fillGradient =
        gradient ??
        LinearGradient(
          colors: [
            colorScheme.surface.withValues(alpha: 0.2),
            colorScheme.surface.withValues(alpha: 0.08),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
    final borderGradient = LinearGradient(
      colors: [
        colorScheme.shadow.withValues(alpha: 0.08),
        colorScheme.onSurface.withValues(alpha: 0.25),
        colorScheme.shadow.withValues(alpha: 0.08),
      ],
      begin: Alignment.topRight,
      end: Alignment.bottomLeft,
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: borderRadius,
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.12),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: borderRadius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 2, sigmaY: 2),
          child: DecoratedBox(
            decoration: BoxDecoration(gradient: borderGradient),
            child: Padding(
              padding: const EdgeInsets.all(1),
              child: ClipRRect(
                borderRadius: innerRadius,
                child: DecoratedBox(
                  decoration: BoxDecoration(gradient: fillGradient),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: onTap,
                      child: SizedBox(
                        width: (width - 2).clamp(0, double.infinity),
                        height: (height - 2).clamp(0, double.infinity),
                        child: Padding(
                          padding: padding,
                          child: Center(child: child),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CustomIcon extends StatelessWidget {
  const _CustomIcon({
    required this.iconPath,
    required this.iconData,
    required this.size,
    required this.color,
  });

  final String iconPath;
  final IconData? iconData;
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    if (iconPath.isNotEmpty) {
      return CustomImage.asset(
        iconPath,
        width: size,
        height: size,
        color: color,
      );
    }

    if (iconData == null) {
      throw ArgumentError('Phải truyền iconPath hoặc iconData.');
    }

    return Icon(
      iconData,
      size: size,
      color: color ?? Theme.of(context).colorScheme.onSurface,
    );
  }
}

Widget _withButtonAccessibility({
  required Widget child,
  String? tooltip,
  String? semanticLabel,
}) {
  final effectiveLabel = semanticLabel?.trim().isNotEmpty ?? false
      ? semanticLabel
      : tooltip;
  Widget result = child;

  if (effectiveLabel?.trim().isNotEmpty ?? false) {
    result = Semantics(label: effectiveLabel, button: true, child: result);
  }

  if (tooltip?.trim().isNotEmpty ?? false) {
    result = Tooltip(
      message: tooltip!,
      excludeFromSemantics: true,
      child: result,
    );
  }

  return result;
}
