import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/data/models/answer_result_model.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class PronunciationResult extends StatelessWidget {
  const PronunciationResult({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    final question = controller.pronunciationQuestion;
    final result = controller.answerResult.value;
    if (question == null || result == null) {
      return const SizedBox.shrink();
    }

    final scoreLabel = '${(result.score * 100).round()}%';

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
      child: Column(
        spacing: 28,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CustomText(
            text: question.koreanText,
            textAlign: TextAlign.center,
            style: AppTextStyle.bodyMReg,
            color: AppColors.contentPrimary,
          ),
          Column(
            spacing: 14,
            children: [
              SizedBox.square(
                dimension: 126,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox.expand(
                      child: CircularProgressIndicator(
                        value: result.score,
                        strokeWidth: 10,
                        strokeCap: StrokeCap.round,
                        backgroundColor: AppColors.purple15,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          AppColors.purple100,
                        ),
                      ),
                    ),
                    CustomText(
                      text: scoreLabel,
                      style: AppTextStyle.headingH5Bold,
                      color: AppColors.purple100,
                    ),
                  ],
                ),
              ),
              CustomText(
                text: result.feedback,
                textAlign: TextAlign.center,
                style: AppTextStyle.labelSmall,
                color: AppColors.purple100,
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            decoration: BoxDecoration(
              color: AppColors.backgroundPrimary,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.borderPrimaryLightGrayScale),
              boxShadow: [
                BoxShadow(
                  color: AppColors.elevationS1,
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Wrap(
              spacing: 5,
              runSpacing: 6,
              alignment: WrapAlignment.center,
              children: [
                for (final segment in result.pronunciationSegments)
                  _buildPronunciationSegment(segment),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPronunciationSegment(PronunciationSegmentResultModel segment) {
    return CustomText(
      text: segment.text,
      style: AppTextStyle.bodyMReg,
      color: segment.score >= 0.8 ? AppColors.green100 : AppColors.orange600,
    );
  }
}
