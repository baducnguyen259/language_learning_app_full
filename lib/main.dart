import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/bindings/global_binding.dart';
import 'package:language_learning_app/app/common/values/app_theme.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

/// Khởi chạy ứng dụng bằng widget gốc [LanguageLearningApp].
void main() {
  runApp(const LanguageLearningApp());
}

/// Widget gốc cấu hình điều hướng GetX và giao diện Material 3.
///
/// Widget chỉ được tạo một lần tại [main]. Các màn hình tính năng nên được mở
/// bằng route trong [Routes] để GetX áp dụng đúng binding:
/// ```dart
/// runApp(const LanguageLearningApp());
/// ```
class LanguageLearningApp extends StatelessWidget {
  const LanguageLearningApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Language Learning App',
      debugShowCheckedModeBanner: false,
      initialRoute: Routes.LOGIN,
      getPages: AppPages.routes,
      initialBinding: GlobalBinding(),
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      // Luôn khởi động với giao diện sáng, không phụ thuộc cài đặt hệ điều hành.
      themeMode: ThemeMode.light,
    );
  }
}
