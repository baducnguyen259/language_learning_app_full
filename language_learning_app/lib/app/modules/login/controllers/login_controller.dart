import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/data/services/user_auth_service.dart';
import 'package:language_learning_app/app/routes/app_pages.dart';

class LoginController extends GetxController {
  LoginController(this._userAuthService);

  final UserAuthService _userAuthService;

  final emailLoginController = TextEditingController();
  final passwordLoginController = TextEditingController();
  final RxBool isSavePassword = RxBool(false);

  Future<void> signInWithGoogle() async {
    try {
      await _userAuthService.signInWithGoogle();
      await Get.offAllNamed<void>(AppRoutes.main);
    } on GoogleSignInException catch (error) {
      if (error.code == GoogleSignInExceptionCode.canceled) return;

      _showLoginError('Không thể đăng nhập Google. Vui lòng thử lại.');
    } on DioException catch (error) {
      _showLoginError(_messageFromDioError(error));
    } on StateError catch (error) {
      _showLoginError(error.message);
    } catch (_) {
      _showLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  }

  String _messageFromDioError(DioException error) {
    final responseData = error.response?.data;

    if (responseData is Map<String, dynamic>) {
      final errorData = responseData['error'];
      if (errorData is Map<String, dynamic>) {
        final message = errorData['message'];
        if (message is String && message.isNotEmpty) return message;
        if (message is List<dynamic> && message.isNotEmpty) {
          return message.first.toString();
        }
      }
    }

    if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      return 'Không thể kết nối backend. Hãy kiểm tra server và địa chỉ API.';
    }

    return 'Đăng nhập Google thất bại. Vui lòng thử lại.';
  }

  void _showLoginError(String message) {
    Get.snackbar('Đăng nhập thất bại', message);
  }

  @override
  void onClose() {
    emailLoginController.dispose();
    passwordLoginController.dispose();
    super.onClose();
  }
}
