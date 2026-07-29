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
        borderRadius: BorderRadius.all(Radius.circular(12)),
        color: AppColors.backgroundSecondary,
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.backgroundPPLightAccent,
            child: CustomImage.asset(
              AppIcons.icAccount,
              width: 24,
              height: 24,
              color: AppColors.contentPPAccent,
              semanticLabel: 'Ảnh đại diện',
            ),
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
