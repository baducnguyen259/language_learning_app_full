import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/common/widgets/custom_otp_bottom_sheet.dart';
import 'package:language_learning_app/app/data/exceptions/api_exception.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class RegisterController extends GetxController {
  final UserAuthService _userAuthService;
  RegisterController(this._userAuthService);

  final emailRegisterController = TextEditingController();
  final passwordRegisterController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  final RxBool isSavePolicy = false.obs;

  final otpController = TextEditingController();
  final RxInt resendTime = 60.obs;
  final RxString otpErrorMessage = ''.obs;

  void _showRegisterError(String message) {
    Get.snackbar('Đăng kí không thành công', message);
  }

  String? _validateRegistration({
    required String email,
    required String password,
    required String confirmPassword,
  }) {
    // if (name.length < 2) {
    //   return 'Họ và tên phải lớn hơn 2 kí tự';
    // }
    if (!GetUtils.isEmail(email)) {
      return 'Vui lòng nhập email hợp lệ';
    }
    if (RegExp(r'\s').hasMatch(password)) {
      return 'Mật khẩu không được chứa khoảng trắng';
    }
    if (password.length < 9 || password.length > 16) {
      return 'Mật khẩu phải có từ 9 đến 16 ký tự';
    }
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      return 'Mật khẩu phải có ít nhất một chữ thường';
    }
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      return 'Mật khẩu phải có ít nhất một chữ hoa';
    }
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      return 'Mật khẩu phải có ít nhất một chữ số';
    }
    if (confirmPassword != password) {
      return 'Mật khẩu xác nhận không khớp';
    }
    if (!isSavePolicy.value) {
      return 'Bạn phải đồng ý với điều khoản và chính sách bảo mật';
    }
    return null;
  }

  Future<void> _resendOtp(String email) async {
    try {
      final response = await _userAuthService.resendVerificationOtp(
        email: email,
      );
      Get.snackbar('Đã gửi lại OTP', response.message);
    } on ApiException catch (error) {
      otpErrorMessage.value = error.message;
    } catch (_) {
      otpErrorMessage.value = 'Không thể gửi lại OTP. Vui lòng thử lại';
    }
  }

  void _requestResendOtp(String email) {
    unawaited(_resendOtp(email));
  }

  Future<bool> _verifyOtp({required String email, required String otp}) async {
    otpErrorMessage.value = '';
    try {
      await _userAuthService.verifyEmail(email: email, otp: otp);
      return true;
    } on ApiException catch (error) {
      otpErrorMessage.value = error.message;
      return false;
    } catch (_) {
      otpErrorMessage.value = 'Không thể xác minh OTP. Vui lòng thử lại';
      return false;
    }
  }

  Future<bool> _openOtpBottomSheet(String email) async {
    final result = await Get.bottomSheet<bool>(
      CustomOtpBottomSheet(
        controller: otpController,
        email: email,
        errorMessage: otpErrorMessage,
        onConfirmOtp: (otp) {
          return _verifyOtp(email: email, otp: otp);
        },
        resendTime: resendTime,
        onResend: () {
          _requestResendOtp(email);
        },
      ),
      isScrollControlled: true,
    );
    return result ?? false;
  }

  Future<void> register() async {
    final email = emailRegisterController.text.trim().toLowerCase();
    final password = passwordRegisterController.text;
    final confirmPassword = confirmPasswordController.text;

    final validationMessage = _validateRegistration(
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    );
    if (validationMessage != null) {
      _showRegisterError(validationMessage);
      return;
    }
    try {
      await _userAuthService.register(
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        acceptTerms: isSavePolicy.value,
      );
      otpController.clear();
      otpErrorMessage.value = '';
      resendTime.value = 60;
      final isVerified = await _openOtpBottomSheet(email);
      if (isVerified) {
        await Get.offAllNamed<void>(AppRoutes.completeProfile);
      }
    } on ApiException catch (error) {
      _showRegisterError(error.message);
    } catch (_) {
      _showRegisterError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại');
    }
  }

  Future<void> signUpWithGoogle() async {
    if (!isSavePolicy.value) {
      _showRegisterError(
        'Bạn phải đồng ý với điều khoản và chính sách bảo mật',
      );
      return;
    }
    try {
      final session = await _userAuthService.signInWithGoogle(
        acceptTerms: true,
      );
      final route = session.user.requiresProfileSetup
          ? AppRoutes.completeProfile
          : AppRoutes.main;
      await Get.offAllNamed<void>(route);
    } on GoogleSignInException catch (error) {
      if (error.code == GoogleSignInExceptionCode.canceled) return;
      _showRegisterError('Không thể đăng ký bằng Google. Vui lòng thử lại');
    } on DioException catch (error) {
      _showRegisterError(ApiException.fromDioException(error).message);
    } on ApiException catch (error) {
      _showRegisterError(error.message);
    } catch (_) {
      _showRegisterError('Đăng ký bằng Google thất bại. Vui lòng thử lại');
    }
  }

  @override
  void onClose() {
    emailRegisterController.dispose();
    passwordRegisterController.dispose();
    confirmPasswordController.dispose();
    otpController.dispose();
    super.onClose();
  }
}
