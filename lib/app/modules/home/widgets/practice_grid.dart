import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class PracticeGrid extends StatelessWidget {
  const PracticeGrid({super.key});

  static const List<_PracticeItem> _items = [
    _PracticeItem(
      title: 'Từ vựng',
      icon: AppIcons.icIdCard,
      color: _PracticeColor.purple,
    ),
    _PracticeItem(
      title: 'Luyện nghe',
      icon: AppIcons.icHistory,
      color: _PracticeColor.blue,
    ),
    _PracticeItem(
      title: 'Phát âm',
      icon: AppIcons.icRecording,
      color: _PracticeColor.orange,
    ),
    _PracticeItem(
      title: 'Ngữ pháp',
      icon: AppIcons.icGlobe,
      color: _PracticeColor.yellow,
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
      itemBuilder: (context, index) => _PracticeTile(item: _items[index]),
    );
  }
}

enum _PracticeColor { purple, blue, orange, yellow }

class _PracticeItem {
  const _PracticeItem({
    required this.title,
    required this.icon,
    required this.color,
  });

  final String title;
  final String icon;
  final _PracticeColor color;
}

class _PracticeTile extends StatelessWidget {
  const _PracticeTile({required this.item});

  final _PracticeItem item;

  Color get _backgroundColor => switch (item.color) {
    _PracticeColor.purple => AppColors.backgroundPPLightAccent,
    _PracticeColor.blue => AppColors.backgroundSecondaryLightBlue,
    _PracticeColor.orange => AppColors.backgroundSecondaryLightOrange,
    _PracticeColor.yellow => AppColors.backgroundSecondaryLightYellow,
  };

  Color get _iconColor => switch (item.color) {
    _PracticeColor.purple => AppColors.contentPPAccent,
    _PracticeColor.blue => AppColors.contentPPInfo,
    _PracticeColor.orange => AppColors.contentSecondaryOrange,
    _PracticeColor.yellow => AppColors.contentSecondaryYellow,
  };

  @override
  Widget build(BuildContext context) {
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
                backgroundColor: _backgroundColor,
                shape: BoxShape.circle,
                color: _iconColor,
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
