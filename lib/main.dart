import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/bindings/global_binding.dart';
import 'package:language_learning_app/app/common/values/app_theme.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

void main() {
  runApp(const LanguageLearningApp());
}

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
