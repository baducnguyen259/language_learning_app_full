import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';

class HomeSurfaceCard extends StatelessWidget {
  const HomeSurfaceCard({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: BorderRadius.circular(14),
      ),
      child: child,
    );
  }
}
