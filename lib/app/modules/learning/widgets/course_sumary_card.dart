import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/learning/controllers/learning_controller.dart';

class CourseSumaryCard extends StatelessWidget {
  const CourseSumaryCard({super.key, required this.controller});
  final LearningController controller;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(children: [_buildLever(), _buildProgress()]),
    ).paddingSymmetric(horizontal: 20, vertical: 8);
  }

  Widget _buildLever() {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AppColors.backgroundPPLightAccent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: CustomText(
                  text: 'Sơ cấp 1',
                  style: AppTextStyle.bodyXSReg,
                ),
              ),
              const SizedBox(height: 8),
              CustomText(
                text: 'Tiếng Hàn cơ bản',
                style: AppTextStyle.labelSmall,
                color: AppColors.contentPrimary,
              ),
            ],
          ).paddingSymmetric(horizontal: 8, vertical: 16),
        ),
        CustomImage.asset(
          AppIcons.icLesson,
          width: 24,
          height: 24,
          padding: const EdgeInsets.all(12),
          shape: BoxShape.circle,
          backgroundColor: AppColors.purple15,
          color: AppColors.purple100,
        ),
      ],
    );
  }

  Widget _buildProgress() {
    return Obx(
      () => Column(
        children: [
          Row(
            children: [
              Expanded(
                child: CustomText(
                  text: 'Tiến độ khóa học',
                  style: AppTextStyle.bodyXSReg,
                  color: AppColors.contentSecondary,
                ),
              ),
              CustomText(
                text: '${(controller.courseProgress.value * 100).round()}%',
                style: AppTextStyle.bodyXSSemi,
                color: AppColors.purple100,
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: controller.courseProgress.value,
            minHeight: 6,
            borderRadius: BorderRadius.circular(4),
            backgroundColor: AppColors.purple15,
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.purple100),
          ),
        ],
      ).paddingOnly(bottom: 12),
    );
  }
}
