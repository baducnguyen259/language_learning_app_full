import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';

class CompleteProfileAvatar extends StatelessWidget {
  const CompleteProfileAvatar({
    super.key,
    required this.avatarUrl,
    required this.onCameraTap,
  });

  final String? avatarUrl;
  final VoidCallback onCameraTap;

  Widget _buildAvatarImage() {
    final url = avatarUrl?.trim() ?? '';
    if (url.isEmpty) {
      return CustomImage.asset(
        AppIcons.icAccount,
        width: 48,
        height: 48,
        color: AppColors.contentPPAccent,
        semanticLabel: 'Ảnh đại diện mặc định',
      );
    }
    return CustomImage.network(
      url,
      width: 72,
      height: 72,
      fit: BoxFit.cover,
      semanticLabel: 'Ảnh đại diện',
      errorWidget: CustomImage.asset(
        AppIcons.icAccount,
        width: 48,
        height: 48,
        color: AppColors.contentPPAccent,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox.square(
          dimension: 84,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 76,
                height: 76,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.backgroundPPLightAccent,
                  border: Border.all(
                    color: AppColors.backgroundPrimary,
                    width: 3,
                  ),
                ),
                child: ClipOval(child: _buildAvatarImage()),
              ),
              Positioned(
                right: 2,
                bottom: 4,
                child: Semantics(
                  button: true,
                  label: 'Đổi ảnh đại diện',
                  child: InkWell(
                    onTap: onCameraTap,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 28,
                      height: 28,
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.purple100,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.backgroundPrimary,
                          width: 2,
                        ),
                      ),
                      child: CustomImage.asset(
                        AppIcons.icCamera,
                        color: AppColors.contentPrimaryInvert,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        CustomText(
          text: 'Nhấn vào ảnh để thay đổi',
          style: AppTextStyle.bodyXSReg,
          color: AppColors.contentSecondary,
        ),
      ],
    );
  }
}
