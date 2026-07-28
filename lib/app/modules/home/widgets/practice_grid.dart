import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class PracticeGrid extends StatelessWidget {
  const PracticeGrid({super.key});

  static final List<_PracticeItem> _items = [
    _PracticeItem(
      title: 'Từ vựng',
      icon: AppIcons.icDictionary,
      backgroundColor: AppColors.backgroundPPLightAccent,
      iconColor: AppColors.contentGreen,
    ),
    _PracticeItem(
      title: 'Luyện nghe',
      icon: AppIcons.icListen,
      backgroundColor: AppColors.backgroundSecondaryLightBlue,
      iconColor: AppColors.contentPPInfo,
    ),
    _PracticeItem(
      title: 'Phát âm',
      icon: AppIcons.icMicro,
      backgroundColor: AppColors.white,
      iconColor: AppColors.contentSecondaryOrange,
    ),
    _PracticeItem(
      title: 'Ngữ pháp',
      icon: AppIcons.icHistory,
      backgroundColor: AppColors.white,
      iconColor: AppColors.contentSecondaryYellow,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _items.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.55,
      ),
      itemBuilder: (context, index) => _buildPracticeTile(_items[index]),
    );
  }

  Widget _buildPracticeTile(_PracticeItem item) {
    return Material(
      color: AppColors.backgroundPrimary,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CustomImage.asset(
                item.icon,
                width: 32,
                height: 32,
                padding: const EdgeInsets.all(7),
                backgroundColor: item.backgroundColor,
                shape: BoxShape.circle,
                color: item.iconColor,
                semanticLabel: item.title,
              ),
              CustomText(
                text: item.title,
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

class _PracticeItem {
  const _PracticeItem({
    required this.title,
    required this.icon,
    required this.backgroundColor,
    required this.iconColor,
  });

  final String title;
  final String icon;
  final Color backgroundColor;
  final Color iconColor;
}
