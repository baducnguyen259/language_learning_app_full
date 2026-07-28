import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class LearningHeader extends StatelessWidget {
  const LearningHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      padding: EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(color: AppColors.backgroundSecondaryLightBlue),
      child: Row(
        children: [
          Expanded(
            child: CustomText(
              text: 'Lộ trình học',
              style: AppTextStyle.labelMedium,
              color: AppColors.purple100,
            ),
          ),
          CustomImage.asset(
            AppIcons.icSearch,
            width: 24,
            height: 24,
            color: AppColors.contentPrimary,
            semanticLabel: 'Tìm kiếm',
          ),
        ],
      ),
    );
  }
}
