import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/controllers/material_app_controller.dart';
import 'package:language_learning_app/app/common/widgets/status_bar_brightness.dart';

/// Tạo animation cho khung trang khi menu bên của ứng dụng mở hoặc đóng.
///
/// Dù có tên cũ, widget này không phải là `MaterialApp`. Cần đăng ký
/// [MaterialAppController] với GetX trước khi dựng widget,
/// thường thông qua `GlobalBinding`.
///
/// Ví dụ:
/// ```dart
/// Get.put(MaterialAppController());
/// const CustomMaterialApp(
///   child: Scaffold(body: Center(child: Text('Trang chủ'))),
/// );
/// ```
class CustomMaterialApp extends GetView<MaterialAppController> {
  /// Tạo khung trang có animation.
  const CustomMaterialApp({
    super.key,
    required this.child,
    this.statusBarBrightness = StatusBarBrightness.DARK,
  });

  final Widget child;
  final StatusBarBrightness statusBarBrightness;

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final horizontalOffset = mediaQuery.size.width * 0.015;
    final verticalOffset = mediaQuery.viewPadding.top + 8;

    return AnimatedBuilder(
      animation: controller.animationController,
      child: child,
      builder: (context, child) {
        final progress = controller.animationController.value;
        final effectiveBrightness = progress >= 0.5
            ? StatusBarBrightness.LIGHT
            : statusBarBrightness;
        final overlayStyle = effectiveBrightness == StatusBarBrightness.DARK
            ? SystemUiOverlayStyle.dark
            : SystemUiOverlayStyle.light;

        return AnnotatedRegion<SystemUiOverlayStyle>(
          value: overlayStyle.copyWith(statusBarColor: Colors.transparent),
          child: Transform.translate(
            offset: Offset(
              progress * horizontalOffset,
              progress * verticalOffset,
            ),
            child: Transform.scale(
              scale: 1 - progress * 0.03,
              alignment: Alignment.topLeft,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(progress * 16),
                child: child,
              ),
            ),
          ),
        );
      },
    );
  }
}
