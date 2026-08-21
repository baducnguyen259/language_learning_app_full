import 'package:dio/dio.dart';
import 'package:language_learning_app/app/data/exceptions/api_exception.dart';
import 'package:language_learning_app/app/data/models/user_profile_model.dart';

final class UserProfileProvider {
  const UserProfileProvider(this._dio);

  final Dio _dio;

  Map<String, dynamic> _readData(Response<Map<String, dynamic>> response) {
    final responseBody = response.data;
    if (responseBody == null) {
      throw const ApiException(
        code: 'INVALID_RESPONSE',
        message: 'Máy chủ không trả về dữ liệu hồ sơ',
      );
    }
    return responseBody['data'] as Map<String, dynamic>;
  }

  Never _throwApiException(DioException error) {
    throw ApiException.fromDioException(error);
  }

  Future<UserProfileModel> getMyProfile() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/users/me');
      return UserProfileModel.fromJson(_readData(response));
    } on DioException catch (error) {
      _throwApiException(error);
    }
  }

  Future<UserProfileModel> updateMyProfile({
    required String name,
    required String displayName,
    required String dateOfBirth,
    required UserGender gender,
  }) async {
    try {
      final response = await _dio.patch<Map<String, dynamic>>(
        '/users/me',
        data: <String, dynamic>{
          'name': name,
          'displayName': displayName,
          'dateOfBirth': dateOfBirth,
          'gender': gender.apiValue,
        },
      );
      return UserProfileModel.fromJson(_readData(response));
    } on DioException catch (error) {
      _throwApiException(error);
    }
  }
}
