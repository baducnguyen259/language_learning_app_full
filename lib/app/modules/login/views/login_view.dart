import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';
import 'package:language_learning_app/app/common/widgets/base_scaffold.dart';
import 'package:language_learning_app/app/common/widgets/custom_button.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_text.dart';
import 'package:language_learning_app/app/common/widgets/custom_text_field.dart';
import 'package:language_learning_app/app/modules/login/controllers/login_controller.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseScaffold(
      appBarTextStyle: AppTextStyle.headingH7Bold.copyWith(
        color: HexColor('#1C1B23'),
      ),
      appBarBackgroundColor: AppColors.white1,
      backgroundColor: HexColor('F6F2FE'),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildLogo(),
              const SizedBox(height: 12),
              _buildAppTitle(),
              _buildFormLogin(),
              const SizedBox(height: 12),
              _buildSocialLogin(),
              const SizedBox(height: 12),
              _buildRegisterText(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Container(
      width: Get.width,
      height: 120,
      decoration: BoxDecoration(color: AppColors.blue5),
    );
  }

  Widget _buildAppTitle() {
    // return Column(
    //   children: [
    //     CustomText(
    //       text: 'Chào mừng bạn quay lại!',
    //       textAlign: TextAlign.center,
    //       color: HexColor('#1C1B23'),
    //     ),
    //     CustomText(
    //       text: 'Đăng nhập để tiếp tục hành trình học của bạn.',
    //       style: AppTextStyle.labelXSmall,
    //       textAlign: TextAlign.center,
    //     ),
    //   ],
    // );
    return CustomText(
      text: 'Chào mừng bạn quay lại!',
      textAlign: TextAlign.center,
      color: HexColor('#1C1B23'),
    );
  }

  Widget _buildFormLogin() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CustomTextField(
          controller: controller.emailLoginController,
          isRequired: true,
          labelInput: 'Email',
          labelStyle: AppTextStyle.labelMedSmall,
          prefixWidget: CustomImage.asset(AppIcons.icMail),
          hintText: 'Nhập địa chỉ email',
          hintStyle: AppTextStyle.labelSmall,
        ),
        CustomTextField(
          controller: controller.passwordLoginController,
          isRequired: true,
          labelInput: 'Mật khẩu',
          labelStyle: AppTextStyle.labelMedSmall,
          prefixWidget: CustomImage.asset(AppIcons.icLock),
          hintText: 'Nhập mật khẩu',
          hintStyle: AppTextStyle.labelSmall,
          suffixWidget: CustomImage.asset(
            AppIcons.icEye,
            width: 24,
            height: 24,
          ).marginAll(12),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            SizedBox(
              width: 20,
              height: 20,
              child: Checkbox(
                value: controller.isSavePassword.value,
                onChanged: (value) {},
                side: BorderSide(color: AppColors.contentLarge, width: 1),
                activeColor: AppColors.nvBrand500,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),

            const SizedBox(width: 8),
            CustomText(text: 'Nhớ mật khẩu', style: AppTextStyle.labelMedSmall),
            const Spacer(),
            GestureDetector(
              onTap: () {},
              child: CustomText(
                text: 'Quên mật khẩu?',
                style: AppTextStyle.labelMedSmall,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        CustomButton.primary(
          title: 'Đăng nhập',
          onPressed: () {},
          backgroundColor: AppColors.red15,
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
                text: 'Hoặc tiếp tục với',
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
          onPressed: () {},
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
          text: 'Bạn chưa có tài khoản?',
          style: AppTextStyle.labelMedSmall.copyWith(
            color: HexColor('#514C5D'),
          ),
          children: [
            TextSpan(
              text: 'Đăng kí ngay',
              style: AppTextStyle.labelMedSmall.copyWith(
                color: HexColor('#5B43E8'),
                fontWeight: FontWeight.w400,
              ),
              recognizer: TapGestureRecognizer()
                ..onTap = () => Get.toNamed(Routes.REGISTER),
            ),
          ],
        ),
      ),
    );
  }
}
