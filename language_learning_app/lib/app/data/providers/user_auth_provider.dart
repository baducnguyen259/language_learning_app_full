import 'package:dio/dio.dart';
import 'package:language_learning_app/app/data/exceptions/api_exception.dart';
import 'package:language_learning_app/app/data/models/auth_session_model.dart';
import 'package:language_learning_app/app/data/models/message_response_model.dart';

final class UserAuthProvider {
  final Dio _dio;
  const UserAuthProvider(this._dio);

  Map<String, dynamic> _readData(Response<Map<String, dynamic>> response) {
    final responseBody = response.data;
    if (responseBody == null) {
      throw const ApiException(
        code: 'INVALID_RESPONSE',
        message: 'Máy chủ không trả về dữ liệu đăng nhập',
      );
    }
    return responseBody['data'] as Map<String, dynamic>;
  }

  Never _throwApiException(DioException error) {
    throw ApiException.fromDioException(error);
  }

  Future<MessageResponseModel> register({
    required String email,
    required String password,
    required String confirmPassword,
    required bool acceptTerms,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/register',
        data: <String, dynamic>{
          'email': email,
          'password': password,
          'confirmPassword': confirmPassword,
          'acceptTerms': acceptTerms,
        },
      );
      return MessageResponseModel.fromJson(_readData(response));
    } on DioException catch (error) {
      _throwApiException(error);
    }
  }

  Future<AuthSessionModel> verifyEmail({
    required String email,
    required String otp,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/verify-email',
        data: <String, dynamic>{'email': email, 'otp': otp},
      );
      return AuthSessionModel.fromJson(_readData(response));
    } on DioException catch (error) {
      _throwApiException(error);
    }
  }

  Future<MessageResponseModel> resendVerificationOtp({
    required String email,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/resend-verification-otp',
        data: <String, dynamic>{'email': email},
      );
      return MessageResponseModel.fromJson(_readData(response));
    } on DioException catch (error) {
      _throwApiException(error);
    }
  }

  Future<AuthSessionModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/login',
        data: <String, dynamic>{'email': email, 'password': password},
      );
      return AuthSessionModel.fromJson(_readData(response));
    } on DioException catch (error) {
      throw ApiException.fromDioException(error);
    }
  }
}
