import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_question_heading.dart';

class MatchingExercise extends StatelessWidget {
  const MatchingExercise({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final question = controller.currentQuestion;
      if (question == null || question.options.length < 8) {
        return const SizedBox.shrink();
      }

      return SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          spacing: 24,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ExerciseQuestionHeading(
              controller: controller,
              title: question.instruction,
            ),
            Column(
              spacing: 10,
              children: [
                Row(
                  spacing: 12,
                  children: [
                    _buildMatchingOption(index: 0, option: question.options[0]),
                    _buildMatchingOption(index: 1, option: question.options[1]),
                  ],
                ),
                Row(
                  spacing: 12,
                  children: [
                    _buildMatchingOption(index: 2, option: question.options[2]),
                    _buildMatchingOption(index: 3, option: question.options[3]),
                  ],
                ),
                Row(
                  spacing: 12,
                  children: [
                    _buildMatchingOption(index: 4, option: question.options[4]),
                    _buildMatchingOption(index: 5, option: question.options[5]),
                  ],
                ),
                Row(
                  spacing: 12,
                  children: [
                    _buildMatchingOption(index: 6, option: question.options[6]),
                    _buildMatchingOption(index: 7, option: question.options[7]),
                  ],
                ),
              ],
            ),
          ],
        ),
      );
    });
  }

  Widget _buildMatchingOption({
    required int index,
    required ExerciseOptionModel option,
  }) {
    final isSelected = controller.selectedMatchingIndex.value == index;
    final backgroundColor = option.isMatched
        ? AppColors.green15
        : isSelected
        ? AppColors.purple5
        : AppColors.backgroundPrimary;
    final borderColor = option.isMatched
        ? AppColors.green100
        : isSelected
        ? AppColors.purple100
        : AppColors.borderPrimaryLightGrayScale;
    final contentColor = option.isMatched
        ? AppColors.contentSecondaryGreen
        : isSelected
        ? AppColors.purple100
        : AppColors.contentPrimary;

    return Expanded(
      child: Material(
        color: backgroundColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: borderColor),
        ),
        child: InkWell(
          onTap: option.isMatched
              ? null
              : () => controller.selectMatchingOption(index),
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 15),
            child: CustomText(
              text: option.text,
              textAlign: TextAlign.center,
              style: AppTextStyle.labelMedSmall,
              color: contentColor,
              maxLines: 1,
              textOverflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ),
    );
  }
}
