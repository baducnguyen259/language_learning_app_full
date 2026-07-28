import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';

class MainBottomNavigationBar extends StatelessWidget {
  const MainBottomNavigationBar({
    required this.currentIndex,
    required this.onTap,
    this.labelTextStyle,
    this.selectedLabelTextStyle,
    super.key,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final TextStyle? labelTextStyle;
  final TextStyle? selectedLabelTextStyle;

  static const List<_NavigationItem> _items = [
    _NavigationItem(label: 'Trang chủ', icon: AppIcons.icHome1),
    _NavigationItem(label: 'Bài học', icon: AppIcons.icLesson),
    _NavigationItem(label: 'Luyện tập', icon: AppIcons.icQuiz),
    _NavigationItem(label: 'Từ vựng', icon: AppIcons.icDictionary),
    _NavigationItem(label: 'Cá nhân', icon: AppIcons.icAccount),
  ];

  @override
  Widget build(BuildContext context) {
    return NavigationBarTheme(
      data: NavigationBarTheme.of(context).copyWith(
        labelTextStyle: WidgetStateProperty.resolveWith(_resolveLabelTextStyle),
      ),
      child: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: onTap,
        backgroundColor: AppColors.backgroundPrimary,
        indicatorColor: AppColors.backgroundPPLightAccent,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: List.generate(
          _items.length,
          (index) => _buildDestination(_items[index]),
        ),
      ),
    );
  }

  TextStyle _resolveLabelTextStyle(Set<WidgetState> states) {
    final isSelected = states.contains(WidgetState.selected);
    final style = isSelected
        ? selectedLabelTextStyle ?? labelTextStyle ?? AppTextStyle.bodyXSReg
        : labelTextStyle ?? AppTextStyle.bodyXSReg;

    return style.copyWith(
      color:
          style.color ??
          (isSelected ? AppColors.red100 : AppColors.contentSecondary),
    );
  }

  NavigationDestination _buildDestination(_NavigationItem item) {
    return NavigationDestination(
      label: item.label,
      icon: _NavigationIcon(
        asset: item.icon,
        label: item.label,
        color: AppColors.contentSecondary,
      ),
      selectedIcon: _NavigationIcon(
        asset: item.icon,
        label: item.label,
        color: AppColors.red100,
      ),
    );
  }
}

class _NavigationItem {
  const _NavigationItem({required this.label, required this.icon});

  final String label;
  final String icon;
}

class _NavigationIcon extends StatelessWidget {
  const _NavigationIcon({
    required this.asset,
    required this.label,
    required this.color,
  });

  final String asset;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return CustomImage.asset(
      asset,
      width: 24,
      height: 24,
      color: color,
      semanticLabel: label,
    );
  }
}
