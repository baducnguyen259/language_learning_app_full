import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/home/controllers/home_controller.dart';
import 'package:language_learning_app/app/modules/home/widgets/home_surface_card.dart';

class DailyGoalCard extends StatelessWidget {
  const DailyGoalCard({required this.controller, super.key});

  final HomeController controller;

  @override
  Widget build(BuildContext context) {
    return HomeSurfaceCard(
      child: Row(
        children: [
          SizedBox.square(
            dimension: 44,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: 0.78,
                  strokeWidth: 4,
                  backgroundColor: AppColors.backgroundPPLightAccent,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.green100),
                ),
                CustomImage.asset(
                  AppIcons.icClockDash,
                  width: 20,
                  height: 20,
                  color: AppColors.contentPPAccent,
                  semanticLabel: 'Mục tiêu',
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomText(
                  text: 'Mục tiêu hằng ngày',
                  style: AppTextStyle.labelSmall,
                  color: AppColors.contentPrimary,
                ),
                Obx(
                  () => CustomText(
                    text:
                        '${controller.completedMinutes.value}/${controller.dailyGoalMinutes.value} phút',
                    style: AppTextStyle.bodyXSReg,
                    color: AppColors.contentSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
