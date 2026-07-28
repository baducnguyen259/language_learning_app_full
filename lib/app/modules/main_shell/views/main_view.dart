import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/modules/home/views/home_view.dart';
import 'package:language_learning_app/app/modules/learning_path/views/learning_path_view.dart';
import 'package:language_learning_app/app/modules/main_shell/controllers/main_controller.dart';
import 'package:language_learning_app/app/modules/main_shell/widgets/main_bottom_navigation_bar.dart';
import 'package:language_learning_app/app/modules/practice/views/practice_view.dart';
import 'package:language_learning_app/app/modules/profile/views/profile_view.dart';
import 'package:language_learning_app/app/modules/vocabulary/views/vocabulary_view.dart';

class MainShellView extends GetView<MainShellController> {
  const MainShellView({super.key});

  static const List<Widget> _screens = [
    HomeView(),
    LearningPathView(),
    PracticeView(),
    VocabularyView(),
    ProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(
        () => IndexedStack(
          index: controller.currentIndex.value,
          children: _screens,
        ),
      ),
      bottomNavigationBar: Obx(
        () => MainBottomNavigationBar(
          currentIndex: controller.currentIndex.value,
          onTap: controller.changeTab,
        ),
      ),
    );
  }
}
