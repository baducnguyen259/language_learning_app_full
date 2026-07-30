import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class ProfileController extends GetxController {
  final RxBool isSoundEffectsEnabled = true.obs;
  final RxBool isDarkModeEnabled = false.obs;

  @override
  void onInit() {
    super.onInit();
    isDarkModeEnabled.value = Get.isDarkMode;
  }

  void setSoundEffectsEnabled(bool value) {
    isSoundEffectsEnabled.value = value;
  }

  void setDarkModeEnabled(bool value) {
    isDarkModeEnabled.value = value;
    Get.changeThemeMode(value ? ThemeMode.dark : ThemeMode.light);
  }

  void logout() {
    Get.offAllNamed(Routes.LOGIN);
  }
}
