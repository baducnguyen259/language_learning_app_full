import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/custom_dialog.dart';

/// Hiển thị các Dialog của ứng dụng thông qua overlay gốc của GetX.
///
/// Ứng dụng phải được khởi tạo bằng [GetMaterialApp].
/// Nội dung và xử lý của từng feature sẽ do module tương ứng đảm nhiệm,
/// tiện ích này chỉ chịu trách nhiệm cấu hình giao diện chung.
abstract class Dialogs {
  Dialogs._();

  /// Mở Dialog theo giao diện Material 3 của ứng dụng.
  ///
  /// Nội dung và hành vi của từng feature được truyền từ module sử dụng.
  ///
  /// - [barrierDismissible] quyết định có thể đóng Dialog bằng cách chạm
  ///   vào vùng nền hoặc nhấn nút Back của hệ thống hay không.
  /// - [showCloseButton] quyết định có hiển thị nút đóng ở góc Dialog hay không.
  /// - [canCloseDialog] chỉ quyết định việc nhấn nút hành động chính hoặc phụ
  ///   có tự động đóng Dialog trước khi gọi callback hay không.
  ///   Thuộc tính này không ảnh hưởng đến việc đóng bằng vùng nền,
  ///   nút Back hoặc nút đóng.
  ///
  /// [onComplete] được gọi sau khi Dialog được đóng, bất kể đóng bằng cách nào
  /// (nút hành động, chạm vùng nền, nút Back hoặc callback tự đóng Dialog).
  ///
  /// Nếu [onComplete] trả về một [Future], Future đó sẽ được chờ hoàn thành
  /// trước khi Future của phương thức này kết thúc.
  ///
  /// Các callback của nút hành động hiện được gọi sau khi Dialog bắt đầu đóng,
  /// vì vậy các callback này cần tự xử lý các lỗi bất đồng bộ nếu có.
  ///
  /// Ví dụ:
  ///
  /// ```dart
  /// await Dialogs.open<void>(
  ///   title: 'Xóa bài học?',
  ///   type: DialogType.ALERT,
  ///   content: const Text('Dữ liệu đã xóa không thể khôi phục.'),
  ///   primaryButtonLabel: 'Xóa',
  ///   secondaryButtonLabel: 'Hủy',
  ///   primaryAction: () async {
  ///     // Thực hiện xử lý của feature tại đây.
  ///   },
  ///   onComplete: () {
  ///     // Luôn được gọi sau khi Dialog đóng.
  ///   },
  /// );
  /// ```
  static Future<T?> open<T>({
    required Widget content,
    String title = '',
    Widget? image,
    DialogType type = DialogType.NONE,
    String primaryButtonLabel = '',
    String secondaryButtonLabel = '',
    FutureOr<void> Function()? primaryAction,
    FutureOr<void> Function()? secondaryAction,
    FutureOr<void> Function()? onComplete,
    bool showCloseButton = true,
    bool barrierDismissible = false,
    bool canCloseDialog = true,
  }) {
    final route = Get.dialog<T>(
      CustomDialog(
        dialogType: type,
        title: title,
        content: content,
        imageWidget: image,
        primaryButtonLabel: primaryButtonLabel,
        secondaryButtonLabel: secondaryButtonLabel,
        primaryAction: primaryAction,
        secondaryAction: secondaryAction,
        showCloseButton: showCloseButton,
        barrierDismissible: barrierDismissible,
        canCloseDialog: canCloseDialog,
      ),
      barrierDismissible: barrierDismissible,
    );

    return onComplete == null ? route : route.whenComplete(onComplete);
  }
}
