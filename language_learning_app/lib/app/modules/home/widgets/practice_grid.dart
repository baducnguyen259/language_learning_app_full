import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class PracticeGrid extends StatelessWidget {
  const PracticeGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.55,
      children: [
        _buildPracticeTile(
          title: 'Từ vựng',
          icon: AppIcons.icDictionary,
          backgroundColor: AppColors.backgroundPPLightAccent,
          iconColor: AppColors.contentGreen,
        ),
        _buildPracticeTile(
          title: 'Luyện nghe',
          icon: AppIcons.icListen,
          backgroundColor: AppColors.backgroundSecondaryLightBlue,
          iconColor: AppColors.contentPPInfo,
        ),
        _buildPracticeTile(
          title: 'Phát âm',
          icon: AppIcons.icMicro,
          backgroundColor: AppColors.white,
          iconColor: AppColors.contentSecondaryOrange,
        ),
        _buildPracticeTile(
          title: 'Ngữ pháp',
          icon: AppIcons.icHistory,
          backgroundColor: AppColors.white,
          iconColor: AppColors.contentSecondaryYellow,
        ),
      ],
    );
  }

  Widget _buildPracticeTile({
    required String title,
    required String icon,
    required Color backgroundColor,
    required Color iconColor,
    VoidCallback? onTap,
  }) {
    return Material(
      color: AppColors.backgroundPrimary,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap ?? () {},
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CustomImage.asset(
                icon,
                width: 32,
                height: 32,
                padding: const EdgeInsets.all(7),
                backgroundColor: backgroundColor,
                shape: BoxShape.circle,
                color: iconColor,
                semanticLabel: title,
              ),
              CustomText(
                text: title,
                style: AppTextStyle.labelSmall,
                color: AppColors.contentPrimary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
