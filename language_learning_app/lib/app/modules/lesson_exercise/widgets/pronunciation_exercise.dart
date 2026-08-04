import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/data/models/exercise_question_model.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';

class PronunciationExercise extends StatelessWidget {
  const PronunciationExercise({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    final question = controller.currentQuestion;
    if (question == null) return const SizedBox.shrink();

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 24),
      child: Column(
        spacing: 22,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CustomText(
            text: question.instruction,
            style: AppTextStyle.labelMedSmall,
            color: AppColors.contentPrimary,
          ),
          _buildPronunciationPhraseCard(question),
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Obx(
              () => Column(
                spacing: 22,
                children: [
                  GestureDetector(
                    onTap: controller.isSubmitting.value
                        ? null
                        : controller.showPronunciationResult,
                    onLongPressStart: controller.isSubmitting.value
                        ? null
                        : (_) => controller.startRecording(),
                    onLongPressEnd: controller.isSubmitting.value
                        ? null
                        : (_) => controller.finishRecording(),
                    child: _buildMicrophoneButton(),
                  ),
                  Column(
                    spacing: 5,
                    children: [
                      CustomText(
                        text: controller.isSubmitting.value
                            ? 'ĐANG CHẤM PHÁT ÂM...'
                            : controller.isRecording.value
                            ? 'THẢ RA ĐỂ HOÀN TẤT'
                            : 'NHẤN VÀ GIỮ ĐỂ NÓI',
                        textAlign: TextAlign.center,
                        style: AppTextStyle.labelXSmall,
                        color: AppColors.contentTertiary,
                      ),
                      InkWell(
                        onTap: controller.showPronunciationResult,
                        borderRadius: BorderRadius.circular(16),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          child: CustomText(
                            text: 'Tôi không thể nói lúc này',
                            textAlign: TextAlign.center,
                            style: AppTextStyle.bodyXSReg,
                            color: AppColors.contentSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPronunciationPhraseCard(ExerciseQuestionModel question) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: AppColors.elevationS1,
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        spacing: 12,
        children: [
          CustomText(
            text: question.koreanText,
            textAlign: TextAlign.center,
            style: AppTextStyle.bodyMReg,
            color: AppColors.purple100,
          ),
          CustomText(
            text: question.romanization,
            textAlign: TextAlign.center,
            style: AppTextStyle.bodyXSReg,
            color: AppColors.contentTertiary,
          ),
          CustomText(
            text: question.translation,
            textAlign: TextAlign.center,
            style: AppTextStyle.bodyXSReg,
            color: AppColors.contentSecondary,
          ),
          CustomButton(
            width: 170,
            radius: 18,
            buttonSize: ButtonSizeEnum.EXTRA_SMALL,
            backgroundColor: AppColors.purple15,
            foregroundColor: AppColors.purple100,
            onPressed: () {},
            child: Row(
              spacing: 6,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CustomImage.asset(
                  AppIcons.icVolumeUp,
                  width: 15,
                  height: 15,
                  color: AppColors.purple100,
                  semanticLabel: 'Nghe phát âm mẫu',
                ),
                CustomText(
                  text: 'Nghe phát âm mẫu',
                  style: AppTextStyle.buttonS,
                  color: AppColors.purple100,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMicrophoneButton() {
    final isRecording = controller.isRecording.value;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      width: 132,
      height: 132,
      decoration: BoxDecoration(
        color: isRecording ? AppColors.purple35 : AppColors.purple15,
        shape: BoxShape.circle,
      ),
      padding: const EdgeInsets.all(14),
      child: Container(
        decoration: BoxDecoration(
          color: isRecording ? AppColors.purple75 : AppColors.purple35,
          shape: BoxShape.circle,
        ),
        padding: const EdgeInsets.all(14),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.purple100,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: CustomImage.asset(
            AppIcons.icMicro,
            width: 30,
            height: 30,
            color: AppColors.contentPrimaryInvert,
            semanticLabel: 'Ghi âm phát âm',
          ),
        ),
      ),
    );
  }
}
