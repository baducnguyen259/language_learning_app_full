import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class ExerciseBottomActions extends StatelessWidget {
  const ExerciseBottomActions({
    required this.controller,
    required this.stage,
    super.key,
  });

  final LessonExerciseController controller;
  final int stage;

  @override
  Widget build(BuildContext context) {
    final isResult = stage == LessonExerciseController.resultStage;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        border: Border(
          top: BorderSide(color: AppColors.borderPrimaryLightGrayScale),
        ),
      ),
      child: isResult
          ? Column(
              spacing: 8,
              mainAxisSize: MainAxisSize.min,
              children: [
                CustomButton.primary(
                  title: 'Tiếp tục',
                  radius: 10,
                  buttonSize: ButtonSizeEnum.MEDIUM,
                  backgroundColor: AppColors.purple100,
                  style: AppTextStyle.buttonS,
                  showLoading: true,
                  onPressed: controller.nextStage,
                ),
                CustomButton(
                  radius: 10,
                  buttonSize: ButtonSizeEnum.MEDIUM,
                  backgroundColor: AppColors.backgroundPrimary,
                  foregroundColor: AppColors.purple100,
                  borderColor: AppColors.purple100,
                  showBorder: true,
                  onPressed: controller.retryPronunciation,
                  child: CustomText(
                    text: 'Thử lại',
                    style: AppTextStyle.buttonS,
                    color: AppColors.purple100,
                  ),
                ),
              ],
            )
          : CustomButton.primary(
              title: 'Kiểm tra',
              radius: 10,
              buttonSize: ButtonSizeEnum.MEDIUM,
              backgroundColor: AppColors.purple100,
              style: AppTextStyle.buttonS,
              showLoading: true,
              onPressed: controller.nextStage,
            ),
    );
  }
}
