import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/custom_otp_bottom_sheet.dart';

class ForgotPasswordController extends GetxController {
  final emailController = TextEditingController();
  final otpController = TextEditingController();
  final resendTime = 60.obs;

  String _currentOtp = '123456';

  Future<void> sendVerificationCode() async {
    final email = emailController.text.trim();

    if (!GetUtils.isEmail(email)) {
      Get.snackbar('Thông báo', 'Vui lòng nhập email hợp lệ');
      return;
    }

    _currentOtp = '123456';
    otpController.clear();
    resendTime.value = 60;

    await Get.bottomSheet<bool>(
      CustomOtpBottomSheet(
        controller: otpController,
        email: email,
        resendTime: resendTime,
        onConfirmOtp: verifyOtp,
        onResend: resendVerificationCode,
      ),
      backgroundColor: Get.theme.colorScheme.surface,
      isScrollControlled: true,
      enableDrag: false,
      isDismissible: false,
    );
  }

  Future<bool> verifyOtp(String otp) async => otp == _currentOtp;

  void resendVerificationCode() {
    _currentOtp = '123456';
    otpController.clear();
  }

  @override
  void onClose() {
    emailController.dispose();
    otpController.dispose();
    super.onClose();
  }
}
