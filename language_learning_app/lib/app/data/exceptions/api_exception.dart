import 'package:dio/dio.dart';

final class ApiException implements Exception {
  final String code;
  final String message;
  final int? statusCode;
  final String? requestId;

  const ApiException({
    required this.code,
    required this.message,
    this.statusCode,
    this.requestId,
  });

  factory ApiException.fromDioException(DioException exception) {
    final responseData = exception.response?.data;

    if (responseData is Map<String, dynamic>) {
      final errorData = responseData['error'];

      if (errorData is Map<String, dynamic>) {
        return ApiException(
          code: errorData['code'] as String? ?? 'HTTP_ERROR',
          message: _parseMessage(errorData['message']),
          statusCode:
              errorData['statusCode'] as int? ?? exception.response?.statusCode,
          requestId: responseData['requestId'] as String?,
        );
      }
    }
    if (exception.type == DioExceptionType.connectionError ||
        exception.type == DioExceptionType.connectionTimeout ||
        exception.type == DioExceptionType.receiveTimeout ||
        exception.type == DioExceptionType.sendTimeout) {
      return const ApiException(
        code: "NETWORK_ERROR",
        message: 'Không thể kết nối máy chủ.Vui lòng kiểm tra kết nối',
      );
    }

    return ApiException(
      code: "UNKNOWN_ERROR",
      message: 'Đã xảy  ra lỗi.Vui lòng thử lại',
      statusCode: exception.response?.statusCode,
    );
  }

  static String _parseMessage(Object? value) {
    if (value is String && value.isNotEmpty) {
      return value;
    }
    if (value is List<dynamic> && value.isNotEmpty) {
      return List<String>.from(value).join('\n');
    }
    return 'Đã xảy ra lỗi.Vui lòng thử lại';
  }

  @override
  String toString() => message;
}
