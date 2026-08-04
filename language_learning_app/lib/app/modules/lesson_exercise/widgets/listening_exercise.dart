import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/controllers/lesson_exercise_controller.dart';
import 'package:language_learning_app/app/modules/lesson_exercise/widgets/exercise_question_heading.dart';

class ListeningExercise extends StatelessWidget {
  const ListeningExercise({required this.controller, super.key});

  final LessonExerciseController controller;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final question = controller.currentQuestion;
      if (question == null) return const SizedBox.shrink();

      return SingleChildScrollView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          spacing: 18,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ExerciseQuestionHeading(
              controller: controller,
              title: question.instruction,
            ),
            Padding(
              padding: const EdgeInsets.only(top: 52),
              child: Column(
                spacing: 20,
                children: [
                  _buildLargeAudioButton(),
                  Row(
                    spacing: 20,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Column(
                        spacing: 5,
                        children: [
                          InkWell(
                            onTap: controller.changePlaybackSpeed,
                            borderRadius: BorderRadius.circular(18),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 7,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.backgroundPrimary,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: AppColors.borderPrimaryLightGrayScale,
                                ),
                              ),
                              child: CustomText(
                                text:
                                    '${controller.playbackSpeed.value.toStringAsFixed(2).replaceFirst(RegExp(r'0+$'), '').replaceFirst(RegExp(r'\.$'), '')}x',
                                style: AppTextStyle.bodyXSReg,
                                color: AppColors.contentSecondary,
                              ),
                            ),
                          ),
                          CustomText(
                            text: 'Nghe chậm',
                            style: AppTextStyle.bodyXSReg,
                            color: AppColors.contentSecondary,
                          ),
                        ],
                      ),
                      Column(
                        spacing: 5,
                        children: [
                          Material(
                            color: AppColors.backgroundPPLightAccent,
                            shape: const CircleBorder(),
                            child: InkWell(
                              onTap: () {},
                              customBorder: const CircleBorder(),
                              child: Padding(
                                padding: const EdgeInsets.all(9),
                                child: CustomImage.asset(
                                  AppIcons.icArrowInRound,
                                  width: 16,
                                  height: 16,
                                  color: AppColors.contentSecondary,
                                  semanticLabel: 'Nghe lại',
                                ),
                              ),
                            ),
                          ),
                          CustomText(
                            text: 'Nghe lại',
                            style: AppTextStyle.bodyXSReg,
                            color: AppColors.contentSecondary,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 72),
              child: Column(
                spacing: 10,
                children: [
                  CustomTextField(
                    controller: controller.listeningAnswerController,
                    hintText: question.prompt,
                    semanticLabel: 'Từ tiếng Hàn bạn nghe được',
                    height: 48,
                    radius: 10,
                    fillColor: AppColors.backgroundPrimary,
                    enabledBorderColor: AppColors.borderPrimaryLightGrayScale,
                    focusedBorderColor: AppColors.purple100,
                    showErrorText: false,
                  ),
                  CustomText(
                    text: 'Tôi không thể nhập tiếng Hàn',
                    textAlign: TextAlign.center,
                    style: AppTextStyle.bodyXSReg,
                    color: AppColors.contentSecondary,
                    textDecoration: TextDecoration.underline,
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    });
  }

  Widget _buildLargeAudioButton() {
    return Material(
      color: AppColors.purple100,
      shape: CircleBorder(
        side: BorderSide(color: AppColors.purple35, width: 4),
      ),
      child: InkWell(
        onTap: () {},
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: CustomImage.asset(
            AppIcons.icVolumeUp,
            width: 34,
            height: 34,
            color: AppColors.contentPrimaryInvert,
            semanticLabel: 'Nghe từ cần nhập',
          ),
        ),
      ),
    );
  }
}
