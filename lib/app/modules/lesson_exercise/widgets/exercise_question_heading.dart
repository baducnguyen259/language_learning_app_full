import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class ExerciseQuestionHeading extends StatelessWidget {
  const ExerciseQuestionHeading({
    required this.controller,
    required this.title,
    super.key,
  });

  final LessonExerciseController controller;
  final String title;

  @override
  Widget build(BuildContext context) {
    final questionNumber = controller.currentQuestionNumber;

    return Column(
      spacing: 8,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (questionNumber != null)
          CustomText(
            text: 'CÂU $questionNumber/10',
            style: AppTextStyle.labelXSmall,
            color: AppColors.purple100,
          ),
        CustomText(
          text: title,
          style: AppTextStyle.headingH7Bold,
          color: AppColors.contentPrimary,
        ),
      ],
    );
  }
}
