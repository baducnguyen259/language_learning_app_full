import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class ExerciseLoadingState extends StatelessWidget {
  const ExerciseLoadingState({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        spacing: 12,
        children: [
          CircularProgressIndicator(color: AppColors.purple100),
          CustomText(
            text: 'Đang tải bài tập...',
            style: AppTextStyle.bodyXSReg,
            color: AppColors.contentSecondary,
          ),
        ],
      ),
    );
  }
}

class ExerciseEmptyState extends StatelessWidget {
  const ExerciseEmptyState({required this.onRetry, super.key});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: 16,
          children: [
            CustomImage.asset(
              AppIcons.icBook,
              width: 40,
              height: 40,
              padding: const EdgeInsets.all(16),
              shape: BoxShape.circle,
              backgroundColor: AppColors.purple15,
              color: AppColors.purple100,
              semanticLabel: 'Không có bài tập',
            ),
            Column(
              spacing: 8,
              children: [
                CustomText(
                  text: 'Chưa có bài tập',
                  style: AppTextStyle.headingH7Bold,
                  color: AppColors.contentPrimary,
                  textAlign: TextAlign.center,
                ),
                CustomText(
                  text: 'Hiện chưa có dữ liệu bài tập.',
                  style: AppTextStyle.bodyXSReg,
                  color: AppColors.contentSecondary,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            _RetryButton(onPressed: onRetry),
          ],
        ),
      ),
    );
  }
}

class ExerciseErrorState extends StatelessWidget {
  const ExerciseErrorState({
    required this.message,
    required this.onRetry,
    super.key,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: 16,
          children: [
            CustomImage.asset(
              AppIcons.icErrorIcon,
              width: 40,
              height: 40,
              padding: const EdgeInsets.all(16),
              shape: BoxShape.circle,
              backgroundColor: AppColors.red15,
              color: AppColors.contentNegative,
              semanticLabel: 'Lỗi tải bài tập',
            ),
            Column(
              spacing: 8,
              children: [
                CustomText(
                  text: 'Không thể tải bài tập',
                  style: AppTextStyle.headingH7Bold,
                  color: AppColors.contentPrimary,
                  textAlign: TextAlign.center,
                ),
                CustomText(
                  text: message,
                  style: AppTextStyle.bodyXSReg,
                  color: AppColors.contentSecondary,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            _RetryButton(onPressed: onRetry),
          ],
        ),
      ),
    );
  }
}

class _RetryButton extends StatelessWidget {
  const _RetryButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      width: 128,
      radius: 12,
      buttonSize: ButtonSizeEnum.SMALL,
      backgroundColor: AppColors.purple100,
      foregroundColor: AppColors.contentPrimaryInvert,
      onPressed: onPressed,
      child: CustomText(
        text: 'Thử lại',
        style: AppTextStyle.buttonS,
        color: AppColors.contentPrimaryInvert,
      ),
    );
  }
}
