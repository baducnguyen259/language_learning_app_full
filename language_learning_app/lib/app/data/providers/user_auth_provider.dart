import 'package:dio/dio.dart';
import 'package:language_learning_app/app/data/exceptions/api_exception.dart';
import 'package:language_learning_app/app/data/models/auth_session_model.dart';

final class UserAuthProvider {
  final Dio _dio;
  const UserAuthProvider(this._dio);

  Future<AuthSessionModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/login',
        data: <String, dynamic>{'email': email, 'password': password},
      );

      final responseBody = response.data;
      if (responseBody == null) {
        throw const ApiException(
          code: 'INVALID_RESPONSE',
          message: 'Không trả về dữ liệu đăng nhập',
        );
      }
      return AuthSessionModel.fromJson(
        responseBody['data'] as Map<String, dynamic>,
      );
    } on DioException catch (error) {
      throw ApiException.fromDioException(error);
    }
  }
}
