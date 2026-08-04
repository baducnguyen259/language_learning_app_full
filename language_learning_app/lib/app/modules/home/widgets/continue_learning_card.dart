import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/home/controllers/home_controller.dart';
import 'package:language_learning_app/app/modules/home/widgets/home_surface_card.dart';

class ContinueLearningCard extends StatelessWidget {
  const ContinueLearningCard({required this.controller, super.key});

  final HomeController controller;

  @override
  Widget build(BuildContext context) {
    return HomeSurfaceCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomText(
                      text: 'TIẾP TỤC HỌC',
                      style: AppTextStyle.bodyXSReg,
                      color: AppColors.contentSecondary,
                    ),
                    const SizedBox(height: 2),
                    CustomText(
                      text: 'Bài 5: Chào hỏi hằng ngày',
                      style: AppTextStyle.labelMedSmall,
                      color: AppColors.contentPrimary,
                    ),
                  ],
                ),
              ),
              CustomImage.asset(
                AppIcons.icBook,
                width: 24,
                height: 24,
                padding: const EdgeInsets.all(9),
                backgroundColor: AppColors.backgroundPPLightAccent,
                radius: 12,
                color: AppColors.contentPPAccent,
                semanticLabel: 'Bài học',
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: CustomText(
                  text: 'Tiến độ',
                  style: AppTextStyle.bodyXSReg,
                  color: AppColors.contentSecondary,
                ),
              ),
              Obx(
                () => CustomText(
                  text: '${(controller.lessonProgress.value * 100).round()}%',
                  style: AppTextStyle.bodyXSReg,
                  color: AppColors.contentPPAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Obx(
            () => LinearProgressIndicator(
              value: controller.lessonProgress.value,
              minHeight: 6,
              borderRadius: BorderRadius.circular(4),
              backgroundColor: AppColors.backgroundPPLightAccent,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.purple100),
            ),
          ),
          const SizedBox(height: 14),
          CustomButton(
            radius: 14,
            onPressed: () {},
            backgroundColor: AppColors.purple100,
            foregroundColor: AppColors.contentPrimaryInvert,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CustomText(
                  text: 'Tiếp tục ngay',
                  style: AppTextStyle.buttonL,
                  color: AppColors.contentPrimaryInvert,
                  height: 1,
                ),
                CustomImage.asset(
                  AppIcons.icActionArrowRight,
                  width: 18,
                  height: 18,
                  color: AppColors.contentPrimaryInvert,
                  semanticLabel: 'Tiếp tục',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
