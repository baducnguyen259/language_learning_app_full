import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_question_heading.dart';

class SentenceExercise extends StatelessWidget {
  const SentenceExercise({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final question = controller.currentQuestion;
      if (question == null) return const SizedBox.shrink();

      return SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          spacing: 18,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ExerciseQuestionHeading(
              controller: controller,
              title: question.instruction,
            ),
            Row(
              spacing: 8,
              children: [
                CustomImage.asset(
                  AppIcons.icVolumeUp,
                  width: 18,
                  height: 18,
                  color: AppColors.contentSecondary,
                  semanticLabel: 'Nghe câu mẫu',
                ),
                Expanded(
                  child: CustomText(
                    text: question.prompt,
                    style: AppTextStyle.bodyXSReg,
                    color: AppColors.contentSecondary,
                  ),
                ),
              ],
            ),
            Container(
              constraints: const BoxConstraints(minHeight: 120),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.backgroundPrimary,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.purple35),
              ),
              alignment: Alignment.topLeft,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  for (final token in controller.sentenceAnswer)
                    _buildSentenceToken(token),
                  Container(width: 2, height: 30, color: AppColors.purple100),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 20),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                alignment: WrapAlignment.center,
                children: [
                  for (final option in question.options)
                    if (!controller.sentenceAnswer.contains(option.text))
                      _buildAvailableSentenceToken(option.text),
                ],
              ),
            ),
            Align(
              alignment: Alignment.center,
              child: InkWell(
                onTap: controller.resetSentence,
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  child: Row(
                    spacing: 5,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CustomImage.asset(
                        AppIcons.icArrowInRound,
                        width: 14,
                        height: 14,
                        color: AppColors.contentSecondary,
                        semanticLabel: 'Đặt lại câu',
                      ),
                      CustomText(
                        text: 'Đặt lại',
                        style: AppTextStyle.bodyXSReg,
                        color: AppColors.contentSecondary,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    });
  }

  Widget _buildSentenceToken(String text) {
    return Material(
      color: AppColors.purple100,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: () => controller.removeSentenceToken(text),
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: CustomText(
            text: text,
            style: AppTextStyle.labelMedXSmall,
            color: AppColors.contentPrimaryInvert,
          ),
        ),
      ),
    );
  }

  Widget _buildAvailableSentenceToken(String text) {
    return Material(
      color: AppColors.backgroundPrimary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(color: AppColors.borderPrimaryLightGrayScale),
      ),
      child: InkWell(
        onTap: () => controller.addSentenceToken(text),
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: CustomText(
            text: text,
            style: AppTextStyle.labelMedSmall,
            color: AppColors.contentPrimary,
          ),
        ),
      ),
    );
  }
}
