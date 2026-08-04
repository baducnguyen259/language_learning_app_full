import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// Điều khiển animation khung ứng dụng dùng chung bởi các custom scaffold.
///
/// `GlobalBinding` đăng ký controller trong toàn bộ vòng đời ứng dụng. Widget
/// có thể lấy controller và điều khiển như sau:
/// ```dart
/// final controller = Get.find<MaterialAppController>();
/// await controller.openMenu();
/// ```
class MaterialAppController extends GetxController
    with GetSingleTickerProviderStateMixin {
  /// Tạo controller với cùng thời lượng cho chiều mở và đóng.
  MaterialAppController({
    this.animationDuration = const Duration(milliseconds: 300),
  });

  /// Thời lượng animation mở và đóng.
  final Duration animationDuration;

  /// Animation mà khung ứng dụng lắng nghe để cập nhật giao diện.
  late final AnimationController animationController;

  @override
  void onInit() {
    super.onInit();
    animationController = AnimationController(
      vsync: this,
      duration: animationDuration,
      reverseDuration: animationDuration,
    );
  }

  /// Chạy animation tới trạng thái mở.
  Future<void> openMenu() => animationController.forward();

  /// Chạy animation về trạng thái đóng.
  Future<void> closeMenu() => animationController.reverse();

  /// Mở hoặc đóng dựa trên tiến độ animation hiện tại.
  Future<void> toggleMenu() {
    return animationController.value > 0.5 ? closeMenu() : openMenu();
  }

  /// Đặt tiến độ tương tác và giới hạn giá trị trong khoảng `0.0..1.0`.
  void setMenuProgress(double value) {
    animationController.value = value.clamp(0.0, 1.0);
  }

  @override
  void onClose() {
    animationController.dispose();
    super.onClose();
  }
}
