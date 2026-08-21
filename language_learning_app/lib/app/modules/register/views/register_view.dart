import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_checkbox.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/register/controllers/register_controller.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class RegisterView extends GetView<RegisterController> {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      showAppBar: true,
      title: 'Đăng ký',
      appBarTextStyle: AppTextStyle.headingH7Bold.copyWith(
        color: AppColors.contentPrimary,
      ),
      appBarBackgroundColor: Colors.transparent,
      backgroundColor: AppColors.backgroundSecondaryLightPurple,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [_buildTextAccount(), _buildFormRegister()],
          ),
        ),
      ),
    );
  }

  Widget _buildTextAccount() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CustomText(
            text: 'Tạo tài khoản mới',
            textAlign: TextAlign.center,
            style: AppTextStyle.headingH7Bold,
            color: AppColors.contentPrimary,
          ),
          CustomText(
            text: 'Bắt đầu hành trình chinh phục ngay hôm nay.',
            color: AppColors.contentSecondary,
            style: AppTextStyle.paragraphXSmall,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFormRegister() {
    return SizedBox(
      child: Column(
        spacing: 8,
        children: [
          CustomTextField(
            controller: controller.emailRegisterController,
            prefixWidget: CustomImage.asset(AppIcons.icMail),
            labelInput: 'Email',
            hintText: 'Nhập địa chỉ email',
            isRequired: true,
          ),
          CustomTextField(
            controller: controller.passwordRegisterController,
            prefixWidget: CustomImage.asset(AppIcons.icLock),
            labelInput: 'Mật khẩu',
            hintText: 'Tạo mật khẩu',
            isRequired: true,
            obscureText: true,
            suffixWidget: CustomImage.asset(AppIcons.icEyeHide).marginAll(10),
          ),
          CustomTextField(
            controller: controller.confirmPasswordController,
            prefixWidget: CustomImage.asset(AppIcons.icLock),
            labelInput: 'Xác nhận mật khẩu',
            hintText: 'Nhập lại mật khẩu',
            isRequired: true,
            obscureText: true,
            suffixWidget: CustomImage.asset(AppIcons.icEyeHide).marginAll(10),
          ),
          _buildPasswordRules(),
          _buildPolicyAgreement(),
          CustomButton.primary(
            title: 'Đăng ký',
            showLoading: true,
            onPressed: controller.register,
            backgroundColor: AppColors.purple100,
          ),
          _buildSocialLogin(),
          _buildRegisterText(),
        ],
      ).paddingSymmetric(horizontal: 16),
    );
  }

  Widget _buildPolicyAgreement() {
    return Obx(
      () => Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomCheckbox(
            initValue: controller.isSavePolicy.value,
            boxSize: 20,
            tickSize: 14,
            borderRadius: 4,
            checkedColor: AppColors.colorAccentGreen07,
            semanticLabel: 'Đồng ý với điều khoản và chính sách bảo mật',
            onChanged: (value) {
              controller.isSavePolicy.value = value ?? false;
            },
          ),
          Expanded(
            child: Text.rich(
              TextSpan(
                style: AppTextStyle.paragraphXSmall.copyWith(
                  color: AppColors.contentSecondary,
                ),
                children: [
                  const TextSpan(text: 'Tôi đồng ý với '),
                  TextSpan(
                    text: 'Điều khoản sử dụng',
                    style: AppTextStyle.labelXSmall.copyWith(
                      color: AppColors.purple100,
                    ),
                    recognizer: TapGestureRecognizer()..onTap = () {},
                  ),
                  const TextSpan(text: ' và '),
                  TextSpan(
                    text: 'Chính sách bảo mật',
                    style: AppTextStyle.labelXSmall.copyWith(
                      color: AppColors.purple100,
                    ),
                    recognizer: TapGestureRecognizer()..onTap = () {},
                  ),
                  const TextSpan(text: '.'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordRules() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundPrimary,
        borderRadius: const BorderRadius.all(Radius.circular(12)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(text: 'Mật khẩu phải:', style: AppTextStyle.labelMedSmall),
          const SizedBox(height: 6),
          _buildTextPass('Độ dài từ 9-16 ký tự'),
          _buildTextPass('Bao gồm ký tự số, chữ hoa, chữ thường'),
          _buildTextPass('Không chứa khoảng trắng'),
        ],
      ).marginAll(12),
    );
  }

  Widget _buildTextPass(String text) {
    return Row(
      children: [
        CustomImage.asset(AppIcons.icCheckOutlined),
        const SizedBox(width: 4),
        Expanded(
          child: CustomText(text: text, style: AppTextStyle.paragraphXSmall),
        ),
      ],
    );
  }

  Widget _buildSocialLogin() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: Divider(
                color: AppColors.borderPrimaryLightGrayScale,
                thickness: 1,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: CustomText(
                text: 'Hoặc đăng ký với',
                color: AppColors.colorNeutralN07,
                style: AppTextStyle.labelMedSmall,
              ),
            ),
            Expanded(
              child: Divider(
                color: AppColors.borderPrimaryLightGrayScale,
                thickness: 1,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        CustomButton(
          backgroundColor: AppColors.colorNeutralN01,
          foregroundColor: AppColors.colorNeutralN11,
          radius: 14,
          showLoading: true,
          onPressed: controller.signUpWithGoogle,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CustomImage.asset(AppIcons.icGoogle, width: 20, height: 20),
              const SizedBox(width: 24),
              CustomText(
                text: 'Tiếp tục với Google',
                color: AppColors.colorNeutralN11,
                style: AppTextStyle.buttonL,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRegisterText() {
    return Center(
      child: Text.rich(
        TextSpan(
          text: 'Bạn đã có tài khoản? ',
          style: AppTextStyle.labelMedSmall.copyWith(
            color: AppColors.contentSecondary,
          ),
          children: [
            TextSpan(
              text: 'Đăng nhập ngay',
              style: AppTextStyle.labelMedSmall.copyWith(
                color: AppColors.purple100,
              ),
              recognizer: TapGestureRecognizer()
                ..onTap = () => Get.toNamed(Routes.LOGIN),
            ),
          ],
        ),
      ),
    );
  }
}
