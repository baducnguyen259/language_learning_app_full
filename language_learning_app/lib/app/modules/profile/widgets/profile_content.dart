import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/modules/profile/controllers/profile_controller.dart';

class ProfileContent extends GetView<ProfileController> {
  const ProfileContent({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final horizontalPadding = constraints.maxWidth >= 600 ? 40.0 : 16.0;

        return SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(
            horizontalPadding,
            24,
            horizontalPadding,
            24,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 680),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildProfileHeader(),
                  const SizedBox(height: 20),
                  _buildLearningSection(),
                  const SizedBox(height: 18),
                  _buildSettingsSection(),
                  const SizedBox(height: 18),
                  _buildSupportSection(),
                  const SizedBox(height: 18),
                  _buildLogoutButton(),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfileHeader() {
    return Column(
      children: [
        _buildAvatar(),
        const SizedBox(height: 10),
        CustomText(
          text: 'Nguyễn Bá Đức',
          style: AppTextStyle.labelMedium,
          color: AppColors.contentPrimary,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 2),
        CustomText(
          text: 'duc@example.com',
          style: AppTextStyle.bodyXSReg,
          color: AppColors.contentSecondary,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.yellow15,
            borderRadius: BorderRadius.circular(12),
          ),
          child: CustomText(
            text: '🏆 Level 12 • Trung cấp',
            style: AppTextStyle.bodyXSMed,
            color: AppColors.contentSecondaryYellowP,
          ),
        ),
        const SizedBox(height: 14),
        CustomButton(
          width: 148,
          buttonSize: ButtonSizeEnum.EXTRA_SMALL,
          radius: 16,
          showBorder: true,
          borderColor: AppColors.contentSecondary,
          backgroundColor: AppColors.backgroundPrimary,
          foregroundColor: AppColors.contentPrimary,
          onPressed: () {},
          child: CustomText(
            text: 'Chỉnh sửa hồ sơ',
            style: AppTextStyle.buttonS,
            color: AppColors.contentPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildAvatar() {
    return SizedBox.square(
      dimension: 64,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 56,
            height: 56,
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.purple100,
            ),
            child: CircleAvatar(
              backgroundColor: AppColors.backgroundPPLightAccent,
              child: CustomImage.network(
                '',
                width: 48,
                height: 48,
                fit: BoxFit.cover,
                errorWidget: Icon(
                  Icons.person_outline,
                  color: AppColors.contentPPAccent,
                ),
                semanticLabel: 'Ảnh đại diện',
              ),
            ),
          ),
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                color: AppColors.purple100,
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.backgroundPrimary,
                  width: 2,
                ),
              ),
              alignment: Alignment.center,
              child: CustomImage.asset(
                AppIcons.icCamera,
                width: 11,
                height: 11,
                color: AppColors.contentPrimaryInvert,
                semanticLabel: 'Đổi ảnh đại diện',
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLearningSection() {
    return _buildSection(
      title: 'Học tập',
      children: [
        _buildSettingTile(
          icon: AppIcons.icGlobe,
          title: 'Ngôn ngữ đang học',
          value: 'Tiếng Hàn',
          onTap: () {},
        ),
        _buildSettingTile(
          icon: AppIcons.icClockDash,
          title: 'Mục tiêu hằng ngày',
          value: '15 phút',
          onTap: () {},
        ),
        _buildSettingTile(
          icon: AppIcons.icBell,
          title: 'Nhắc nhở học tập',
          value: '20:00',
          onTap: () {},
        ),
      ],
    );
  }

  Widget _buildSettingsSection() {
    return _buildSection(
      title: 'Cài đặt',
      children: [
        _buildSettingTile(
          icon: AppIcons.icAccount,
          title: 'Thông tin cá nhân',
          onTap: () {},
        ),
        Obx(
          () => _buildSettingTile(
            icon: AppIcons.icListen,
            title: 'Hiệu ứng âm thanh',
            onTap: () => controller.setSoundEffectsEnabled(
              !controller.isSoundEffectsEnabled.value,
            ),
            trailing: _buildSwitch(
              value: controller.isSoundEffectsEnabled.value,
              onChanged: controller.setSoundEffectsEnabled,
            ),
          ),
        ),
        Obx(
          () => _buildSettingTile(
            icon: AppIcons.icEyeHide,
            title: 'Chế độ tối',
            onTap: () => controller.setDarkModeEnabled(
              !controller.isDarkModeEnabled.value,
            ),
            trailing: _buildSwitch(
              value: controller.isDarkModeEnabled.value,
              onChanged: controller.setDarkModeEnabled,
            ),
          ),
        ),
        _buildSettingTile(
          icon: AppIcons.icGlobe,
          title: 'Ngôn ngữ ứng dụng',
          value: 'Tiếng Việt',
          onTap: () {},
        ),
      ],
    );
  }

  Widget _buildSupportSection() {
    return _buildSection(
      title: 'Hỗ trợ & Thông tin',
      children: [
        _buildSettingTile(
          icon: AppIcons.icMessagesQuestionCircle,
          title: 'Trung tâm trợ giúp',
          onTap: () {},
        ),
        _buildSettingTile(
          icon: AppIcons.icLesson,
          title: 'Điều khoản sử dụng',
          onTap: () {},
        ),
        _buildSettingTile(
          icon: AppIcons.icLock,
          title: 'Chính sách bảo mật',
          onTap: () {},
        ),
      ],
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 8),
          child: CustomText(
            text: title,
            style: AppTextStyle.labelXSmall,
            color: AppColors.purple100,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: AppColors.backgroundPrimary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              for (var index = 0; index < children.length; index++) ...[
                children[index],
                if (index < children.length - 1)
                  Divider(
                    height: 1,
                    color: AppColors.borderPrimaryLightGrayScale,
                  ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSettingTile({
    required String icon,
    required String title,
    String? value,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return Material(
      color: AppColors.backgroundPrimary,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
          child: Row(
            children: [
              CustomImage.asset(
                icon,
                width: 18,
                height: 18,
                color: AppColors.contentSecondary,
                semanticLabel: title,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomText(
                  text: title,
                  style: AppTextStyle.bodySMed,
                  color: AppColors.contentPrimary,
                  maxLines: 1,
                  textOverflow: TextOverflow.ellipsis,
                ),
              ),
              if (value != null) ...[
                const SizedBox(width: 8),
                CustomText(
                  text: value,
                  style: AppTextStyle.bodySMed,
                  color: AppColors.contentSecondary,
                  maxLines: 1,
                  textOverflow: TextOverflow.ellipsis,
                ),
              ],
              if (trailing != null) ...[
                const SizedBox(width: 8),
                trailing,
              ] else ...[
                const SizedBox(width: 6),
                CustomImage.asset(
                  AppIcons.icActionArrowRight,
                  width: 14,
                  height: 14,
                  color: AppColors.contentTertiary,
                  semanticLabel: 'Mở $title',
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwitch({
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SizedBox(
      width: 36,
      height: 30,
      child: FittedBox(
        fit: BoxFit.fill,
        child: Switch(
          value: value,
          onChanged: onChanged,
          activeThumbColor: AppColors.backgroundPrimary,
          activeTrackColor: AppColors.purple100,
          inactiveThumbColor: AppColors.backgroundPrimary,
          inactiveTrackColor: AppColors.backgroundPPLightAccent,
          trackOutlineColor: WidgetStatePropertyAll(
            AppColors.borderPrimaryLightGrayScale,
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return CustomButton.primary(
      onPressed: controller.logout,
      radius: 16,
      title: 'Đăng xuất',
      backgroundColor: AppColors.red100,
    );
  }
}
