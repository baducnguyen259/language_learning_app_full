import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/custom_bottom_sheet.dart';

/// Hiển thị các Bottom Sheet của ứng dụng thông qua overlay gốc của GetX.
///
/// Ứng dụng phải được khởi tạo bằng [GetMaterialApp].
/// Nội dung của từng tính năng (feature) được truyền vào thông qua [open].
abstract class BottomSheets {
  BottomSheets._();

  /// Mở Bottom Sheet theo giao diện Material 3 của ứng dụng.
  ///
  /// Nội dung của từng feature được truyền qua [child], giúp tiện ích này
  /// không phụ thuộc vào logic nghiệp vụ.
  ///
  /// Các cách đóng Bottom Sheet hoạt động độc lập:
  /// - [isDismissible]: Cho phép đóng khi chạm vào vùng nền (modal barrier).
  /// - [enableDrag]: Cho phép vuốt để đóng.
  /// - [canPop]: Cho phép đóng bằng nút Back của hệ thống thông qua [PopScope].
  ///
  /// Nút đóng trên phần tiêu đề vẫn được hiển thị, trừ khi
  /// [showCloseButton] được đặt là `false`.
  ///
  /// Future trả về sẽ hoàn thành khi Bottom Sheet được đóng.
  ///
  /// Ví dụ:
  ///
  /// ```dart
  /// await BottomSheets.open<void>(
  ///   title: 'Chọn ngôn ngữ',
  ///   showBar: true,
  ///   child: const LanguagePicker(),
  /// );
  /// ```
  ///
  /// Ví dụ vô hiệu hóa tất cả các cách đóng Bottom Sheet:
  ///
  /// ```dart
  /// await BottomSheets.open<void>(
  ///   child: const SavingProgress(),
  ///   isDismissible: false,
  ///   enableDrag: false,
  ///   canPop: false,
  ///   showCloseButton: false,
  /// );
  /// ```
  static Future<T?> open<T>({
    required Widget child,
    String title = '',
    Widget? footer,
    bool showHeader = true,
    bool showCloseButton = true,
    bool showBar = false,
    bool isExpanded = false,
    bool isDismissible = true,
    bool enableDrag = true,
    bool canPop = true,
  }) {
    return Get.bottomSheet<T>(
      PopScope<T>(
        canPop: canPop,
        child: CustomBottomSheet(
          title: title,
          footer: footer,
          showHeader: showHeader,
          showCloseButton: showCloseButton,
          showBar: showBar,
          isExpanded: isExpanded,
          child: child,
        ),
      ),
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
    );
  }
}
