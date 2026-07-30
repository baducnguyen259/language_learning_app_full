import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/home/controllers/home_controller.dart';
import 'package:language_learning_app/app/modules/home/widgets/continue_learning_card.dart';
import 'package:language_learning_app/app/modules/home/widgets/greeting_header.dart';
import 'package:language_learning_app/app/modules/home/widgets/learning_streak_card.dart';
import 'package:language_learning_app/app/modules/home/widgets/practice_grid.dart';

class HomeContent extends GetView<HomeController> {
  const HomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const GreetingHeader(),
          const SizedBox(height: 14),
          LearningStreakCard(controller: controller),
          const SizedBox(height: 18),
          ContinueLearningCard(controller: controller),
          const SizedBox(height: 18),
          // DailyGoalCard(controller: controller),
          // const SizedBox(height: 20),
          CustomText(
            text: 'Luyện tập',
            style: AppTextStyle.labelMedium,
            color: AppColors.contentPrimary,
          ),
          const SizedBox(height: 12),
          const PracticeGrid(),
        ],
      ),
    );
  }
}
