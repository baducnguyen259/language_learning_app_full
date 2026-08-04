import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/home/controllers/home_controller.dart';

class LearningStreakCard extends StatelessWidget {
  const LearningStreakCard({required this.controller, super.key});

  final HomeController controller;

  static const List<String> _dayLabels = [
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'CN',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [HexColor('#8E2DE2'), HexColor('#4A00E0')],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        // boxShadow: [
        //   BoxShadow(
        //     color: AppColors.elevationS1,
        //     blurRadius: 14,
        //     offset: const Offset(0, 6),
        //   ),
        // ],
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomText(
                      text: 'CHUỖI NGÀY HỌC',
                      style: AppTextStyle.labelXSmall,
                      color: AppColors.contentPrimaryInvert,
                    ),
                    const SizedBox(height: 4),
                    Obx(
                      () => CustomText(
                        text: '🔥  ${controller.learningStreak.value} ngày',
                        style: AppTextStyle.labelXSmall,
                        color: AppColors.contentPrimaryInvert,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: AppColors.colorChipBg,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Obx(
                  () => CustomText(
                    text: '+${controller.earnedExperience.value} XP',
                    style: AppTextStyle.buttonS,
                    color: AppColors.contentPrimaryInvert,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              _dayLabels.length,
              (index) => _LearningDay(
                label: _dayLabels[index],
                completed: index < 2,
                current: index == 2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LearningDay extends StatelessWidget {
  const _LearningDay({
    required this.label,
    required this.completed,
    required this.current,
  });

  final String label;
  final bool completed;
  final bool current;

  @override
  Widget build(BuildContext context) {
    final foreground = current
        ? AppColors.contentPrimaryInvert
        : AppColors.contentInverseTertiary;

    return Column(
      children: [
        CustomText(
          text: label,
          style: AppTextStyle.bodyXSReg,
          color: current ? AppColors.yellow100 : foreground,
        ),
        const SizedBox(height: 6),
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: current
                ? AppColors.backgroundPrimary
                : completed
                ? AppColors.colorChipBg
                : null,
            shape: BoxShape.circle,
            border: Border.all(color: foreground),
          ),
          alignment: Alignment.center,
          child: CustomText(
            text: completed
                ? '✓'
                : current
                ? '🔥'
                : '',
            style: AppTextStyle.labelXSmall,
            color: current
                ? AppColors.contentPPAccent
                : AppColors.contentPrimaryInvert,
          ),
        ),
      ],
    );
  }
}
