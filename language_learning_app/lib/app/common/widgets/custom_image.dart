import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Khung cơ sở áp dụng padding, margin, nền và cắt ảnh.
///
/// Mở rộng class này khi tính năng cần image provider khác nhưng vẫn giữ
/// cùng một container hiển thị.
///
/// Ví dụ:
/// ```dart
/// class RoundedImage extends BaseImage {
///   const RoundedImage(Widget child) : super(child, radius: 12);
/// }
/// ```
abstract class BaseImage extends StatelessWidget {
  /// Tạo khung ảnh được cắt quanh [child].
  const BaseImage(
    this.child, {
    super.key,
    this.backgroundColor,
    this.padding = EdgeInsets.zero,
    this.margin = EdgeInsets.zero,
    this.shape = BoxShape.rectangle,
    this.radius = 0,
  }) : assert(radius >= 0, 'radius phải lớn hơn hoặc bằng 0.');

  final Widget child;
  final Color? backgroundColor;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final BoxShape shape;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final borderRadius = shape == BoxShape.circle
        ? null
        : BorderRadius.circular(radius);
    final clippedChild = shape == BoxShape.circle
        ? ClipOval(child: child)
        : ClipRRect(borderRadius: borderRadius!, child: child);

    return Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor,
        shape: shape,
        borderRadius: borderRadius,
      ),
      child: clippedChild,
    );
  }
}

/// Tải ảnh raster/SVG cục bộ hoặc từ xa, kèm giao diện dự phòng khi tải và khi lỗi.
///
/// Ví dụ:
/// ```dart
/// CustomImage.asset(
///   'assets/icons/book.svg',
///   semanticLabel: 'Sách',
/// );
/// ```
class CustomImage extends BaseImage {
  /// Tạo ảnh từ asset Flutter.
  ///
  /// Ví dụ:
  /// ```dart
  /// CustomImage.asset('assets/images/logo.png', width: 64, height: 64);
  /// ```
  CustomImage.asset(
    String asset, {
    super.key,
    double? width,
    double? height,
    Color? color,
    Color? backgroundColor,
    EdgeInsetsGeometry padding = EdgeInsets.zero,
    EdgeInsetsGeometry margin = EdgeInsets.zero,
    BoxShape shape = BoxShape.rectangle,
    BoxFit fit = BoxFit.contain,
    double radius = 0,
    Alignment alignment = Alignment.center,
    Widget? errorWidget,
    String? semanticLabel,
  }) : super(
         _buildAssetImage(
           asset,
           width: width,
           height: height,
           color: color,
           fit: fit,
           alignment: alignment,
           errorWidget: errorWidget,
           semanticLabel: semanticLabel,
         ),
         backgroundColor: backgroundColor,
         padding: padding,
         margin: margin,
         shape: shape,
         radius: radius,
       );

  /// Tạo ảnh được cache từ [url].
  ///
  /// Ví dụ:
  /// ```dart
  /// CustomImage.network(
  ///   avatarUrl,
  ///   semanticLabel: 'Ảnh đại diện',
  ///   radius: 12,
  /// );
  /// ```
  CustomImage.network(
    String url, {
    super.key,
    double? width,
    double? height,
    Color? color,
    Color? backgroundColor,
    EdgeInsetsGeometry padding = EdgeInsets.zero,
    EdgeInsetsGeometry margin = EdgeInsets.zero,
    BoxShape shape = BoxShape.rectangle,
    BoxFit fit = BoxFit.contain,
    double radius = 0,
    Alignment alignment = Alignment.center,
    Widget? errorWidget,
    Widget? placeholder,
    String? semanticLabel,
  }) : super(
         _buildNetworkImage(
           url,
           width: width,
           height: height,
           color: color,
           fit: fit,
           alignment: alignment,
           errorWidget: errorWidget,
           placeholder: placeholder,
           semanticLabel: semanticLabel,
         ),
         backgroundColor: backgroundColor,
         padding: padding,
         margin: margin,
         shape: shape,
         radius: radius,
       );
}

Widget _buildAssetImage(
  String asset, {
  double? width,
  double? height,
  Color? color,
  required BoxFit fit,
  required Alignment alignment,
  Widget? errorWidget,
  String? semanticLabel,
}) {
  final fallback =
      errorWidget ?? _ImageFallback(width: width, height: height, color: color);

  if (asset.isEmpty) return fallback;

  if (_isSvg(asset)) {
    return SvgPicture.asset(
      asset,
      width: width,
      height: height,
      fit: fit,
      alignment: alignment,
      colorFilter: _colorFilter(color),
      semanticsLabel: semanticLabel,
      placeholderBuilder: (context) =>
          _ImagePlaceholder(width: width, height: height),
      errorBuilder: (context, error, stackTrace) => fallback,
    );
  }

  return Image.asset(
    asset,
    width: width,
    height: height,
    fit: fit,
    alignment: alignment,
    color: color,
    colorBlendMode: color == null ? null : BlendMode.srcIn,
    semanticLabel: semanticLabel,
    errorBuilder: (context, error, stackTrace) => fallback,
  );
}

Widget _buildNetworkImage(
  String url, {
  double? width,
  double? height,
  Color? color,
  required BoxFit fit,
  required Alignment alignment,
  Widget? errorWidget,
  Widget? placeholder,
  String? semanticLabel,
}) {
  final fallback =
      errorWidget ?? _ImageFallback(width: width, height: height, color: color);
  final loading =
      placeholder ?? _ImagePlaceholder(width: width, height: height);

  if (url.isEmpty) return fallback;

  if (_isSvg(url)) {
    return SvgPicture.network(
      url,
      width: width,
      height: height,
      fit: fit,
      alignment: alignment,
      colorFilter: _colorFilter(color),
      semanticsLabel: semanticLabel,
      placeholderBuilder: (context) => loading,
      errorBuilder: (context, error, stackTrace) => fallback,
    );
  }

  final image = CachedNetworkImage(
    imageUrl: url,
    width: width,
    height: height,
    fit: fit,
    alignment: alignment,
    color: color,
    colorBlendMode: color == null ? null : BlendMode.srcIn,
    placeholder: (context, imageUrl) => loading,
    errorWidget: (context, imageUrl, error) => fallback,
  );

  return _withImageSemantics(image, semanticLabel);
}

bool _isSvg(String source) {
  final path = Uri.tryParse(source)?.path ?? source;
  return path.toLowerCase().endsWith('.svg');
}

ColorFilter? _colorFilter(Color? color) {
  return color == null ? null : ColorFilter.mode(color, BlendMode.srcIn);
}

Widget _withImageSemantics(Widget child, String? semanticLabel) {
  if (semanticLabel?.trim().isEmpty ?? true) return child;

  return Semantics(
    image: true,
    label: semanticLabel,
    child: ExcludeSemantics(child: child),
  );
}

class _ImagePlaceholder extends StatelessWidget {
  const _ImagePlaceholder({this.width, this.height});

  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Center(
        child: SizedBox.square(
          dimension: 20,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
      ),
    );
  }
}

class _ImageFallback extends StatelessWidget {
  const _ImageFallback({this.width, this.height, this.color});

  final double? width;
  final double? height;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Center(
        child: Icon(
          Icons.broken_image_outlined,
          color: color ?? Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }
}
