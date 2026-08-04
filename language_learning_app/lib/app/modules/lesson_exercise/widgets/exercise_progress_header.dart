import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class ExerciseProgressHeader extends StatelessWidget {
  const ExerciseProgressHeader({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        spacing: 12,
        children: [
          Semantics(
            button: true,
            label: 'Đóng bài luyện tập',
            child: InkWell(
              onTap: controller.closeExercise,
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: const EdgeInsets.all(4),
                child: CustomImage.asset(
                  AppIcons.icCloseRed,
                  width: 18,
                  height: 18,
                  color: AppColors.contentPrimary,
                ),
              ),
            ),
          ),
          Expanded(
            child: LinearProgressIndicator(
              value: controller.progress,
              minHeight: 6,
              borderRadius: BorderRadius.circular(6),
              backgroundColor: AppColors.purple15,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.purple100),
            ),
          ),
          if (controller.showLives)
            Row(
              spacing: 3,
              children: [
                CustomImage.asset(
                  AppIcons.icFavorite,
                  width: 18,
                  height: 18,
                  color: AppColors.red100,
                  semanticLabel: 'Số lượt còn lại',
                ),
                CustomText(
                  text: '5',
                  style: AppTextStyle.bodyXSSemi,
                  color: AppColors.red100,
                ),
              ],
            ),
        ],
      ),
    );
  }
}
