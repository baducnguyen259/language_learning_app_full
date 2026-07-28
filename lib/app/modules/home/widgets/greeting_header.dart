import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class GreetingHeader extends StatelessWidget {
  const GreetingHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        boxShadow: [
          BoxShadow(
            color: AppColors.elevationS1,
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          CustomImage.asset(
            AppIcons.icAccount,
            width: 32,
            height: 32,
            padding: const EdgeInsets.all(5),
            shape: BoxShape.circle,
            backgroundColor: AppColors.backgroundPPLightAccent,
            color: AppColors.contentPPAccent,
            semanticLabel: 'Ảnh đại diện',
          ),
          const SizedBox(width: 12),
          Expanded(
            child: CustomText(
              text: 'Xin chào, Đức!',
              style: AppTextStyle.labelSmall,
              color: AppColors.contentPrimary,
            ),
          ),
          CustomImage.asset(
            AppIcons.icBell,
            width: 22,
            height: 22,
            color: AppColors.contentSecondary,
            semanticLabel: 'Thông báo',
          ),
        ],
      ),
    );
  }
}
