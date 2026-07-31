import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_question_heading.dart';

class MissingWordExercise extends StatelessWidget {
  const MissingWordExercise({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final question = controller.currentQuestion;
      if (question == null || question.options.length < 4) {
        return const SizedBox.shrink();
      }

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
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.backgroundPrimary,
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.elevationS1,
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                spacing: 14,
                children: [
                  Row(
                    spacing: 12,
                    children: [
                      _buildSmallAudioButton(),
                      Expanded(
                        child: CustomText(
                          text: question.koreanText,
                          style: AppTextStyle.bodyMReg,
                          color: AppColors.contentPrimary,
                        ),
                      ),
                    ],
                  ),
                  Divider(
                    height: 1,
                    color: AppColors.borderPrimaryLightGrayScale,
                  ),
                  CustomText(
                    text: question.translation,
                    textAlign: TextAlign.center,
                    style: AppTextStyle.bodyXSReg,
                    color: AppColors.contentSecondary,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 72),
              child: Column(
                spacing: 12,
                children: [
                  Row(
                    spacing: 12,
                    children: [
                      _buildMissingWordOption(
                        index: 0,
                        option: question.options[0],
                      ),
                      _buildMissingWordOption(
                        index: 1,
                        option: question.options[1],
                      ),
                    ],
                  ),
                  Row(
                    spacing: 12,
                    children: [
                      _buildMissingWordOption(
                        index: 2,
                        option: question.options[2],
                      ),
                      _buildMissingWordOption(
                        index: 3,
                        option: question.options[3],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    });
  }

  Widget _buildSmallAudioButton() {
    return Material(
      color: AppColors.purple100,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: () {},
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: CustomImage.asset(
            AppIcons.icVolumeUp,
            width: 18,
            height: 18,
            color: AppColors.contentPrimaryInvert,
            semanticLabel: 'Nghe phát âm',
          ),
        ),
      ),
    );
  }

  Widget _buildMissingWordOption({
    required int index,
    required ExerciseOptionModel option,
  }) {
    final isSelected = controller.selectedMissingWordIndex.value == index;

    return Expanded(
      child: Material(
        color: isSelected ? AppColors.purple5 : AppColors.backgroundPrimary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: isSelected
                ? AppColors.purple100
                : AppColors.borderPrimaryLightGrayScale,
          ),
        ),
        child: InkWell(
          onTap: () => controller.selectMissingWord(index),
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 17),
            child: CustomText(
              text: option.text,
              textAlign: TextAlign.center,
              style: AppTextStyle.labelMedSmall,
              color: isSelected
                  ? AppColors.purple100
                  : AppColors.contentPrimary,
            ),
          ),
        ),
      ),
    );
  }
}
